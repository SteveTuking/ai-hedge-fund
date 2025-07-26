import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:8000',
  timeout: 300000, // 5分钟超时，因为AI分析可能需要较长时间
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    console.log('发送请求:', config);
    return config;
  },
  (error) => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    console.log('收到响应:', response);
    return response;
  },
  (error) => {
    console.error('响应错误:', error);
    let errorMessage = '网络请求失败';
    
    if (error.response) {
      // 服务器响应了错误状态码
      errorMessage = error.response.data?.message || `服务器错误 (${error.response.status})`;
    } else if (error.request) {
      // 请求发出但没有收到响应
      errorMessage = '服务器无响应，请检查网络连接';
    } else {
      // 其他错误
      errorMessage = error.message || '未知错误';
    }
    
    return Promise.reject(new Error(errorMessage));
  }
);

/**
 * 分析股票
 * @param {Object} analysisData - 分析参数
 * @param {Array} analysisData.tickers - 股票代码数组
 * @param {string} analysisData.model_name - 模型名称
 * @param {Array} analysisData.selected_analysts - 选中的分析师
 * @param {string} analysisData.start_date - 开始日期
 * @param {string} analysisData.end_date - 结束日期
 * @param {boolean} analysisData.show_reasoning - 是否显示推理过程
 * @returns {Promise} 分析结果
 */
export const analyzeStock = async (analysisData) => {
  try {
    const response = await api.post('/api/analyze', analysisData);
    return response.data;
  } catch (error) {
    console.error('股票分析失败:', error);
    throw error;
  }
};

/**
 * 获取股票历史数据
 * @param {string} ticker - 股票代码
 * @param {string} startDate - 开始日期
 * @param {string} endDate - 结束日期
 * @returns {Promise} 历史数据
 */
export const getStockHistory = async (ticker, startDate, endDate) => {
  try {
    const response = await api.get(`/api/stock/${ticker}/history`, {
      params: {
        start_date: startDate,
        end_date: endDate,
      },
    });
    return response.data;
  } catch (error) {
    console.error('获取股票历史数据失败:', error);
    throw error;
  }
};

/**
 * 获取可用的AI模型列表
 * @returns {Promise} 模型列表
 */
export const getAvailableModels = async () => {
  try {
    const response = await api.get('/api/models');
    return response.data;
  } catch (error) {
    console.error('获取模型列表失败:', error);
    throw error;
  }
};

/**
 * 获取可用的分析师列表
 * @returns {Promise} 分析师列表
 */
export const getAvailableAnalysts = async () => {
  try {
    const response = await api.get('/api/analysts');
    return response.data;
  } catch (error) {
    console.error('获取分析师列表失败:', error);
    throw error;
  }
};

/**
 * 获取回测结果
 * @param {Object} backtestData - 回测参数
 * @returns {Promise} 回测结果
 */
export const runBacktest = async (backtestData) => {
  try {
    const response = await api.post('/api/backtest', backtestData);
    return response.data;
  } catch (error) {
    console.error('回测失败:', error);
    throw error;
  }
};

export default api;