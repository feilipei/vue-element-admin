<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

const animationDuration = 3000

export default {
  mixins: [resize],
  // 属性数组
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

  // 数据：Vue 实例的数据对象chart
  data() {
    return {
      chart: null
    }
  },

  // 生命周期钩子
  mounted() {
    // Vue中DOM更新是异步的
    // 在数据变化后要执行的某个操作，而这个操作需要使用随数据改变而改变的DOM结构的时候，这个操作都应该放进Vue.nextTick()的回调函数中。
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
      // 初始化一个 echarts 实例,应用的主题为macarons。
      this.chart = echarts.init(this.$el, 'macarons')

      this.chart.setOption({
        // 1.提示框组件。
        tooltip: {
          trigger: 'axis', // 坐标轴触发
          axisPointer: { // 坐标轴指示器，坐标轴触发有效
            type: 'shadow' // 默认为直线，可选为：'line' | 'shadow'
          }
        },
        // 2.雷达图坐标系组件，只适用于雷达图。
        radar: {
          // 2.1半径
          radius: '66%',
          // 2.2中心（圆心）坐标，数组的第一项是横坐标，第二项是纵坐标。
          center: ['50%', '42%'],
          // 2.3指示器轴的分割段数。
          splitNumber: 8,
          // 2.4坐标轴在 grid 区域中的分隔区域，默认不显示。
          splitArea: {
            areaStyle: {
              color: 'rgba(127,95,132,.3)',
              opacity: 1,
              shadowBlur: 45,
              shadowColor: 'rgba(0,0,0,.5)',
              shadowOffsetX: 0,
              shadowOffsetY: 15
            }
          },
          // 2.5雷达图的指示器，用来指定雷达图中的多个变量（维度）
          indicator: [
            { name: 'Sales', max: 10000 },
            { name: 'Administration', max: 20000 },
            { name: 'Information Technology', max: 20000 },
            { name: 'Customer Support', max: 20000 },
            { name: 'Development', max: 20000 },
            { name: 'Marketing', max: 20000 }
          ]
        },
        // 3、图例组件展现了不同系列的标记(symbol)，颜色和名字。可以通过点击图例控制哪些系列不显示。
        legend: {
          left: 'center', // 图例组件离容器左侧的距离
          bottom: '10', // 图例组件离容器下侧的距离
          data: ['Allocated Budget', 'Expected Spending', 'Actual Spending'] // 图例的数据数组，每一项代表一个系列的name
        },
        // 4、系列列表。每个系列通过 type 决定自己的图表类型
        series: [{
          type: 'radar',
          symbolSize: 0, // 标记大小
          areaStyle: { // 区域填充样式
            normal: {
              shadowBlur: 13, // 图形阴影大小
              shadowColor: 'rgba(0,0,0,.2)', // 阴影颜色
              shadowOffsetX: 0, // 阴影水平上的偏移距离
              shadowOffsetY: 10,
              opacity: 1 // 图形透明度
            }
          },
          data: [
            {
              value: [5000, 7000, 12000, 11000, 15000, 14000], // 单个数据项的数值
              name: 'Allocated Budget' // 数据项名称
            },
            {
              value: [4000, 9000, 15000, 15000, 13000, 11000],
              name: 'Expected Spending'
            },
            {
              value: [5500, 11000, 12000, 15000, 12000, 12000],
              name: 'Actual Spending'
            }
          ],
          animationDuration: animationDuration // 初始动画的时长，支持回调函数
        }]
      })
    }
  }
}
</script>
