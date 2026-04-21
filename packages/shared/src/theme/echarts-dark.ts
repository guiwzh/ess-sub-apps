/**
 * ECharts 深色主题配置 — 与 antd darkAlgorithm 视觉对齐。
 * 使用方式：echarts.registerTheme('dark', echartsDarkTheme)
 * 不引入 echarts 依赖，保持 shared 包零外部依赖。
 */
export const echartsDarkTheme = {
  backgroundColor: 'transparent',
  textStyle: {
    color: 'rgba(255, 255, 255, 0.85)',
  },
  color: [
    '#5B8FF9',
    '#5AD8A6',
    '#5D7092',
    '#F6BD16',
    '#6F5EF9',
    '#E8684A',
    '#9270CA',
    '#FF9D4D',
    '#269A99',
    '#FF99C3',
  ],
  title: {
    textStyle: { color: 'rgba(255, 255, 255, 0.85)' },
    subtextStyle: { color: 'rgba(255, 255, 255, 0.65)' },
  },
  legend: {
    textStyle: { color: 'rgba(255, 255, 255, 0.65)' },
  },
  tooltip: {
    backgroundColor: 'rgba(50, 50, 50, 0.95)',
    borderColor: 'rgba(255, 255, 255, 0.15)',
    textStyle: { color: 'rgba(255, 255, 255, 0.85)' },
  },
  categoryAxis: {
    axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.25)' } },
    axisTick: { lineStyle: { color: 'rgba(255, 255, 255, 0.25)' } },
    axisLabel: { color: 'rgba(255, 255, 255, 0.65)' },
    splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.08)' } },
    splitArea: { areaStyle: { color: ['rgba(250, 250, 250, 0.02)', 'rgba(200, 200, 200, 0.02)'] } },
  },
  valueAxis: {
    axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.25)' } },
    axisTick: { lineStyle: { color: 'rgba(255, 255, 255, 0.25)' } },
    axisLabel: { color: 'rgba(255, 255, 255, 0.65)' },
    splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.08)' } },
    splitArea: { areaStyle: { color: ['rgba(250, 250, 250, 0.02)', 'rgba(200, 200, 200, 0.02)'] } },
  },
  logAxis: {
    axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.25)' } },
    axisLabel: { color: 'rgba(255, 255, 255, 0.65)' },
    splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.08)' } },
  },
  timeAxis: {
    axisLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.25)' } },
    axisLabel: { color: 'rgba(255, 255, 255, 0.65)' },
    splitLine: { lineStyle: { color: 'rgba(255, 255, 255, 0.08)' } },
  },
  line: {
    itemStyle: { borderWidth: 1 },
    lineStyle: { width: 2 },
    symbolSize: 4,
    symbol: 'circle',
    smooth: false,
  },
  bar: {
    itemStyle: { barBorderWidth: 0, barBorderColor: 'rgba(255, 255, 255, 0.15)' },
  },
  pie: {
    itemStyle: { borderWidth: 0, borderColor: 'rgba(255, 255, 255, 0.15)' },
  },
}
