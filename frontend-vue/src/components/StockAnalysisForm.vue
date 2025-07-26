<template>
  <div>
    <!-- 股票输入部分 -->
    <div class="stock-input-section">
      <h4 class="section-title">🎯 选择股票</h4>
      <a-input-group compact>
        <a-input
          v-model:value="stockInput"
          placeholder="输入股票代码 (如: AAPL, TSLA)"
          @press-enter="addStock"
          style="width: calc(100% - 80px)"
        />
        <a-button type="primary" @click="addStock">
          <template #icon><PlusOutlined /></template>
          添加
        </a-button>
      </a-input-group>
      
      <div class="stock-tags">
        <a-tag
          v-for="stock in stocks"
          :key="stock"
          closable
          class="stock-tag"
          @close="removeStock(stock)"
        >
          {{ stock }}
        </a-tag>
      </div>
      <div v-if="stocks.length === 0" style="color: #8c8c8c; margin-top: 8px;">
        请添加要分析的股票代码
      </div>
    </div>

    <a-divider />

    <!-- 模型选择部分 -->
    <div class="model-selection-section">
      <h4 class="section-title">🤖 选择AI模型</h4>
      <a-select
        v-model:value="selectedModel"
        placeholder="选择AI模型"
        style="width: 100%"
      >
        <a-select-option
          v-for="model in MODELS"
          :key="model.value"
          :value="model.value"
        >
          {{ model.label }}
        </a-select-option>
      </a-select>
    </div>

    <a-divider />

    <!-- 分析师选择部分 -->
    <div class="analyst-selection-section">
      <h4 class="section-title">👥 选择投资分析师</h4>
      <a-checkbox-group v-model:value="selectedAnalysts" style="width: 100%">
        <a-space direction="vertical" style="width: 100%">
          <a-checkbox
            v-for="analyst in ANALYSTS"
            :key="analyst.key"
            :value="analyst.key"
          >
            <div>
              <div style="font-weight: 600;">{{ analyst.name }}</div>
              <div style="color: #8c8c8c; font-size: 12px;">
                {{ analyst.description }}
              </div>
            </div>
          </a-checkbox>
        </a-space>
      </a-checkbox-group>
    </div>

    <a-divider />

    <!-- 高级选项 -->
    <a-checkbox v-model:checked="showReasoning">
      显示分析师推理过程
    </a-checkbox>

    <!-- 提交按钮 -->
    <div style="margin-top: 24px;">
      <a-button
        type="primary"
        :loading="loading"
        class="analysis-button"
        size="large"
        @click="handleSubmit"
      >
        {{ loading ? '分析中...' : '开始智能分析' }}
      </a-button>
    </div>
  </div>
</template>

<script>
import { defineComponent, ref, reactive } from 'vue';
import { message } from 'ant-design-vue';
import { PlusOutlined } from '@ant-design/icons-vue';
import { analyzeStock } from '../services/api';

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

export default defineComponent({
  name: 'StockAnalysisForm',
  components: {
    PlusOutlined,
  },
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['analysis-start', 'analysis-complete'],
  setup(props, { emit }) {
    const stocks = ref([]);
    const stockInput = ref('');
    const selectedModel = ref('gpt-4o');
    const selectedAnalysts = ref(['warren_buffett', 'technical_analyst', 'fundamentals_analyst']);
    const showReasoning = ref(false);

    const addStock = () => {
      const input = stockInput.value.trim().toUpperCase();
      if (input && !stocks.value.includes(input)) {
        stocks.value.push(input);
        stockInput.value = '';
      }
    };

    const removeStock = (stockToRemove) => {
      stocks.value = stocks.value.filter(stock => stock !== stockToRemove);
    };

    const handleSubmit = async () => {
      if (stocks.value.length === 0) {
        message.error('请至少添加一只股票');
        return;
      }

      if (selectedAnalysts.value.length === 0) {
        message.error('请至少选择一位投资分析师');
        return;
      }

      if (!selectedModel.value) {
        message.error('请选择AI模型');
        return;
      }

      emit('analysis-start');

      try {
        const analysisData = {
          tickers: stocks.value,
          model_name: selectedModel.value,
          selected_analysts: selectedAnalysts.value,
          show_reasoning: showReasoning.value,
        };

        const results = await analyzeStock(analysisData);
        emit('analysis-complete', results);
        message.success('分析完成！');
      } catch (error) {
        message.error('分析失败: ' + error.message);
        emit('analysis-complete', null);
      }
    };

    return {
      MODELS,
      ANALYSTS,
      stocks,
      stockInput,
      selectedModel,
      selectedAnalysts,
      showReasoning,
      addStock,
      removeStock,
      handleSubmit,
    };
  },
});
</script>

<style scoped>
.stock-input-section,
.model-selection-section,
.analyst-selection-section {
  margin-bottom: 24px;
}
</style>