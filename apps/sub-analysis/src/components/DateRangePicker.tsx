import { DatePicker, Radio, Space } from 'antd'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'
import { useState } from 'react'

const { RangePicker } = DatePicker

export type RangePreset = 'day' | 'week' | 'month' | 'year' | 'custom'

interface DateRangePickerProps {
  onChange?: (range: [string, string], preset: RangePreset) => void
  defaultPreset?: RangePreset
}

const presetOptions = [
  { label: '日', value: 'day' },
  { label: '周', value: 'week' },
  { label: '月', value: 'month' },
  { label: '年', value: 'year' },
  { label: '自定义', value: 'custom' },
]

function getPresetRange(preset: RangePreset): [Dayjs, Dayjs] {
  const now = dayjs()
  switch (preset) {
    case 'day':
      return [now.startOf('day'), now.endOf('day')]
    case 'week':
      return [now.startOf('week'), now.endOf('week')]
    case 'month':
      return [now.startOf('month'), now.endOf('month')]
    case 'year':
      return [now.startOf('year'), now.endOf('year')]
    default:
      return [now.subtract(30, 'day'), now]
  }
}

export default function DateRangePicker({
  onChange,
  defaultPreset = 'month',
}: DateRangePickerProps) {
  const [preset, setPreset] = useState<RangePreset>(defaultPreset)
  const [range, setRange] = useState<[Dayjs, Dayjs]>(getPresetRange(defaultPreset))

  const emitChange = (r: [Dayjs, Dayjs], p: RangePreset) => {
    onChange?.([r[0].format('YYYY-MM-DD'), r[1].format('YYYY-MM-DD')], p)
  }

  const handlePresetChange = (p: RangePreset) => {
    setPreset(p)
    if (p !== 'custom') {
      const newRange = getPresetRange(p)
      setRange(newRange)
      emitChange(newRange, p)
    }
  }

  return (
    <Space wrap>
      <Radio.Group
        optionType="button"
        buttonStyle="solid"
        size="small"
        options={presetOptions}
        value={preset}
        onChange={(e) => handlePresetChange(e.target.value)}
      />
      {preset === 'custom' && (
        <RangePicker
          size="small"
          value={range}
          onChange={(dates) => {
            if (dates && dates[0] && dates[1]) {
              const r: [Dayjs, Dayjs] = [dates[0], dates[1]]
              setRange(r)
              emitChange(r, 'custom')
            }
          }}
        />
      )}
    </Space>
  )
}
