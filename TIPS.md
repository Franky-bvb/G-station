# G-Station 游戏站使用小提示

## 游戏管理技巧

1. **添加新游戏后重新构建网站**：
   - 每次添加或修改游戏数据后，都需要运行`npm run build`命令
   - 这将根据最新的游戏数据重新生成所有HTML文件

2. **游戏显示位置控制**：
   - 在游戏的JSON文件中，以下属性控制游戏的显示位置：
     ```json
     "featured": true,  // 控制是否在首页"精选游戏"部分显示
     "popular": true,   // 控制是否在"热门游戏"部分显示
     "new": true,       // 控制是否在"新游戏"部分显示
     ```
   - 如果将这些属性设置为`false`，游戏不会显示在对应部分
   - 无论这些属性如何设置，游戏始终会显示在对应分类页面的"所有游戏"部分

3. **疑难排查**：
   - 游戏不显示？检查JSON文件的`featured`/`popular`/`new`属性
   - 图片不显示？确保`thumbnail_url`路径正确
   - 预览服务器无法启动？尝试使用其他端口或关闭占用端口的程序

## 预览网站的不同方法

1. **标准预览**：
   ```bash
   npm run preview
   ```
   在端口3000上启动http-server预览

2. **使用Express预览（推荐）**：
   ```bash
   npm run preview-alt
   ```
   启动一个智能Express服务器，会自动处理端口占用问题

3. **使用serve预览**：
   ```bash
   npm run serve
   ```
   使用serve包启动一个轻量级服务器

4. **直接打开文件**：
   - 在文件浏览器中找到`dist/index.html`文件
   - 双击直接在浏览器中打开（某些功能可能受限）

## JSON文件格式说明

游戏JSON文件格式示例：
```json
{
  "title": "游戏名称",                 // 游戏显示名称
  "slug": "game-name",                // URL中使用的名称（小写，用连字符）
  "category": "action",               // 游戏分类（action/puzzle/strategy/sports之一）
  "category_display": "Action",       // 分类的显示名称
  "description_short": "简短描述",     // 游戏卡片上显示的简短描述
  "description": "中等长度描述",       // 用于元数据的描述
  "description_full": "详细描述...",   // 游戏页面上显示的完整描述
  "controls": "游戏控制说明",          // 控制方法说明
  "thumbnail_url": "/path/to/image",  // 游戏缩略图URL
  "game_url": "游戏iframe的URL",      // 游戏iframe嵌入URL
  "tags": ["tag1", "tag2"],          // 游戏标签，用于相关游戏推荐
  "featured": true,                   // 是否在首页"精选游戏"部分显示
  "popular": true,                    // 是否在"热门游戏"部分显示
  "new": true,                        // 是否在"新游戏"部分显示
  "related_games": ["game1", "game2"] // 相关游戏的slug（可以为空数组）
}
```

## 常见错误解决方案

1. **端口占用问题**：
   ```
   Error: listen EADDRINUSE: address already in use
   ```
   解决方法：
   - 关闭占用端口的程序
   - 使用其他端口启动服务器
   - 使用智能预览命令`npm run preview-alt`

2. **构建错误**：
   ```
   Error: ENOENT: no such file or directory
   ```
   解决方法：
   - 确保所有引用的文件和目录都存在
   - 检查文件路径是否正确

3. **游戏无法加载**：
   - 检查游戏URL是否有效
   - 确保游戏允许被iframe嵌入（没有X-Frame-Options限制） 