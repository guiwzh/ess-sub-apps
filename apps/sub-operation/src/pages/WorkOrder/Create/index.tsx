import { useEffect, useState } from 'react'
import { message, Modal } from 'antd'
import { StepsForm, ProFormText, ProFormSelect, ProFormTextArea } from '@ant-design/pro-components'
import { useTranslation } from 'react-i18next'
import { createWorkOrder, getStaffList, type StaffItem } from '@/api/workorder'
import { getDevices, type DeviceItem } from '@/api/operation'
import { getTypeOptions, getPriorityOptions, getStationOptions } from './config'

interface WorkOrderCreateProps {
  open: boolean
  onClose: (created?: boolean) => void
}

export default function WorkOrderCreate({ open, onClose }: WorkOrderCreateProps) {
  const { t } = useTranslation()
  const [staff, setStaff] = useState<StaffItem[]>([])
  const [devices, setDevices] = useState<DeviceItem[]>([])

  useEffect(() => {
    if (!open) return
    getStaffList().then(({ data: res }) => {
      if (res.code === 0) setStaff(res.data)
    })
    getDevices({ current: 1, pageSize: 100 }).then(({ data: res }) => {
      if (res.code === 0) setDevices(res.data.list)
    })
  }, [open])

  return (
    <Modal
      title={t('workorder.create')}
      open={open}
      onCancel={() => onClose()}
      footer={null}
      width={700}
      destroyOnClose
    >
      <StepsForm
        onFinish={async (values) => {
          const { data: res } = await createWorkOrder(values)
          if (res.code === 0) {
            message.success(t('workorder.createSuccess'))
            onClose(true)
          }
        }}
      >
        <StepsForm.StepForm name="type" title={t('workorder.step.selectType')}>
          <ProFormSelect
            name="type"
            label={t('workorder.type')}
            rules={[{ required: true }]}
            options={getTypeOptions(t)}
          />
          <ProFormSelect
            name="priority"
            label={t('workorder.priority')}
            rules={[{ required: true }]}
            options={getPriorityOptions(t)}
          />
        </StepsForm.StepForm>

        <StepsForm.StepForm name="info" title={t('workorder.step.fillInfo')}>
          <ProFormText name="title" label={t('workorder.subject')} rules={[{ required: true }]} />
          <ProFormTextArea name="description" label={t('workorder.description')} />
          <ProFormSelect
            name="station"
            label={t('workorder.station')}
            options={getStationOptions(t)}
          />
        </StepsForm.StepForm>

        <StepsForm.StepForm name="device" title={t('workorder.step.bindDevice')}>
          <ProFormSelect
            name="deviceCode"
            label={t('workorder.device')}
            options={devices.map((d) => ({
              label: `${d.code} - ${d.name}`,
              value: d.code,
            }))}
            showSearch
            fieldProps={{ allowClear: true }}
          />
        </StepsForm.StepForm>

        <StepsForm.StepForm name="assign" title={t('workorder.step.assign')}>
          <ProFormSelect
            name="assignee"
            label={t('workorder.assignee')}
            rules={[{ required: true }]}
            options={staff.map((s) => ({
              label: `${s.name} (${s.role})`,
              value: s.name,
            }))}
          />
        </StepsForm.StepForm>
      </StepsForm>
    </Modal>
  )
}
