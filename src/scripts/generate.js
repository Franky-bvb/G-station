/**
 * G Station - Static Site Generator
 * 
 * This script generates static HTML files from templates and game data.
 * It can be used to generate the entire site or just update specific pages.
 */

const fs = require('fs');
const path = require('path');
const Handlebars = require('handlebars');

// Site configuration
const config = {
    siteUrl: 'https://yoursite.com',
    categories: ['action', 'puzzle', 'strategy', 'sports'],
    outputDir: path.join(__dirname, '../../dist'),
    templatesDir: path.join(__dirname, '../templates'),
    gamesDir: path.join(__dirname, '../games'),
    componentsDir: path.join(__dirname, '../components'),
    assetsDir: path.join(__dirname, '../assets')
};

// Register Handlebars partials
function registerPartials() {
    const components = fs.readdirSync(config.componentsDir);
    components.forEach(file => {
        if (path.extname(file) === '.html') {
            const name = path.basename(file, '.html');
            const content = fs.readFileSync(path.join(config.componentsDir, file), 'utf8');
            Handlebars.registerPartial(name, content);
        }
    });
}

// Load and compile template
function loadTemplate(templateName) {
    const templatePath = path.join(config.templatesDir, `${templateName}.html`);
    const templateContent = fs.readFileSync(templatePath, 'utf8');
    return Handlebars.compile(templateContent);
}

// Load all game data
function loadGameData() {
    const games = {};
    
    config.categories.forEach(category => {
        games[category] = [];
        const categoryDir = path.join(config.gamesDir, category);
        
        if (fs.existsSync(categoryDir)) {
            const files = fs.readdirSync(categoryDir);
            files.forEach(file => {
                if (path.extname(file) === '.json') {
                    try {
                        const gameData = JSON.parse(fs.readFileSync(path.join(categoryDir, file), 'utf8'));
                        games[category].push(gameData);
                    } catch (error) {
                        console.error(`Error loading game data from ${file}:`, error);
                    }
                }
            });
        }
    });
    
    return games;
}

// Generate game page
function generateGamePage(gameData) {
    const template = loadTemplate('game-template');
    
    // Find related games
    const relatedGames = findRelatedGames(gameData);
    
    // Prepare template data
    const templateData = {
        GAME_TITLE: gameData.title,
        GAME_SLUG: gameData.slug,
        GAME_CATEGORY: gameData.category,
        GAME_DESCRIPTION: gameData.description,
        GAME_DESCRIPTION_FULL: gameData.description_full,
        GAME_THUMBNAIL_URL: gameData.thumbnail_url,
        GAME_URL: gameData.game_url,
        GAME_CONTROLS: gameData.controls,
        GAME_KEYWORDS: [gameData.category, ...gameData.tags].join(', '),
        SITE_URL: config.siteUrl,
        RELATED_GAMES: generateGameCards(relatedGames, true)
    };
    
    // Render template
    let htmlContent = addGoogleAnalytics(template(templateData));
    
    // Create output directory if it doesn't exist
    const outputDir = path.join(config.outputDir, 'games', gameData.category);
    if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
    }
    
    // Write output file
    const outputPath = path.join(outputDir, `${gameData.slug}.html`);
    fs.writeFileSync(outputPath, htmlContent);
    
    console.log(`Generated game page: ${outputPath}`);
}

// Find related games
function findRelatedGames(gameData, limit = 4) {
    const allGames = loadGameData();
    const relatedGames = [];
    
    // First try to find games explicitly listed as related
    if (gameData.related_games && gameData.related_games.length > 0) {
        gameData.related_games.forEach(relatedSlug => {
            const category = gameData.category; // Assume related games are in same category by default
            
            const relatedGame = allGames[category].find(g => g.slug === relatedSlug);
            if (relatedGame && relatedGame.slug !== gameData.slug) {
                relatedGames.push(relatedGame);
            }
        });
    }
    
    // If we still need more related games, find games with similar tags
    if (relatedGames.length < limit && gameData.tags) {
        const otherGamesInCategory = allGames[gameData.category].filter(g => 
            g.slug !== gameData.slug && !relatedGames.find(rg => rg.slug === g.slug)
        );
        
        // Sort by number of matching tags
        const gamesWithMatchingTags = otherGamesInCategory.map(g => {
            const matchingTags = g.tags ? g.tags.filter(tag => gameData.tags.includes(tag)) : [];
            return {
                game: g,
                matchCount: matchingTags.length
            };
        }).filter(item => item.matchCount > 0)
          .sort((a, b) => b.matchCount - a.matchCount);
        
        // Add games with matching tags until we reach the limit
        for (const item of gamesWithMatchingTags) {
            if (relatedGames.length < limit) {
                relatedGames.push(item.game);
            } else {
                break;
            }
        }
    }
    
    // If we still need more games, just add random games from the same category
    if (relatedGames.length < limit) {
        const remainingGames = allGames[gameData.category].filter(g => 
            g.slug !== gameData.slug && !relatedGames.find(rg => rg.slug === g.slug)
        );
        
        // Shuffle remaining games to get random ones
        const shuffled = remainingGames.sort(() => 0.5 - Math.random());
        
        // Add random games until we reach the limit
        for (const game of shuffled) {
            if (relatedGames.length < limit) {
                relatedGames.push(game);
            } else {
                break;
            }
        }
    }
    
    return relatedGames.slice(0, limit);
}

// Generate game cards HTML
function generateGameCards(games, lazyLoad = false) {
    if (!games || games.length === 0) {
        return ''; // 如果没有游戏，返回空字符串
    }

    try {
        const gameCardTemplate = Handlebars.compile(
            fs.readFileSync(path.join(config.componentsDir, 'game-card.html'), 'utf8')
        );
        
        return games.map(game => {
            try {
                const cardHtml = gameCardTemplate({
                    GAME_TITLE: game.title,
                    GAME_SLUG: game.slug,
                    GAME_CATEGORY: game.category,
                    GAME_CATEGORY_DISPLAY: game.category_display,
                    GAME_DESCRIPTION_SHORT: game.description_short,
                    GAME_THUMBNAIL_URL: game.thumbnail_url,
                    lazy_load: lazyLoad
                });
                return cardHtml;
            } catch (err) {
                console.error(`Error rendering game card for ${game.title}:`, err);
                return '';
            }
        }).join('\n');
    } catch (err) {
        console.error('Error compiling game card template:', err);
        return '';
    }
}

// Generate category index page
function generateCategoryPage(category) {
    const template = loadTemplate('category-template');
    const games = loadGameData()[category] || [];
    
    // 添加一个空检查，确保有游戏可显示
    if (games.length === 0) {
        console.warn(`Warning: No games found for category "${category}".`);
        try {
            // 添加一个默认的示例游戏
            const sampleGame = JSON.parse(fs.readFileSync(path.join(config.gamesDir, 'action', 'sample-game.json'), 'utf8'));
            // 修改分类
            sampleGame.category = category;
            sampleGame.category_display = category.charAt(0).toUpperCase() + category.slice(1);
            games.push(sampleGame);
        } catch (err) {
            console.error(`Error adding sample game to category "${category}":`, err);
        }
    }
    
    // Sort games by popularity and newness
    const popularGames = games.filter(game => game.popular).slice(0, 8);
    const allGames = [...games]; // Make a copy of the array
    
    // Prepare template data
    const templateData = {
        CATEGORY_NAME: category.charAt(0).toUpperCase() + category.slice(1),
        CATEGORY_SLUG: category,
        CATEGORY_DESCRIPTION: `Discover and play the best free ${category} games on G Station. Enjoy a wide variety of ${category} games that you can play directly in your browser.`,
        POPULAR_CATEGORY_GAMES: generateGameCards(popularGames, false),
        ALL_CATEGORY_GAMES: generateGameCards(allGames, true),
        SITE_URL: config.siteUrl
    };
    
    // Add active class for current category in navigation
    templateData[`${category}_active`] = true;
    
    try {
        // Render template
        let htmlContent = addGoogleAnalytics(template(templateData));
        
        // Create output directory if it doesn't exist
        const outputDir = path.join(config.outputDir, 'games', category);
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, { recursive: true });
        }
        
        // Write output file
        const outputPath = path.join(outputDir, 'index.html');
        fs.writeFileSync(outputPath, htmlContent);
        
        console.log(`Generated category page: ${outputPath}`);
    } catch (err) {
        console.error(`Error generating category page for "${category}":`, err);
    }
}

// Generate home page
function generateHomePage() {
    const template = loadTemplate('index-template');
    const allGames = loadGameData();
    
    // Get featured, popular, and new games
    const featuredGames = [];
    const popularGames = [];
    const newGames = [];
    
    Object.values(allGames).forEach(categoryGames => {
        categoryGames.forEach(game => {
            if (game.featured) featuredGames.push(game);
            if (game.popular) popularGames.push(game);
            if (game.new) newGames.push(game);
        });
    });
    
    // 这里添加一个空检查，确保有游戏可显示
    if (featuredGames.length === 0 && popularGames.length === 0 && newGames.length === 0) {
        console.warn('Warning: No games found to display on the home page.');
        // 添加一个默认的示例游戏
        const sampleGame = JSON.parse(fs.readFileSync(path.join(config.gamesDir, 'action', 'sample-game.json'), 'utf8'));
        featuredGames.push(sampleGame);
        popularGames.push(sampleGame);
        newGames.push(sampleGame);
    }

    // Limit the number of games shown
    const limitedFeatured = featuredGames.slice(0, 6);
    const limitedPopular = popularGames.slice(0, 8);
    const limitedNew = newGames.slice(0, 8);
    
    // Prepare template data
    const templateData = {
        FEATURED_GAMES: generateGameCards(limitedFeatured, false),
        POPULAR_GAMES: generateGameCards(limitedPopular, true),
        NEW_GAMES: generateGameCards(limitedNew, true),
        SITE_URL: config.siteUrl
    };
    
    try {
        // Render template
        let htmlContent = addGoogleAnalytics(template(templateData));
        
        // Write output file
        const outputPath = path.join(config.outputDir, 'index.html');
        fs.writeFileSync(outputPath, htmlContent);
        
        console.log(`Generated home page: ${outputPath}`);
    } catch (err) {
        console.error('Error generating home page:', err);
    }
}

// Copy assets to output directory
function copyAssets() {
    const destDir = path.join(config.outputDir, 'assets');
    
    // Create destination directory if it doesn't exist
    if (!fs.existsSync(destDir)) {
        fs.mkdirSync(destDir, { recursive: true });
    }
    
    // Function to copy directory recursively
    function copyDir(src, dest) {
        fs.mkdirSync(dest, { recursive: true });
        const entries = fs.readdirSync(src, { withFileTypes: true });
        
        for (const entry of entries) {
            const srcPath = path.join(src, entry.name);
            const destPath = path.join(dest, entry.name);
            
            if (entry.isDirectory()) {
                copyDir(srcPath, destPath);
            } else {
                fs.copyFileSync(srcPath, destPath);
            }
        }
    }
    
    // Copy assets directory recursively
    copyDir(config.assetsDir, destDir);
    
    console.log('Copied assets to output directory');
}

// Generate the entire site
function generateSite() {
    console.log('Starting site generation...');
    
    // Create output directory if it doesn't exist
    if (!fs.existsSync(config.outputDir)) {
        fs.mkdirSync(config.outputDir, { recursive: true });
    }
    
    // Register Handlebars partials
    registerPartials();
    
    // Load all game data
    const allGames = loadGameData();
    
    // Generate home page
    generateHomePage();
    
    // Generate category pages
    config.categories.forEach(category => {
        generateCategoryPage(category);
    });
    
    // Generate game pages
    Object.values(allGames).forEach(categoryGames => {
        categoryGames.forEach(game => {
            generateGamePage(game);
        });
    });
    
    // Copy assets to output directory
    copyAssets();
    
    console.log('Site generation completed successfully!');
}

// Generate a new game page from a template
function generateNewGame(gameName, gameCategory, gameUrl) {
    // Validate inputs
    if (!gameName || !gameCategory || !gameUrl) {
        console.error('Error: Game name, category, and URL are required');
        return;
    }
    
    // Check if category is valid
    if (!config.categories.includes(gameCategory)) {
        console.error(`Error: Invalid category "${gameCategory}". Valid categories are: ${config.categories.join(', ')}`);
        return;
    }
    
    // Generate slug from game name
    const slug = gameName.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
    
    // Create game data
    const gameData = {
        title: gameName,
        slug: slug,
        category: gameCategory,
        category_display: gameCategory.charAt(0).toUpperCase() + gameCategory.slice(1),
        description_short: `Play ${gameName} online for free on G Station`,
        description: `${gameName} is an exciting ${gameCategory} game that you can play online for free on G Station.`,
        description_full: `${gameName} is an exciting ${gameCategory} game that you can play online for free on G Station. Enjoy hours of fun with this browser-based game.`,
        controls: "Use your mouse and keyboard to play. See in-game instructions for more details.",
        thumbnail_url: `/assets/images/games/${gameCategory}/${slug}-thumbnail.jpg`,
        game_url: gameUrl,
        tags: [gameCategory],
        featured: false,
        popular: false,
        new: true,
        related_games: []
    };
    
    // Create output directory if it doesn't exist
    const categoryDir = path.join(config.gamesDir, gameCategory);
    if (!fs.existsSync(categoryDir)) {
        fs.mkdirSync(categoryDir, { recursive: true });
    }
    
    // Write game data to file
    const outputPath = path.join(categoryDir, `${slug}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(gameData, null, 2));
    
    console.log(`Generated new game data: ${outputPath}`);
    
    // Generate the game page
    generateGamePage(gameData);
    
    // Regenerate the category page
    generateCategoryPage(gameCategory);
    
    // Regenerate the home page
    generateHomePage();
    
    console.log(`New game "${gameName}" added successfully!`);
}

// Command line interface
function processCLI() {
    const args = process.argv.slice(2);
    
    if (args.length === 0 || args[0] === 'build') {
        // Generate the entire site
        generateSite();
    } else if (args[0] === 'new-game' && args.length >= 4) {
        // Generate a new game
        const gameName = args[1];
        const gameCategory = args[2];
        const gameUrl = args[3];
        generateNewGame(gameName, gameCategory, gameUrl);
    } else {
        console.log('Usage:');
        console.log('  node generate.js build           - Generate the entire site');
        console.log('  node generate.js new-game "Game Name" category game-url  - Add a new game');
    }
}

// Run the CLI if this script is executed directly
if (require.main === module) {
    processCLI();
}

module.exports = {
    generateSite,
    generateNewGame
};

// 添加Google Analytics代码到HTML内容
function addGoogleAnalytics(htmlContent) {
    return htmlContent.replace('</body>', `
    <!-- Google Analytics代码 -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=G-GW6KBYZ1L1"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-GW6KBYZ1L1');
    </script>
</body>`);
} 