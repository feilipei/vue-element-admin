<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  mixins: [resize],
  props: {
    className: {
      type: String,
      default: 'chart'
    },
    width: {
      type: String,
      default: '100%'
    },
    height: {
      type: String,
      default: '300px'
    }
  },
  data() {
    return {
      chart: null
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.initChart()
    })
  },
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },
  methods: {
    initChart() {
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        // 提示框组件。
        tooltip: {
          // 触发类型。数据项图形触发，主要在散点图，饼图等无类目轴的图表中使用。
          trigger: 'item',
          // 提示框浮层内容格式器，支持字符串模板和回调函数两种形式。
          // 饼图、仪表盘、漏斗图: {a}（系列series名称），{b}（数据项data名称），{c}（数值data）, {d}（百分比）
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        // 图例组件展现了不同系列的标记(symbol)，颜色和名字。可以通过点击图例控制哪些系列不显示。
        legend: {
          left: 'center',
          bottom: '10',
          data: ['Industries', 'Technology', 'Forex', 'Gold', 'Forecasts']
        },
        // 系列列表。每个系列通过 type 决定自己的图表类型
        series: [
          {
            name: 'WEEKLY WRITE ARTICLES',
            type: 'pie',
            // 是否展示成南丁格尔图，通过半径区分数据大小
            roseType: 'radius',
            radius: [15, 95],
            // 饼图的半径。
            center: ['50%', '38%'],
            // 系列中的数据内容数组
            data: [
              { value: 320, name: 'Industries' },
              { value: 240, name: 'Technology' },
              { value: 149, name: 'Forex' },
              { value: 100, name: 'Gold' },
              { value: 59, name: 'Forecasts' }
            ],
            animationEasing: 'cubicInOut',
            animationDuration: 2600
          }
        ]
      })
    }
  }
}
</script>
