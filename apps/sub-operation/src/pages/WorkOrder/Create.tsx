import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { message } from 'antd'
import { StepsForm, ProFormText, ProFormSelect, ProFormTextArea } from '@ant-design/pro-components'
import { createWorkOrder, getStaffList, type StaffItem } from '@/api/workorder'
import { getDevices, type DeviceItem } from '@/api/operation'

export default function WorkOrderCreate() {
  const navigate = useNavigate()
  const [staff, setStaff] = useState<StaffItem[]>([])
  const [devices, setDevices] = useState<DeviceItem[]>([])

  useEffect(() => {
    getStaffList().then(({ data: res }) => {
      if (res.code === 0) setStaff(res.data)
    })
    getDevices({ current: 1, pageSize: 100 }).then(({ data: res }) => {
      if (res.code === 0) setDevices(res.data.list)
    })
  }, [])

  return (
    <div style={{ padding: 24 }}>
      <StepsForm
        onFinish={async (values) => {
          const { data: res } = await createWorkOrder(values)
          if (res.code === 0) {
            message.success('工单创建成功')
            navigate('/work-orders')
          }
        }}
      >
        <StepsForm.StepForm name="type" title="选择类型">
          <ProFormSelect
            name="type"
            label="工单类型"
            rules={[{ required: true }]}
            options={[
              { label: '故障维修', value: 'fault' },
              { label: '维保', value: 'maintenance' },
              { label: '巡检', value: 'inspection' },
            ]}
          />
          <ProFormSelect
            name="priority"
            label="优先级"
            rules={[{ required: true }]}
            options={[
              { label: '高', value: 'high' },
              { label: '中', value: 'medium' },
              { label: '低', value: 'low' },
            ]}
          />
        </StepsForm.StepForm>

        <StepsForm.StepForm name="info" title="填写信息">
          <ProFormText name="title" label="工单标题" rules={[{ required: true }]} />
          <ProFormTextArea name="description" label="问题描述" />
          <ProFormSelect
            name="station"
            label="站点"
            options={[
              { label: '储能站点A', value: '储能站点A' },
              { label: '储能站点B', value: '储能站点B' },
              { label: '储能站点C', value: '储能站点C' },
            ]}
          />
        </StepsForm.StepForm>

        <StepsForm.StepForm name="device" title="关联设备">
          <ProFormSelect
            name="deviceCode"
            label="关联设备"
            options={devices.map((d) => ({
              label: `${d.code} - ${d.name}`,
              value: d.code,
            }))}
            showSearch
            fieldProps={{ allowClear: true }}
          />
        </StepsForm.StepForm>

        <StepsForm.StepForm name="assign" title="指派人员">
          <ProFormSelect
            name="assignee"
            label="负责人"
            rules={[{ required: true }]}
            options={staff.map((s) => ({
              label: `${s.name} (${s.role})`,
              value: s.name,
            }))}
          />
        </StepsForm.StepForm>
      </StepsForm>
    </div>
  )
}
