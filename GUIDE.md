# G Station 使用指南

这个指南将帮助您了解如何使用 G Station 框架来管理和添加游戏。

## 初始设置

1. 确保您已安装 [Node.js](https://nodejs.org/) (推荐版本 14.x 或更高)

2. 克隆仓库后，安装依赖：

```bash
npm install
```

## 添加新游戏

添加新游戏的步骤非常简单。您可以通过以下两种方式之一来添加游戏：

### 方法1：使用命令行工具（推荐）

我们提供了一个简单的命令行工具，可以自动生成游戏数据和页面：

```bash
npm run new-game "游戏名称" 游戏分类 游戏URL
```

例如：

```bash
npm run new-game "太空射击" action https://example.com/games/space-shooter
```

这个命令会：
- 创建一个基本的游戏数据文件
- 生成一个游戏页面
- 更新类别页面
- 更新首页

### 方法2：手动添加

如果您需要更多的自定义选项，您可以手动添加游戏：

1. 在相应的分类目录 (`src/games/[分类]/`) 下创建一个新的 JSON 文件
2. 参考以下模板填写游戏信息：

```json
{
  "title": "游戏名称",
  "slug": "游戏名称的英文标识（用连字符替换空格）",
  "category": "分类（action/puzzle/strategy/sports之一）",
  "category_display": "分类显示名称",
  "description_short": "简短描述（用于游戏卡片）",
  "description": "中等长度描述（用于元数据）",
  "description_full": "详细描述（显示在游戏页面上）",
  "controls": "游戏控制说明",
  "thumbnail_url": "游戏缩略图URL",
  "game_url": "iframe游戏URL",
  "tags": ["标签1", "标签2", "..."],
  "featured": false,
  "popular": false,
  "new": true,
  "related_games": ["相关游戏1", "相关游戏2", "..."]
}
```

3. 添加游戏缩略图到 `src/assets/images/games/[分类]/` 目录
4. 生成网站：

```bash
npm run build
```

## 自定义游戏页面

如果您需要自定义特定游戏的页面，可以：

1. 在 `src/games/[分类]/` 目录下为特定游戏创建一个 HTML 文件，文件名与 JSON 文件的 `slug` 相同
2. 这个 HTML 文件将覆盖默认模板

## 管理游戏属性

在游戏的 JSON 数据中，有几个特殊的属性可以控制游戏在网站上的展示位置：

- `featured: true` - 游戏将显示在首页的"精选游戏"部分
- `popular: true` - 游戏将显示在首页和分类页的"热门游戏"部分
- `new: true` - 游戏将显示在首页的"新游戏"部分

## 预览和测试

在对网站进行任何更改后，您可以使用以下命令来预览：

```bash
npm run preview
```

这将构建网站并在本地服务器上启动，您可以通过 http://localhost:3000 访问。

## 部署网站

构建网站后，`dist` 目录将包含所有需要部署的文件。您可以将这些文件上传到任何静态网站托管服务，如 GitHub Pages、Netlify、Vercel 等。

1. 构建网站：

```bash
npm run build
```

2. 将 `dist` 目录中的内容上传到您的托管服务

## 搜索引擎优化 (SEO)

每个游戏页面都包含适当的元标签，以优化搜索引擎排名和社交媒体分享。确保为每个游戏提供：

- 准确的标题
- 详细的描述
- 相关的标签
- 高质量的缩略图

## 故障排除

如果您在使用过程中遇到问题，请尝试以下步骤：

1. 确保所有依赖都已正确安装：

```bash
npm install
```

2. 清理构建目录后重新构建：

```bash
npm run clean
npm run build
```

3. 检查JSON文件格式是否正确（没有多余的逗号，引号配对等）

### 端口占用问题

如果您遇到类似以下的错误：

```
Error: listen EADDRINUSE: address already in use 0.0.0.0:3000
```

这表示3000端口已被其他应用程序占用。您可以：

1. 关闭占用该端口的其他程序

   在Windows上，使用以下命令查找占用端口的程序：
   ```bash
   netstat -ano | findstr :3000
   ```
   然后使用任务管理器关闭对应的进程

2. 修改端口号

   如果您想使用其他端口，可以编辑package.json文件中的start脚本，将3000改为其他端口号，例如：
   ```json
   "start": "npx http-server ./dist -p 4000",
   ```

3. 直接使用其他端口启动服务器：

   ```bash
   npx http-server ./dist -p 4000
   ```

   然后访问 http://localhost:4000

### 无法访问网站问题

如果遇到"无法访问此网站"或"ERR_CONNECTION_REFUSED"错误，请尝试以下解决方法：

1. 确保HTTP服务器正在运行
   - 检查命令行窗口中是否显示"Available on"信息
   - 如果没有看到此信息，服务器可能没有成功启动

2. 尝试使用不同的HTTP服务器参数
   ```bash
   npx http-server ./dist -p 3000 --cors -c-1
   ```
   这会启用CORS并禁用缓存，有时候可以解决连接问题

3. 检查防火墙设置
   - Windows防火墙可能阻止了Node.js的网络访问
   - 尝试暂时禁用防火墙或添加例外规则

4. 尝试使用具体IP地址而不是localhost
   - 如果服务器显示可用于某个IP地址，尝试使用该IP而不是localhost
   - 例如，使用http://127.0.0.1:3000而不是http://localhost:3000

5. 确保dist目录中有文件
   - 使用`dir dist`命令检查dist目录是否包含生成的文件
   - 如果目录为空，可能是构建过程失败了

### 备用预览方法

如果使用http-server预览仍然有问题，我们提供了几种备用方法：

1. 使用Express服务器预览
   ```bash
   npm run preview-alt
   ```
   这将在端口5000上启动一个基于Express的服务器，您可以通过 http://localhost:5000 访问

2. 使用serve预览
   ```bash
   npm run serve
   ```
   这将使用serve包启动一个静态文件服务器，通常在端口3000上

3. 直接在浏览器中打开文件
   - 在文件浏览器中找到`dist/index.html`文件
   - 双击直接在浏览器中打开
   - 注意：某些功能可能无法正常工作，因为浏览器对本地文件有安全限制 