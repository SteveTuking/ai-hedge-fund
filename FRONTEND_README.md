# AI对冲基金前端使用指南

## 🎯 项目概述

我已经为您的AI对冲基金系统创建了完整的前端界面，包括React和Vue两个版本，让您可以通过网页便捷地进行股票分析。

## 📁 项目结构

```
ai-hedge-fund/
├── frontend/                 # React版本前端
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── StockAnalysisForm.js    # 股票分析表单
│   │   │   └── AnalysisResults.js      # 结果展示组件
│   │   ├── services/
│   │   │   └── api.js                  # API服务
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
├── frontend-vue/             # Vue版本前端
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── StockAnalysisForm.vue   # 股票分析表单
│   │   │   └── AnalysisResults.vue     # 结果展示组件
│   │   ├── services/
│   │   │   └── api.js                  # API服务
│   │   ├── App.vue
│   │   └── main.js
│   └── package.json
├── api_server.py             # Flask API服务器
└── start_frontend.sh         # 一键启动脚本
```

## 🚀 快速启动

### 方法一：一键启动（推荐）
```bash
cd ai-hedge-fund
./start_frontend.sh
```

### 方法二：手动启动

1. **启动API服务器**
```bash
cd ai-hedge-fund
pip install flask flask-cors
python api_server.py
```

2. **启动React前端**
```bash
cd frontend
npm install
npm start
```

3. **启动Vue前端**
```bash
cd frontend-vue
npm install
npm run serve
```

## 🌐 访问地址

- **React版本**: http://localhost:3000
- **Vue版本**: http://localhost:8080
- **API接口**: http://localhost:8000

## ✨ 功能特性

### 1. 股票选择
- 📊 输入股票代码（如AAPL, TSLA, MSFT）
- 🏷️ 标签式管理已添加的股票
- ❌ 支持删除不需要的股票

### 2. AI模型选择
支持的AI模型包括：
- 🤖 **Anthropic**: Claude 3.5 Haiku, Claude 3.5 Sonnet, Claude 3.7 Sonnet
- 🧠 **DeepSeek**: DeepSeek R1, DeepSeek V3
- 💎 **Gemini**: Gemini 2.0 Flash, Gemini 2.5 Pro
- ⚡ **Groq**: Llama 3.3 70B
- 🔥 **OpenAI**: GPT-4.5, GPT-4o, O1, O3-mini

### 3. 投资分析师选择
11位知名投资分析师：
- 💰 **Ben Graham** - 价值投资之父
- 🎯 **Bill Ackman** - 激进投资者
- 🚀 **Cathie Wood** - 成长投资女王
- 🎓 **Charlie Munger** - 巴菲特合伙人
- 🔍 **Phil Fisher** - 深度调研专家
- 📈 **Stanley Druckenmiller** - 宏观传奇
- 🏆 **Warren Buffett** - 奥马哈先知
- 📊 **Technical Analyst** - 技术分析专家
- 📋 **Fundamentals Analyst** - 基本面分析师
- 💭 **Sentiment Analyst** - 情绪分析师
- 💵 **Valuation Analyst** - 估值分析师

### 4. 分析结果展示
- 📊 **交易决策**：买入/卖出/持有建议
- 👥 **分析师信号**：各分析师的详细观点
- 📈 **性能图表**：投资组合表现对比
- ⚠️ **风险提示**：投资风险警告

## 🛠️ 技术栈

### React版本
- ⚛️ React 18
- 🐜 Ant Design
- 📊 Recharts
- 🌐 Axios

### Vue版本
- 🖖 Vue 3
- 🐜 Ant Design Vue
- 📊 ECharts + Vue-ECharts
- 🌐 Axios

### 后端API
- 🐍 Flask
- 🌐 Flask-CORS
- 🔗 与现有Python代码集成

## 🔧 自定义配置

### 环境变量配置
在根目录的`.env`文件中配置API密钥：
```bash
OPENAI_API_KEY=your-openai-api-key
GROQ_API_KEY=your-groq-api-key
ANTHROPIC_API_KEY=your-anthropic-api-key
DEEPSEEK_API_KEY=your-deepseek-api-key
GOOGLE_API_KEY=your-google-api-key
FINANCIAL_DATASETS_API_KEY=your-financial-datasets-api-key
```

### API基础URL配置
- React: 在`frontend/src/services/api.js`中修改`REACT_APP_API_BASE_URL`
- Vue: 在`frontend-vue/src/services/api.js`中修改`VUE_APP_API_BASE_URL`

## 📱 界面预览

### 主要功能
1. **股票输入区域** - 添加和管理要分析的股票
2. **模型选择器** - 选择AI分析引擎
3. **分析师面板** - 选择投资分析师团队
4. **结果展示区** - 查看分析结果和投资建议
5. **图表可视化** - 投资组合性能对比

### 设计特色
- 🌈 渐变色背景设计
- 🔍 玻璃拟态效果
- 📱 响应式布局
- ⚡ 实时加载状态
- 🎨 直观的颜色编码（绿色=买入，红色=卖出，黄色=持有）

## ⚠️ 重要提示

1. **教育目的**：本系统仅供教育和研究使用，不构成实际投资建议
2. **API密钥安全**：请妥善保管各种API密钥，不要提交到公共代码库
3. **网络要求**：需要稳定的网络连接以访问各种AI模型API
4. **风险警示**：投资有风险，决策需谨慎

## 🤝 使用建议

1. **首次使用**：建议先用少量股票（1-3只）进行测试
2. **分析师组合**：可以选择不同风格的分析师获得多元化观点
3. **模型对比**：尝试不同AI模型看看分析结果的差异
4. **历史回测**：配合原有的回测功能验证策略有效性

## 🐛 问题排查

### 常见问题
1. **端口占用**：如果端口被占用，请修改`api_server.py`中的端口配置
2. **依赖安装失败**：请确保Node.js和Python环境正确安装
3. **API调用失败**：检查网络连接和API密钥配置
4. **页面空白**：检查浏览器控制台错误信息

### 获取帮助
如果遇到问题，可以：
1. 查看浏览器开发者工具的控制台错误
2. 检查API服务器的日志输出
3. 确认所有依赖都已正确安装

现在您可以通过运行`./start_frontend.sh`来启动完整的前端系统，享受便捷的AI股票分析体验！