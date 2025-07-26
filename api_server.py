from flask import Flask, request, jsonify
from flask_cors import CORS
import sys
import os
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from src.main import run_hedge_fund
from src.utils.analysts import ANALYST_CONFIG
from src.llm.models import AVAILABLE_MODELS
from datetime import datetime, timedelta
import json

app = Flask(__name__)
CORS(app)  # 允许跨域请求

@app.route('/api/analyze', methods=['POST'])
def analyze_stocks():
    """股票分析API"""
    try:
        data = request.get_json()
        
        # 验证必需参数
        if not data.get('tickers'):
            return jsonify({'error': '缺少股票代码'}), 400
        if not data.get('model_name'):
            return jsonify({'error': '缺少模型名称'}), 400
        if not data.get('selected_analysts'):
            return jsonify({'error': '缺少分析师选择'}), 400
        
        # 设置默认日期（如果未提供）
        end_date = data.get('end_date') or datetime.now().strftime('%Y-%m-%d')
        start_date = data.get('start_date') or (datetime.now() - timedelta(days=90)).strftime('%Y-%m-%d')
        
        # 初始化投资组合
        tickers = data['tickers']
        portfolio = {
            "cash": 100000.0,
            "margin_requirement": 0.0,
            "positions": {
                ticker: {
                    "long": 0,
                    "short": 0,
                    "long_cost_basis": 0.0,
                    "short_cost_basis": 0.0,
                } for ticker in tickers
            },
            "realized_gains": {
                ticker: {
                    "long": 0.0,
                    "short": 0.0,
                } for ticker in tickers
            }
        }
        
        # 获取模型提供商信息
        model_info = None
        for model in AVAILABLE_MODELS:
            if model.model_name == data['model_name']:
                model_info = model
                break
        
        model_provider = model_info.provider.value if model_info else "OpenAI"
        
        # 调用分析引擎
        result = run_hedge_fund(
            tickers=tickers,
            start_date=start_date,
            end_date=end_date,
            portfolio=portfolio,
            show_reasoning=data.get('show_reasoning', False),
            selected_analysts=data['selected_analysts'],
            model_name=data['model_name'],
            model_provider=model_provider,
        )
        
        return jsonify(result)
        
    except Exception as e:
        print(f"分析错误: {str(e)}")
        return jsonify({'error': f'分析失败: {str(e)}'}), 500

@app.route('/api/models', methods=['GET'])
def get_available_models():
    """获取可用的AI模型列表"""
    try:
        models = []
        for model in AVAILABLE_MODELS:
            models.append({
                'label': model.display_name,
                'value': model.model_name,
                'provider': model.provider.value
            })
        return jsonify(models)
    except Exception as e:
        return jsonify({'error': f'获取模型列表失败: {str(e)}'}), 500

@app.route('/api/analysts', methods=['GET'])
def get_available_analysts():
    """获取可用的分析师列表"""
    try:
        analysts = []
        for key, config in ANALYST_CONFIG.items():
            analysts.append({
                'key': key,
                'name': config['display_name'],
                'order': config['order']
            })
        return jsonify(sorted(analysts, key=lambda x: x['order']))
    except Exception as e:
        return jsonify({'error': f'获取分析师列表失败: {str(e)}'}), 500

@app.route('/api/stock/<ticker>/history', methods=['GET'])
def get_stock_history(ticker):
    """获取股票历史数据"""
    try:
        start_date = request.args.get('start_date')
        end_date = request.args.get('end_date')
        
        # 这里可以集成真实的股票数据API
        # 暂时返回模拟数据
        return jsonify({
            'ticker': ticker,
            'data': [
                {'date': '2024-01-01', 'price': 150.0, 'volume': 1000000},
                {'date': '2024-01-02', 'price': 152.5, 'volume': 1100000},
                {'date': '2024-01-03', 'price': 151.0, 'volume': 950000},
            ]
        })
    except Exception as e:
        return jsonify({'error': f'获取历史数据失败: {str(e)}'}), 500

@app.route('/api/health', methods=['GET'])
def health_check():
    """健康检查端点"""
    return jsonify({'status': 'healthy', 'timestamp': datetime.now().isoformat()})

if __name__ == '__main__':
    print("启动AI对冲基金API服务器...")
    print("React前端: http://localhost:3000")
    print("Vue前端: http://localhost:8080")
    print("API服务器: http://localhost:8000")
    
    app.run(
        host='0.0.0.0',
        port=8000,
        debug=True
    )