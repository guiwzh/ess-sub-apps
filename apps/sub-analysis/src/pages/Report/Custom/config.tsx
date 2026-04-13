import type { TFunction } from 'react-i18next'
import type { IndicatorItem } from '@/api/report'

export const colorPalette = [
  '#1890ff',
  '#52c41a',
  '#fa8c16',
  '#722ed1',
  '#f5222d',
  '#13c2c2',
  '#eb2f96',
]

export const getChartOption = (
  t: TFunction,
  indicators: IndicatorItem[],
  selected: string[],
  data: { labels: string[]; series: Record<string, number[]> },
) => ({
  tooltip: { trigger: 'axis' as const },
  legend: {
    data: selected.map((k) => indicators.find((i) => i.key === k)?.label ?? k),
  },
  xAxis: { type: 'category' as const, data: data.labels },
  yAxis: { type: 'value' as const },
  series: selected.map((k, idx) => ({
    name: indicators.find((i) => i.key === k)?.label ?? k,
    type: 'line' as const,
    data: data.series[k] ?? [],
    smooth: true,
    itemStyle: { color: colorPalette[idx % colorPalette.length] },
  })),
})

export const getTableColumns = (t: TFunction, indicators: IndicatorItem[], selected: string[]) => [
  { title: t('report.time'), dataIndex: 'label', key: 'label' },
  ...selected.map((k) => ({
    title: indicators.find((i) => i.key === k)?.label ?? k,
    dataIndex: k,
    key: k,
  })),
]
