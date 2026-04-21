import { echartsDarkTheme } from '@ess/shared/theme/echarts-dark'
import ReactEChartsCore from 'echarts-for-react/esm/core'
import { BarChart, LineChart, PieChart } from 'echarts/charts'
import { GridComponent, LegendComponent, TooltipComponent } from 'echarts/components'
import * as echarts from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'

echarts.use([
  LineChart,
  BarChart,
  PieChart,
  TooltipComponent,
  LegendComponent,
  GridComponent,
  CanvasRenderer,
])

echarts.registerTheme('dark', echartsDarkTheme)

export default function ReactECharts(
  props: Omit<React.ComponentProps<typeof ReactEChartsCore>, 'echarts'>,
) {
  return <ReactEChartsCore echarts={echarts} {...props} />
}
