import React, { useState } from 'react';
import { 
  Form, 
  Input, 
  Select, 
  Button, 
  Tag, 
  Typography, 
  Space, 
  Checkbox, 
  Divider,
  message 
} from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';
import { analyzeStock } from '../services/api';

const { Title, Text } = Typography;
const { Option } = Select;

// 基于Python代码中的模型配置
const MODELS = [
  { label: '[anthropic] claude-3.5-haiku', value: 'claude-3-5-haiku-latest', provider: 'Anthropic' },
  { label: '[anthropic] claude-3.5-sonnet', value: 'claude-3-5-sonnet-latest', provider: 'Anthropic' },
  { label: '[anthropic] claude-3.7-sonnet', value: 'claude-3-7-sonnet-latest', provider: 'Anthropic' },
  { label: '[deepseek] deepseek-r1', value: 'deepseek-reasoner', provider: 'DeepSeek' },
  { label: '[deepseek] deepseek-v3', value: 'deepseek-chat', provider: 'DeepSeek' },
  { label: '[gemini] gemini-2.0-flash', value: 'gemini-2.0-flash', provider: 'Gemini' },
  { label: '[gemini] gemini-2.5-pro', value: 'gemini-2.5-pro-exp-03-25', provider: 'Gemini' },
  { label: '[groq] llama-3.3 70b', value: 'llama-3.3-70b-versatile', provider: 'Groq' },
  { label: '[openai] gpt-4.5', value: 'gpt-4.5-preview', provider: 'OpenAI' },
  { label: '[openai] gpt-4o', value: 'gpt-4o', provider: 'OpenAI' },
  { label: '[openai] o1', value: 'o1', provider: 'OpenAI' },
  { label: '[openai] o3-mini', value: 'o3-mini', provider: 'OpenAI' },
];

// 基于Python代码中的分析师配置
const ANALYSTS = [
  { key: 'ben_graham', name: 'Ben Graham', description: '价值投资之父，寻找被低估的优质股票' },
  { key: 'bill_ackman', name: 'Bill Ackman', description: '激进投资者，采取大胆立场推动变革' },
  { key: 'cathie_wood', name: 'Cathie Wood', description: '成长投资女王，专注创新和颠覆性技术' },
  { key: 'charlie_munger', name: 'Charlie Munger', description: '巴菲特合伙人，以合理价格买入优秀企业' },
  { key: 'phil_fisher', name: 'Phil Fisher', description: '传奇成长投资者，精通深度调研分析' },
  { key: 'stanley_druckenmiller', name: 'Stanley Druckenmiller', description: '宏观传奇，寻找不对称增长机会' },
  { key: 'warren_buffett', name: 'Warren Buffett', description: '奥马哈先知，寻求优秀公司的合理价格' },
  { key: 'technical_analyst', name: 'Technical Analyst', description: '技术分析专家，基于图表和指标分析' },
  { key: 'fundamentals_analyst', name: 'Fundamentals Analyst', description: '基本面分析师，深入研究公司财务数据' },
  { key: 'sentiment_analyst', name: 'Sentiment Analyst', description: '情绪分析师，分析市场情绪和舆论' },
  { key: 'valuation_analyst', name: 'Valuation Analyst', description: '估值分析师，计算股票内在价值' },
];

const StockAnalysisForm = ({ onAnalysisStart, onAnalysisComplete, loading }) => {
  const [form] = Form.useForm();
  const [stocks, setStocks] = useState([]);
  const [stockInput, setStockInput] = useState('');
  const [selectedAnalysts, setSelectedAnalysts] = useState(['warren_buffett', 'technical_analyst', 'fundamentals_analyst']);

  const addStock = () => {
    if (stockInput && !stocks.includes(stockInput.toUpperCase())) {
      setStocks([...stocks, stockInput.toUpperCase()]);
      setStockInput('');
    }
  };

  const removeStock = (stockToRemove) => {
    setStocks(stocks.filter(stock => stock !== stockToRemove));
  };

  const handleAnalystChange = (checkedValues) => {
    setSelectedAnalysts(checkedValues);
  };

  const handleSubmit = async (values) => {
    if (stocks.length === 0) {
      message.error('请至少添加一只股票');
      return;
    }

    if (selectedAnalysts.length === 0) {
      message.error('请至少选择一位投资分析师');
      return;
    }

    onAnalysisStart();

    try {
      const analysisData = {
        tickers: stocks,
        model_name: values.model,
        selected_analysts: selectedAnalysts,
        start_date: values.start_date,
        end_date: values.end_date,
        show_reasoning: values.show_reasoning || false,
      };

      const results = await analyzeStock(analysisData);
      onAnalysisComplete(results);
      message.success('分析完成！');
    } catch (error) {
      message.error('分析失败: ' + error.message);
      onAnalysisComplete(null);
    }
  };

  return (
    <Form
      form={form}
      layout="vertical"
      onFinish={handleSubmit}
      initialValues={{
        model: 'gpt-4o',
        show_reasoning: false,
      }}
    >
      {/* 股票输入部分 */}
      <div className="stock-input-section">
        <Title level={4} className="section-title">🎯 选择股票</Title>
        <Space.Compact style={{ width: '100%' }}>
          <Input
            placeholder="输入股票代码 (如: AAPL, TSLA)"
            value={stockInput}
            onChange={(e) => setStockInput(e.target.value.toUpperCase())}
            onPressEnter={addStock}
          />
          <Button type="primary" icon={<PlusOutlined />} onClick={addStock}>
            添加
          </Button>
        </Space.Compact>
        
        <div className="stock-tags">
          {stocks.map(stock => (
            <Tag
              key={stock}
              closable
              onClose={() => removeStock(stock)}
              className="stock-tag"
            >
              {stock}
            </Tag>
          ))}
        </div>
        {stocks.length === 0 && (
          <Text type="secondary">请添加要分析的股票代码</Text>
        )}
      </div>

      <Divider />

      {/* 模型选择部分 */}
      <div className="model-selection-section">
        <Title level={4} className="section-title">🤖 选择AI模型</Title>
        <Form.Item
          name="model"
          rules={[{ required: true, message: '请选择AI模型' }]}
        >
          <Select placeholder="选择AI模型">
            {MODELS.map(model => (
              <Option key={model.value} value={model.value}>
                {model.label}
              </Option>
            ))}
          </Select>
        </Form.Item>
      </div>

      <Divider />

      {/* 分析师选择部分 */}
      <div className="analyst-selection-section">
        <Title level={4} className="section-title">👥 选择投资分析师</Title>
        <Checkbox.Group
          value={selectedAnalysts}
          onChange={handleAnalystChange}
          style={{ width: '100%' }}
        >
          <Space direction="vertical" style={{ width: '100%' }}>
            {ANALYSTS.map(analyst => (
              <Checkbox key={analyst.key} value={analyst.key}>
                <div>
                  <Text strong>{analyst.name}</Text>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {analyst.description}
                  </Text>
                </div>
              </Checkbox>
            ))}
          </Space>
        </Checkbox.Group>
      </div>

      <Divider />

      {/* 高级选项 */}
      <Form.Item name="show_reasoning" valuePropName="checked">
        <Checkbox>显示分析师推理过程</Checkbox>
      </Form.Item>

      {/* 提交按钮 */}
      <Form.Item>
        <Button
          type="primary"
          htmlType="submit"
          loading={loading}
          className="analysis-button"
          size="large"
        >
          {loading ? '分析中...' : '开始智能分析'}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default StockAnalysisForm;