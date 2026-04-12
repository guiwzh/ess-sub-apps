import request from '@/utils/request'

export interface DeviceItem {
  id: string
  code: string
  name: string
  type: string
  status: string
  station: string
  ratedPower: string
  installDate: string
}

export interface DeviceDetail extends DeviceItem {
  runningParams: {
    voltage: number
    current: number
    power: number
    temperature: number
    soc?: number
    soh?: number
  }
  historyData: {
    timestamps: string[]
    power: number[]
    temperature: number[]
  }
  maintenanceRecords: {
    id: string
    date: string
    type: string
    operator: string
    result: string
  }[]
}

export interface AlarmItem {
  id: string
  deviceCode: string
  message: string
  level: 'critical' | 'warning' | 'info'
  time: string
  status: 'active' | 'resolved'
}

interface PageResult<T> {
  list: T[]
  total: number
}

interface ApiResponse<T> {
  code: number
  message: string
  data: T
}

/** 设备列表（分页 + 搜索） */
export function getDevices(params: {
  current?: number
  pageSize?: number
  keyword?: string
  type?: string
}) {
  return request.get<ApiResponse<PageResult<DeviceItem>>>(
    '/api/operation/devices',
    { params },
  )
}

/** 设备详情 */
export function getDeviceDetail(id: string) {
  return request.get<ApiResponse<DeviceDetail>>(
    `/api/operation/devices/${id}`,
  )
}

/** 告警列表（分页 + 筛选） */
export function getAlarms(params: {
  current?: number
  pageSize?: number
  level?: string
  status?: string
}) {
  return request.get<ApiResponse<PageResult<AlarmItem>>>(
    '/api/operation/alarms',
    { params },
  )
}
