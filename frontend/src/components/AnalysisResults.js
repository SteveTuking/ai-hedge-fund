import React from 'react';
import { 
  Card, 
  Typography, 
  Tag, 
  Space, 
  Spin, 
  Alert, 
  Collapse, 
  Progress,
  Row,
  Col,
  Statistic,
  Divider
} from 'antd';
import { 
  ArrowUpOutlined, 
  ArrowDownOutlined, 
  MinusOutlined,
  DollarOutlined
} from '@ant-design/icons';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const { Title, Text, Paragraph } = Typography;
const { Panel } = Collapse;

const AnalysisResults = ({ results, loading }) => {
  if (loading) {
    return (
      <div className="results-loading">
        <Spin size="large" />
        <div style={{ marginTop: 16 }}>
          <Text>AI分析师正在分析中...</Text>
        </div>
      </div>
    );
  }

  if (!results) {
    return (
      <div className="results-empty">
        <Text type="secondary">
          请在左侧配置股票分析参数，然后点击"开始智能分析"查看结果
        </Text>
      </div>
    );
  }

  const getDecisionColor = (decision) => {
    if (!decision) return 'default';
    const action = decision.toLowerCase();
    if (action.includes('buy') || action.includes('买入')) return 'success';
    if (action.includes('sell') || action.includes('卖出')) return 'error';
    return 'warning';
  };

  const getDecisionIcon = (decision) => {
    if (!decision) return <MinusOutlined />;
    const action = decision.toLowerCase();
    if (action.includes('buy') || action.includes('买入')) return <ArrowUpOutlined />;
    if (action.includes('sell') || action.includes('卖出')) return <ArrowDownOutlined />;
    return <MinusOutlined />;
  };

  const getSignalColor = (signal) => {
    if (!signal) return 'default';
    const sentiment = signal.toLowerCase();
    if (sentiment.includes('bullish') || sentiment.includes('看涨') || sentiment.includes('买入')) return 'success';
    if (sentiment.includes('bearish') || sentiment.includes('看跌') || sentiment.includes('卖出')) return 'error';
    return 'warning';
  };

  const renderDecisionCard = (ticker, decision) => {
    const cardClass = `decision-card decision-${getDecisionColor(decision.action)}`;
    
    return (
      <Card key={ticker} className={cardClass} size="small">
        <Row gutter={[16, 16]} align="middle">
          <Col span={8}>
            <Statistic
              title="股票代码"
              value={ticker}
              prefix={getDecisionIcon(decision.action)}
              valueStyle={{ fontSize: '18px', fontWeight: 'bold' }}
            />
          </Col>
          <Col span={8}>
            <Statistic
              title="决策"
              value={decision.action || '无决策'}
              valueStyle={{ 
                color: getDecisionColor(decision.action) === 'success' ? '#52c41a' : 
                       getDecisionColor(decision.action) === 'error' ? '#ff4d4f' : '#faad14'
              }}
            />
          </Col>
          <Col span={8}>
            {decision.quantity && (
              <Statistic
                title="数量"
                value={decision.quantity}
                suffix="股"
                prefix={<DollarOutlined />}
              />
            )}
          </Col>
        </Row>
        
        {decision.reasoning && (
          <div style={{ marginTop: 12 }}>
            <Text type="secondary">推理过程:</Text>
            <Paragraph ellipsis={{ rows: 2, expandable: true }}>
              {decision.reasoning}
            </Paragraph>
          </div>
        )}
        
        {decision.confidence && (
          <div style={{ marginTop: 8 }}>
            <Text type="secondary">置信度: </Text>
            <Progress 
              percent={decision.confidence} 
              size="small" 
              strokeColor={
                decision.confidence >= 80 ? '#52c41a' : 
                decision.confidence >= 60 ? '#faad14' : '#ff4d4f'
              }
            />
          </div>
        )}
      </Card>
    );
  };

  const renderAnalystSignals = (analystSignals) => {
    if (!analystSignals || Object.keys(analystSignals).length === 0) {
      return <Text type="secondary">暂无分析师信号数据</Text>;
    }

    return (
      <Collapse ghost>
        {Object.entries(analystSignals).map(([analyst, data]) => (
          <Panel 
            header={
              <Space>
                <Text strong>{analyst.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}</Text>
                {data.signal && (
                  <Tag color={getSignalColor(data.signal)}>
                    {data.signal}
                  </Tag>
                )}
              </Space>
            } 
            key={analyst}
          >
            {data.reasoning && (
              <div>
                <Text type="secondary">分析推理:</Text>
                <Paragraph>{data.reasoning}</Paragraph>
              </div>
            )}
            
            {data.confidence && (
              <div style={{ marginTop: 12 }}>
                <Text type="secondary">信心指数: </Text>
                <Progress 
                  percent={data.confidence} 
                  size="small"
                  strokeColor={
                    data.confidence >= 80 ? '#52c41a' : 
                    data.confidence >= 60 ? '#faad14' : '#ff4d4f'
                  }
                />
              </div>
            )}

            {data.price_target && (
              <div style={{ marginTop: 12 }}>
                <Row gutter={16}>
                  <Col span={12}>
                    <Statistic
                      title="目标价格"
                      value={data.price_target}
                      prefix="$"
                      precision={2}
                    />
                  </Col>
                  {data.current_price && (
                    <Col span={12}>
                      <Statistic
                        title="当前价格"
                        value={data.current_price}
                        prefix="$"
                        precision={2}
                      />
                    </Col>
                  )}
                </Row>
              </div>
            )}
          </Panel>
        ))}
      </Collapse>
    );
  };

  const renderPerformanceChart = () => {
    // 模拟性能数据用于图表展示
    const performanceData = [
      { name: '1月', value: 100, benchmark: 100 },
      { name: '2月', value: 105, benchmark: 102 },
      { name: '3月', value: 98, benchmark: 101 },
      { name: '4月', value: 112, benchmark: 104 },
      { name: '5月', value: 108, benchmark: 106 },
      { name: '6月', value: 115, benchmark: 108 },
    ];

    return (
      <div className="chart-container">
        <Title level={5}>投资组合表现对比</Title>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={performanceData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#8884d8" 
              strokeWidth={2}
              name="AI策略"
            />
            <Line 
              type="monotone" 
              dataKey="benchmark" 
              stroke="#82ca9d" 
              strokeWidth={2}
              name="基准指数"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div>
      {/* 交易决策概览 */}
      <div style={{ marginBottom: 24 }}>
        <Title level={4}>📊 交易决策</Title>
        {results.decisions && Object.keys(results.decisions).length > 0 ? (
          <Space direction="vertical" style={{ width: '100%' }}>
            {Object.entries(results.decisions).map(([ticker, decision]) =>
              renderDecisionCard(ticker, decision)
            )}
          </Space>
        ) : (
          <Alert
            message="暂无交易决策"
            description="AI分析师尚未生成具体的交易建议"
            type="info"
            showIcon
          />
        )}
      </div>

      <Divider />

      {/* 分析师信号 */}
      <div className="analyst-signals">
        <Title level={4}>👥 分析师信号</Title>
        {renderAnalystSignals(results.analyst_signals)}
      </div>

      <Divider />

      {/* 性能图表 */}
      {renderPerformanceChart()}

      {/* 风险提示 */}
      <Alert
        message="投资风险提示"
        description="本系统仅供教育和研究目的使用，不构成投资建议。投资有风险，决策需谨慎。"
        type="warning"
        showIcon
        style={{ marginTop: 24 }}
      />
    </div>
  );
};

export default AnalysisResults;