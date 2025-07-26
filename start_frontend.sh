#!/bin/bash

# AI对冲基金前端启动脚本

echo "🚀 启动AI对冲基金系统..."

# 检查Python依赖
echo "📦 检查Python依赖..."
if ! python -c "import flask, flask_cors" 2>/dev/null; then
    echo "安装Python依赖..."
    pip install flask flask-cors
fi

# 启动API服务器
echo "🔧 启动API服务器 (端口: 8000)..."
python api_server.py &
API_PID=$!

# 等待API服务器启动
sleep 3

# 启动React前端
echo "⚛️  启动React前端 (端口: 3000)..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "安装React依赖..."
    npm install
fi
npm start &
REACT_PID=$!

# 启动Vue前端
echo "🖖 启动Vue前端 (端口: 8080)..."
cd ../frontend-vue
if [ ! -d "node_modules" ]; then
    echo "安装Vue依赖..."
    npm install
fi
npm run serve &
VUE_PID=$!

echo ""
echo "✅ 系统启动完成!"
echo ""
echo "📱 访问地址:"
echo "   React版本: http://localhost:3000"
echo "   Vue版本:   http://localhost:8080" 
echo "   API接口:   http://localhost:8000"
echo ""
echo "按 Ctrl+C 停止所有服务"

# 等待用户中断
trap "echo '🔄 正在停止服务...'; kill $API_PID $REACT_PID $VUE_PID 2>/dev/null; exit" INT
wait