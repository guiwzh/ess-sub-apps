import type { TFunction } from 'react-i18next'

export const getTypeOptions = (t: TFunction) => [
  { label: t('workorder.type.fault'), value: 'fault' },
  { label: t('workorder.type.maintenance'), value: 'maintenance' },
  { label: t('workorder.type.inspection'), value: 'inspection' },
]

export const getPriorityOptions = (t: TFunction) => [
  { label: t('workorder.priority.high'), value: 'high' },
  { label: t('workorder.priority.medium'), value: 'medium' },
  { label: t('workorder.priority.low'), value: 'low' },
]

export const getStationOptions = (t: TFunction) => [
  { label: t('station.nameA'), value: '储能站点A' },
  { label: t('station.nameB'), value: '储能站点B' },
  { label: t('station.nameC'), value: '储能站点C' },
]
