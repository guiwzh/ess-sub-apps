import request from '@/utils/request'

export interface WorkOrder {
  id: string
  title: string
  type: 'fault' | 'maintenance' | 'inspection'
  priority: 'high' | 'medium' | 'low'
  status: 'pending' | 'processing' | 'completed' | 'closed'
  deviceCode: string
  station: string
  assignee: string
  createdAt: string
}

export interface WorkOrderDetail extends WorkOrder {
  timeline: {
    time: string
    action: string
    operator: string
    remark: string
  }[]
}

export interface StaffItem {
  id: string
  name: string
  role: string
}

export interface InspectionTemplate {
  id: string
  name: string
  items: string[]
  frequency: string
  enabled: boolean
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

export function getWorkOrders(params: {
  current?: number
  pageSize?: number
  status?: string
  type?: string
}) {
  return request.get<ApiResponse<PageResult<WorkOrder>>>(
    '/api/operation/work-orders',
    { params },
  )
}

export function createWorkOrder(data: Partial<WorkOrder>) {
  return request.post<ApiResponse<{ id: string }>>('/api/operation/work-orders', data)
}

export function getWorkOrderDetail(id: string) {
  return request.get<ApiResponse<WorkOrderDetail>>(`/api/operation/work-orders/${id}`)
}

export function getStaffList() {
  return request.get<ApiResponse<StaffItem[]>>('/api/operation/staff')
}

export function getInspectionTemplates() {
  return request.get<ApiResponse<InspectionTemplate[]>>('/api/operation/inspection-templates')
}

export function createInspectionTemplate(data: Omit<InspectionTemplate, 'id'>) {
  return request.post<ApiResponse<{ id: string }>>('/api/operation/inspection-templates', data)
}

export function updateInspectionTemplate(id: string, data: Partial<InspectionTemplate>) {
  return request.put<ApiResponse<null>>(`/api/operation/inspection-templates/${id}`, data)
}

export function deleteInspectionTemplate(id: string) {
  return request.delete<ApiResponse<null>>(`/api/operation/inspection-templates/${id}`)
}
