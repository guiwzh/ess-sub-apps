import type { TFunction } from 'i18next'

/** 站点选项（不含"全部"） */
export const getStationOptions = (t: TFunction) => [
  { label: t('station.nameA'), value: '储能站点A' },
  { label: t('station.nameB'), value: '储能站点B' },
  { label: t('station.nameC'), value: '储能站点C' },
]

/** 站点筛选选项（含中文 value 用于表格筛选） */
export const getStationFilterOptions = (t: TFunction) => [
  { label: t('station.a'), value: '储能站点A' },
  { label: t('station.b'), value: '储能站点B' },
  { label: t('station.c'), value: '储能站点C' },
]

/** 设备类型选项 */
export const getDeviceTypeOptions = (t: TFunction) => [
  { label: t('device.type.pcs'), value: 'PCS' },
  { label: t('device.type.bms'), value: 'BMS' },
  { label: t('device.type.hvac'), value: 'HVAC' },
  { label: t('device.type.fire'), value: 'FIRE' },
  { label: t('device.type.trans'), value: 'TRANS' },
]

/** 设备分类 Tab 选项 */
export const getDeviceCategories = (t: TFunction) => [
  { key: '', label: t('device.all') },
  { key: 'PCS', label: t('device.type.pcs') },
  { key: 'BMS', label: t('device.type.bms') },
  { key: 'HVAC', label: t('device.type.hvacShort') },
  { key: 'FIRE', label: t('device.type.fireShort') },
  { key: 'TRANS', label: t('device.type.transShort') },
]
