import request from '@/utils/request'

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

export interface EnergyStatsData {
  labels: string[]
  charge: number[]
  discharge: number[]
}

export interface EfficiencyData {
  labels: string[]
  efficiency: number[]
}

export interface RevenueData {
  composition: { name: string; value: number }[]
  monthly: { labels: string[]; values: number[] }
}

export interface BatteryHealthData {
  labels: string[]
  soc: number[]
  soh: number[]
}

export function getEnergyStats(params: {
  dimension?: string
  startDate?: string
  endDate?: string
  station?: string
}) {
  return request.get<ApiResponse<EnergyStatsData>>('/api/analysis/energy-stats', { params })
}

export function getEfficiency(params: { startDate?: string; endDate?: string }) {
  return request.get<ApiResponse<EfficiencyData>>('/api/analysis/efficiency', { params })
}

export function getRevenue(params: { startDate?: string; endDate?: string }) {
  return request.get<ApiResponse<RevenueData>>('/api/analysis/revenue', { params })
}

export function getBatteryHealth(params: { startDate?: string; endDate?: string }) {
  return request.get<ApiResponse<BatteryHealthData>>('/api/analysis/battery-health', { params })
}
