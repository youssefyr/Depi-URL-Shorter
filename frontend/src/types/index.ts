export interface UrlData {
  originalUrl: string;
  shortCode: string;
  createdAt?: string;
}

export interface UrlRecord {
  id: number;
  original_url: string;
  short_code: string;
  created_at: string;
  clicks: number;
}

export interface MetricsData {
  urlsShortened: number;
  successfulRedirects: number;
  failedLookups: number;
  averageLatency: number;
  p95Latency: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}