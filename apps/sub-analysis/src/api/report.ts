import request from '@ess/shared/utils/request'

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface DailyReportData {
  date: string
  summary: {
    totalCharge: number
    totalDischarge: number
    peakPower: number
    avgEfficiency: number
    revenue: number
  }
  hourly: {
    hour: string
    charge: number
    discharge: number
    power: number
  }[]
}

export interface MonthlyReportData {
  month: string
  summary: {
    totalCharge: number
    totalDischarge: number
    peakPower: number
    avgEfficiency: number
    revenue: number
  }
  daily: {
    date: string
    charge: number
    discharge: number
    revenue: number
  }[]
}

export interface IndicatorItem {
  key: string
  label: string
}

export interface CustomReportData {
  labels: string[]
  series: Record<string, number[]>
}

export function getDailyReport(params: { date?: string }) {
  return request.get<ApiResponse<DailyReportData>>('/analysis/report/daily', { params })
}

export function getMonthlyReport(params: { month?: string }) {
  return request.get<ApiResponse<MonthlyReportData>>('/analysis/report/monthly', { params })
}

export function getIndicators() {
  return request.get<ApiResponse<IndicatorItem[]>>('/analysis/report/indicators')
}

export function getCustomReport(data: {
  indicators: string[]
  startDate: string
  endDate: string
}) {
  return request.post<ApiResponse<CustomReportData>>('/analysis/report/custom', data)
}
