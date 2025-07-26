import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: process.env.VUE_APP_API_BASE_URL || 'http://localhost:8000',
  timeout: 300000, // 5分钟超时
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
      errorMessage = error.response.data?.message || `服务器错误 (${error.response.status})`;
    } else if (error.request) {
      errorMessage = '服务器无响应，请检查网络连接';
    } else {
      errorMessage = error.message || '未知错误';
    }
    
    return Promise.reject(new Error(errorMessage));
  }
);

/**
 * 分析股票
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

export default api;