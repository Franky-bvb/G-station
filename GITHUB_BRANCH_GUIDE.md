# GitHub 分支操作指导

## 1. 创建 `gh-pages` 分支

1. **打开 GitHub Desktop**。
2. 在当前的 `main` 分支上，点击 **Branch** 菜单，选择 **New Branch**。
3. 输入 `gh-pages` 作为新分支的名称，点击 **Create Branch**。

## 2. 创建 `index.html` 文件

1. **切换到 `gh-pages` 分支**。
2. 在 G-station 根目录下，右键点击空白处，选择 **新建** → **文本文件**。
3. 将文件命名为 `index.html`（确保文件扩展名是 `.html`）。
4. 使用文本编辑器打开 `index.html`，添加以下内容：

   ```html
   <!DOCTYPE html>
   <html lang="en">
   <head>
       <meta charset="UTF-8">
       <meta name="viewport" content="width=device-width, initial-scale=1.0">
       <title>Welcome to G Station</title>
   </head>
   <body>
       <h1>G Station is live!</h1>
       <p>This is a placeholder for your game station.</p>
   </body>
   </html>
   ```

5. 保存并关闭文本编辑器。

## 3. 提交并推送更改

1. 在 GitHub Desktop 中，确认 `index.html` 文件出现在 **Changes** 标签下。
2. 在提交消息框中输入消息，例如"添加 index.html 文件"。
3. 点击 **Commit to gh-pages**。
4. 点击 **Push origin** 将更改推送到 GitHub。

## 4. 清空 `gh-pages` 分支中的现有文件

1. **切换到 `gh-pages` 分支**。
2. 删除所有现有文件（可以在文件资源管理器中全选后删除）。
3. 提交这些删除操作（提交信息："清空 gh-pages 分支"）。
4. 推送到 GitHub。

## 5. 上传 `dist` 文件夹内容

1. 运行 `npm run build` 生成最新的 `dist` 文件夹。
2. 切换到 `gh-pages` 分支（确保已经清空）。
3. 将 `dist` 文件夹中的所有内容（不包括 `dist` 文件夹本身）复制到项目根目录。
4. 提交这些新文件（提交信息："添加构建文件"）。
5. 推送到 GitHub。

## 6. 验证自动化流程是否正常工作

1. **查看 Actions 标签**：
   - 在 GitHub 仓库主页上点击 **Actions** 标签。
   - 查看名为 "部署游戏站" 的工作流运行记录。

2. **查看工作流详情**：
   - 点击最近的一次运行记录，展开各个步骤，查看执行过程和日志。

3. **检查 `gh-pages` 分支内容**：
   - 切换到 `gh-pages` 分支，确认它包含构建后的文件（如 `index.html`、JavaScript 文件等）。

4. **访问网站**：
   - 访问 `https://你的用户名.github.io/G-station/` 查看网站是否正常。

5. **触发测试**：
   - 在 `main` 分支中做一个小的修改（如修改 `README.md`）。
   - 提交并推送，观察 Actions 是否自动运行。

## 7. 常见问题

- **网站无法正常显示**：确保 `gh-pages` 分支中有 `index.html` 文件。
- **自动化流程未运行**：检查 GitHub Actions 设置，确保工作流文件存在且配置正确。
