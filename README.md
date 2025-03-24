# G-station

G Station 是一个多游戏集成的游戏站平台，支持通过iframe嵌入各种HTML5游戏，并提供美观的UI和良好的用户体验。

## 功能特点

- 使用通用模板管理所有游戏
- iframe嵌入标准化，适应PC和移动端
- 静态页面生成，便于部署和管理
- SEO友好，支持社交媒体分享
- 响应式设计，在各种设备上都有良好体验
- 游戏分类系统，方便用户浏览和查找

## 技术栈

- HTML5/CSS3/JavaScript - 前端基础
- Handlebars - 模板引擎
- Node.js - 用于静态页面生成

## 快速开始

1. 安装依赖：

```bash
npm install
```

2. 构建网站：

```bash
npm run build
```

3. 预览网站：

```bash
npm run preview
```

网站将在 http://localhost:3000 上运行

## 添加新游戏

可以通过以下命令添加新游戏：

```bash
npm run new-game "游戏名称" 游戏分类 游戏URL
```

例如：

```bash
npm run new-game "太空射击" action https://example.com/games/space-shooter
```

游戏分类可以是以下之一：
- action（动作游戏）
- puzzle（益智游戏）
- strategy（策略游戏）
- sports（体育游戏）

## 项目结构

```
G-station/
├── dist/                  # 生成的静态网站
├── src/                   # 源代码
│   ├── assets/            # 静态资源(CSS, JS, 图片)
│   ├── components/        # 可复用的HTML组件
│   ├── games/             # 游戏数据(JSON格式)
│   │   ├── action/        # 动作游戏
│   │   ├── puzzle/        # 益智游戏
│   │   ├── strategy/      # 策略游戏
│   │   └── sports/        # 体育游戏
│   ├── scripts/           # 构建脚本
│   └── templates/         # HTML模板
└── package.json           # 项目配置
```

## 部署

构建网站后，将`dist`目录中的内容部署到您的Web服务器或静态网站托管服务。

## 定制模板

您可以通过编辑`src/templates`目录中的模板文件来定制网站的外观和布局。
