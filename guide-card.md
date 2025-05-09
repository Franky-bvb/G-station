方法1：调整网格列宽
修改.games-grid中的grid-template-columns属性：
通过修改minmax()中的第一个值，您可以控制卡片的最小宽度。
.games-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 20px;
}

方法2：设置固定列数
如果您希望每行固定显示特定数量的卡片：
.games-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); /* 改小卡片宽度 */
    /* 或者 */
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); /* 改大卡片宽度 */
    gap: 20px;
}

方法3：调整卡片内部空间
修改内部空间和边距：
.games-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr); /* 每行显示4个卡片 */
    /* 或者 */
    grid-template-columns: repeat(5, 1fr); /* 每行显示5个卡片 */
    gap: 20px;
}

方法4：限制卡片的最大宽度
设置卡片的最大宽度：
.game-card {
    /* 现有样式 */
    padding: 10px; /* 添加内边距 */
    margin: 5px; /* 添加外边距 */
}

.game-card-content {
    padding: 10px; /* 减小内容区域的内边距 */
}

方法5：响应式调整
针对不同屏幕尺寸定义不同的卡片大小：
.game-card {
    /* 现有样式 */
    max-width: 280px; /* 设置最大宽度 */
    margin: 0 auto; /* 水平居中 */
}

修改横幅背景
.hero {
    /* 修改为纯色背景 */
    background: #5a1818; /* 修改为其他颜色代码 */
    
    /* 或使用渐变背景 */
    background: linear-gradient(to right, #5a1818, #8c2626);
    
    /* 或添加背景图片 */
    background: linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), 
                url('/assets/images/hero-bg.jpg');
    background-size: cover;
    background-position: center;
}