import React, { useState } from 'react';
import { Layout, Card, Row, Col, Typography, ConfigProvider } from 'antd';
import zhCN from 'antd/locale/zh_CN';
import StockAnalysisForm from './components/StockAnalysisForm';
import AnalysisResults from './components/AnalysisResults';
import './App.css';

const { Header, Content } = Layout;
const { Title } = Typography;

function App() {
  const [analysisResults, setAnalysisResults] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleAnalysisComplete = (results) => {
    setAnalysisResults(results);
    setLoading(false);
  };

  const handleAnalysisStart = () => {
    setLoading(true);
    setAnalysisResults(null);
  };

  return (
    <ConfigProvider locale={zhCN}>
      <Layout className="app-layout">
        <Header className="app-header">
          <Title level={2} style={{ color: 'white', margin: 0 }}>
            🤖 AI对冲基金 - 智能投资分析系统
          </Title>
        </Header>
        
        <Content className="app-content">
          <div className="content-container">
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={12}>
                <Card 
                  title="📊 股票分析配置" 
                  className="analysis-form-card"
                  bordered={false}
                >
                  <StockAnalysisForm 
                    onAnalysisStart={handleAnalysisStart}
                    onAnalysisComplete={handleAnalysisComplete}
                    loading={loading}
                  />
                </Card>
              </Col>
              
              <Col xs={24} lg={12}>
                <Card 
                  title="📈 分析结果" 
                  className="results-card"
                  bordered={false}
                >
                  <AnalysisResults 
                    results={analysisResults} 
                    loading={loading} 
                  />
                </Card>
              </Col>
            </Row>
          </div>
        </Content>
      </Layout>
    </ConfigProvider>
  );
}

export default App;