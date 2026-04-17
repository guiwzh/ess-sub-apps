import type { TFunction } from 'i18next'

/** 站点选项（含"全部"） */
export const getStationOptions = (t: TFunction) => [
  { label: t('station.all'), value: '' },
  { label: t('station.nameA'), value: '储能站点A' },
  { label: t('station.nameB'), value: '储能站点B' },
  { label: t('station.nameC'), value: '储能站点C' },
]
