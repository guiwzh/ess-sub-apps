import { getStationOptions as getStationOpts } from '@/constants/options'
import type { TFunction } from 'i18next'

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

export const getStationOptions = getStationOpts
