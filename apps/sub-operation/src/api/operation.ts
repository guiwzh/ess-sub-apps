import request from '@ess/shared/utils/request'

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
  return request.get<ApiResponse<PageResult<DeviceItem>>>('/operation/devices', { params })
}

/** 设备详情 */
export function getDeviceDetail(id: string) {
  return request.get<ApiResponse<DeviceDetail>>(`/operation/devices/${id}`)
}

/** 告警列表（分页 + 筛选） */
export function getAlarms(params: {
  current?: number
  pageSize?: number
  level?: string
  status?: string
  deviceCode?: string
}) {
  return request.get<ApiResponse<PageResult<AlarmItem>>>('/operation/alarms', { params })
}

export interface HistoryAlarmItem {
  id: string
  deviceCode: string
  message: string
  level: 'critical' | 'warning' | 'info'
  time: string
  resolvedTime: string
  station: string
}

/** 历史告警 */
export function getHistoryAlarms(params: {
  current?: number
  pageSize?: number
  level?: string
  station?: string
  deviceCode?: string
}) {
  return request.get<ApiResponse<PageResult<HistoryAlarmItem>>>('/operation/alarms/history', {
    params,
  })
}

/** 确认告警 */
export function confirmAlarm(id: string) {
  return request.post<ApiResponse<null>>(`/operation/alarms/${id}/confirm`)
}

/** 消除告警 */
export function clearAlarm(id: string) {
  return request.post<ApiResponse<null>>(`/operation/alarms/${id}/clear`)
}

export interface AlarmRule {
  id: string
  name: string
  deviceType: string
  param: string
  operator: string
  threshold: number
  level: string
  notifyMethod: string
  enabled: boolean
}

/** 获取告警规则列表 */
export function getAlarmRules() {
  return request.get<ApiResponse<AlarmRule[]>>('/operation/alarm-rules')
}

/** 创建告警规则 */
export function createAlarmRule(data: Omit<AlarmRule, 'id'>) {
  return request.post<ApiResponse<{ id: string }>>('/operation/alarm-rules', data)
}

/** 更新告警规则 */
export function updateAlarmRule(id: string, data: Partial<AlarmRule>) {
  return request.put<ApiResponse<null>>(`/operation/alarm-rules/${id}`, data)
}

/** 删除告警规则 */
export function deleteAlarmRule(id: string) {
  return request.delete<ApiResponse<null>>(`/operation/alarm-rules/${id}`)
}
