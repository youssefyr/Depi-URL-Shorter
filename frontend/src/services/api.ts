import axios from 'axios';
import { UrlData, MetricsData, ApiResponse, UrlRecord } from '../types';

// relative URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const api = {
  shortenUrl: async (originalUrl: string): Promise<ApiResponse<UrlData>> => {
    try {
      const response = await axios.post(`${API_URL}/api/shorten`, { url: originalUrl });
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.error || 'Failed to shorten URL' };
    }
  },

  getMetrics: async (): Promise<ApiResponse<MetricsData>> => {
    try {
      const response = await axios.get(`${API_URL}/api/metrics`);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch metrics' };
    }
  },

  getAllUrls: async (): Promise<ApiResponse<UrlRecord[]>> => {
    try {
      const response = await axios.get(`${API_URL}/api/urls`);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch URLs' };
    }
  },

  getUrlStats: async (shortCode: string): Promise<ApiResponse<any[]>> => {
    try {
      const response = await axios.get(`${API_URL}/api/stats/${shortCode}`);
      return { success: true, data: response.data };
    } catch (error: any) {
      return { success: false, error: error.response?.data?.error || 'Failed to fetch stats' };
    }
  }
};