<template>
  <div>
    <!-- 加载状态 -->
    <div v-if="loading" class="results-loading">
      <a-spin size="large" />
      <div style="margin-top: 16px; color: #666;">
        AI分析师正在分析中...
      </div>
    </div>

    <!-- 空状态 -->
    <div v-else-if="!results" class="results-empty">
      <div style="color: #8c8c8c;">
        请在左侧配置股票分析参数，然后点击"开始智能分析"查看结果
      </div>
    </div>

    <!-- 分析结果 -->
    <div v-else>
      <!-- 交易决策概览 -->
      <div style="margin-bottom: 24px;">
        <h4>📊 交易决策</h4>
        <div v-if="results.decisions && Object.keys(results.decisions).length > 0">
          <a-card
            v-for="(decision, ticker) in results.decisions"
            :key="ticker"
            :class="getDecisionCardClass(decision.action)"
            size="small"
            style="margin-bottom: 16px;"
          >
            <a-row :gutter="[16, 16]" align="middle">
              <a-col :span="8">
                <a-statistic
                  title="股票代码"
                  :value="ticker"
                  :value-style="{ fontSize: '18px', fontWeight: 'bold' }"
                >
                  <template #prefix>
                    <component :is="getDecisionIcon(decision.action)" />
                  </template>
                </a-statistic>
              </a-col>
              <a-col :span="8">
                <a-statistic
                  title="决策"
                  :value="decision.action || '无决策'"
                  :value-style="{ color: getDecisionColor(decision.action) }"
                />
              </a-col>
              <a-col :span="8">
                <a-statistic
                  v-if="decision.quantity"
                  title="数量"
                  :value="decision.quantity"
                  suffix="股"
                >
                  <template #prefix>
                    <DollarOutlined />
                  </template>
                </a-statistic>
              </a-col>
            </a-row>
            
            <div v-if="decision.reasoning" style="margin-top: 12px;">
              <div style="color: #8c8c8c; margin-bottom: 4px;">推理过程:</div>
              <div style="color: #333;">{{ decision.reasoning }}</div>
            </div>
            
            <div v-if="decision.confidence" style="margin-top: 8px;">
              <span style="color: #8c8c8c;">置信度: </span>
              <a-progress 
                :percent="decision.confidence" 
                size="small" 
                :stroke-color="getConfidenceColor(decision.confidence)"
              />
            </div>
          </a-card>
        </div>
        <a-alert
          v-else
          message="暂无交易决策"
          description="AI分析师尚未生成具体的交易建议"
          type="info"
          show-icon
        />
      </div>

      <a-divider />

      <!-- 分析师信号 -->
      <div class="analyst-signals">
        <h4>👥 分析师信号</h4>
        <div v-if="results.analyst_signals && Object.keys(results.analyst_signals).length > 0">
          <a-collapse ghost>
            <a-collapse-panel
              v-for="(data, analyst) in results.analyst_signals"
              :key="analyst"
            >
              <template #header>
                <a-space>
                  <span style="font-weight: 600;">{{ formatAnalystName(analyst) }}</span>
                  <a-tag v-if="data.signal" :color="getSignalColor(data.signal)">
                    {{ data.signal }}
                  </a-tag>
                </a-space>
              </template>
              
              <div v-if="data.reasoning">
                <div style="color: #8c8c8c; margin-bottom: 4px;">分析推理:</div>
                <div style="color: #333; margin-bottom: 12px;">{{ data.reasoning }}</div>
              </div>
              
              <div v-if="data.confidence" style="margin-top: 12px;">
                <span style="color: #8c8c8c;">信心指数: </span>
                <a-progress 
                  :percent="data.confidence" 
                  size="small"
                  :stroke-color="getConfidenceColor(data.confidence)"
                />
              </div>

              <div v-if="data.price_target || data.current_price" style="margin-top: 12px;">
                <a-row :gutter="16">
                  <a-col :span="12" v-if="data.price_target">
                    <a-statistic
                      title="目标价格"
                      :value="data.price_target"
                      prefix="$"
                      :precision="2"
                    />
                  </a-col>
                  <a-col :span="12" v-if="data.current_price">
                    <a-statistic
                      title="当前价格"
                      :value="data.current_price"
                      prefix="$"
                      :precision="2"
                    />
                  </a-col>
                </a-row>
              </div>
            </a-collapse-panel>
          </a-collapse>
        </div>
        <div v-else style="color: #8c8c8c;">
          暂无分析师信号数据
        </div>
      </div>

      <a-divider />

      <!-- 性能图表 -->
      <div class="chart-container">
        <h5>投资组合表现对比</h5>
        <v-chart
          :option="chartOption"
          style="height: 250px;"
        />
      </div>

      <!-- 风险提示 -->
      <a-alert
        message="投资风险提示"
        description="本系统仅供教育和研究目的使用，不构成投资建议。投资有风险，决策需谨慎。"
        type="warning"
        show-icon
        style="margin-top: 24px;"
      />
    </div>
  </div>
</template>

<script>
import { defineComponent, computed } from 'vue';
import { 
  TrendingUpOutlined, 
  TrendingDownOutlined, 
  MinusOutlined,
  DollarOutlined
} from '@ant-design/icons-vue';
import { use } from 'echarts/core';
import { CanvasRenderer } from 'echarts/renderers';
import { LineChart } from 'echarts/charts';
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
} from 'echarts/components';
import VChart from 'vue-echarts';

use([
  CanvasRenderer,
  LineChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
  GridComponent
]);

export default defineComponent({
  name: 'AnalysisResults',
  components: {
    VChart,
    TrendingUpOutlined,
    TrendingDownOutlined,
    MinusOutlined,
    DollarOutlined,
  },
  props: {
    results: {
      type: Object,
      default: null,
    },
    loading: {
      type: Boolean,
      default: false,
    },
  },
  setup() {
    const getDecisionColor = (decision) => {
      if (!decision) return '#666';
      const action = decision.toLowerCase();
      if (action.includes('buy') || action.includes('买入')) return '#52c41a';
      if (action.includes('sell') || action.includes('卖出')) return '#ff4d4f';
      return '#faad14';
    };

    const getDecisionIcon = (decision) => {
      if (!decision) return 'MinusOutlined';
      const action = decision.toLowerCase();
      if (action.includes('buy') || action.includes('买入')) return 'TrendingUpOutlined';
      if (action.includes('sell') || action.includes('卖出')) return 'TrendingDownOutlined';
      return 'MinusOutlined';
    };

    const getDecisionCardClass = (decision) => {
      if (!decision) return 'decision-card';
      const action = decision.toLowerCase();
      if (action.includes('buy') || action.includes('买入')) return 'decision-card decision-buy';
      if (action.includes('sell') || action.includes('卖出')) return 'decision-card decision-sell';
      return 'decision-card decision-hold';
    };

    const getSignalColor = (signal) => {
      if (!signal) return 'default';
      const sentiment = signal.toLowerCase();
      if (sentiment.includes('bullish') || sentiment.includes('看涨') || sentiment.includes('买入')) return 'success';
      if (sentiment.includes('bearish') || sentiment.includes('看跌') || sentiment.includes('卖出')) return 'error';
      return 'warning';
    };

    const getConfidenceColor = (confidence) => {
      if (confidence >= 80) return '#52c41a';
      if (confidence >= 60) return '#faad14';
      return '#ff4d4f';
    };

    const formatAnalystName = (analyst) => {
      return analyst.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    const chartOption = computed(() => ({
      tooltip: {
        trigger: 'axis'
      },
      legend: {
        data: ['AI策略', '基准指数']
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: ['1月', '2月', '3月', '4月', '5月', '6月']
      },
      yAxis: {
        type: 'value'
      },
      series: [
        {
          name: 'AI策略',
          type: 'line',
          data: [100, 105, 98, 112, 108, 115],
          smooth: true,
          lineStyle: {
            color: '#667eea'
          }
        },
        {
          name: '基准指数',
          type: 'line',
          data: [100, 102, 101, 104, 106, 108],
          smooth: true,
          lineStyle: {
            color: '#82ca9d'
          }
        }
      ]
    }));

    return {
      getDecisionColor,
      getDecisionIcon,
      getDecisionCardClass,
      getSignalColor,
      getConfidenceColor,
      formatAnalystName,
      chartOption,
    };
  },
});
</script>