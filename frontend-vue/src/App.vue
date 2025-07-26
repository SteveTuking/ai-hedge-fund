<template>
  <a-config-provider :locale="zhCN">
    <a-layout class="app-layout">
      <a-layout-header class="app-header">
        <h2 class="header-title">🤖 AI对冲基金 - 智能投资分析系统</h2>
      </a-layout-header>
      
      <a-layout-content class="app-content">
        <div class="content-container">
          <a-row :gutter="[24, 24]">
            <a-col :xs="24" :lg="12">
              <a-card 
                title="📊 股票分析配置" 
                class="analysis-form-card"
                :bordered="false"
              >
                <StockAnalysisForm 
                  @analysis-start="handleAnalysisStart"
                  @analysis-complete="handleAnalysisComplete"
                  :loading="loading"
                />
              </a-card>
            </a-col>
            
            <a-col :xs="24" :lg="12">
              <a-card 
                title="📈 分析结果" 
                class="results-card"
                :bordered="false"
              >
                <AnalysisResults 
                  :results="analysisResults" 
                  :loading="loading" 
                />
              </a-card>
            </a-col>
          </a-row>
        </div>
      </a-layout-content>
    </a-layout>
  </a-config-provider>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { ConfigProvider } from 'ant-design-vue';
import zhCN from 'ant-design-vue/es/locale/zh_CN';
import StockAnalysisForm from './components/StockAnalysisForm.vue';
import AnalysisResults from './components/AnalysisResults.vue';

export default defineComponent({
  name: 'App',
  components: {
    StockAnalysisForm,
    AnalysisResults,
    [ConfigProvider.name]: ConfigProvider,
  },
  setup() {
    const analysisResults = ref(null);
    const loading = ref(false);

    const handleAnalysisComplete = (results) => {
      analysisResults.value = results;
      loading.value = false;
    };

    const handleAnalysisStart = () => {
      loading.value = true;
      analysisResults.value = null;
    };

    return {
      zhCN,
      analysisResults,
      loading,
      handleAnalysisComplete,
      handleAnalysisStart,
    };
  },
});
</script>

<style>
body {
  margin: 0;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen',
    'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue',
    sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  min-height: 100vh;
}

.app-layout {
  min-height: 100vh;
  background: transparent;
}

.app-header {
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  padding: 0 24px;
  display: flex;
  align-items: center;
}

.header-title {
  color: white;
  margin: 0;
  font-size: 20px;
  font-weight: 600;
}

.app-content {
  padding: 24px;
}

.content-container {
  max-width: 1400px;
  margin: 0 auto;
}

.analysis-form-card,
.results-card {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
}

.analysis-form-card .ant-card-head,
.results-card .ant-card-head {
  border-bottom: 1px solid rgba(0, 0, 0, 0.06);
  background: rgba(255, 255, 255, 0.8);
  border-radius: 12px 12px 0 0;
}

.section-title {
  margin-bottom: 16px !important;
  color: #1f2937;
  font-weight: 600;
}

.stock-tags {
  margin-top: 12px;
}

.stock-tag {
  margin: 4px 8px 4px 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  color: white;
  font-weight: 500;
}

.analysis-button {
  width: 100%;
  height: 48px;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: 600;
  box-shadow: 0 4px 16px rgba(102, 126, 234, 0.4);
  transition: all 0.3s ease;
}

.analysis-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 24px rgba(102, 126, 234, 0.5);
}

.results-empty {
  text-align: center;
  padding: 48px 24px;
  color: #6b7280;
}

.results-loading {
  text-align: center;
  padding: 48px 24px;
}

.decision-card {
  margin-bottom: 16px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.decision-buy {
  border-left: 4px solid #10b981;
}

.decision-sell {
  border-left: 4px solid #ef4444;
}

.decision-hold {
  border-left: 4px solid #f59e0b;
}

.chart-container {
  margin-top: 24px;
  padding: 16px;
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
}
</style>