<template>
  <div :class="className" :style="{height:height,width:width}" />
</template>

<script>
import echarts from 'echarts'
require('echarts/theme/macarons') // echarts theme
import resize from './mixins/resize'

export default {
  // mixins就是定义一部分公共的方法或者计算属性,然后混入到各个组件中使用,方便管理与统一修改
  // mixins 选项接受一个混入对象的数组。
  mixins: [resize],
  // props属性数组 可以是数组或对象，用于接收来自父组件的数据。
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
      default: '350px'
    },
    autoResize: {
      type: Boolean,
      default: true
    },
    // Echart数据
    chartData: {
      type: Object,
      required: true
    }
  },

  // Vue 实例的数据对象。Vue 将会递归将 data 的属性转换为 getter/setter，从而让 data 的属性能够响应数据变化。
  // 数据chart
  data() {
    return {
      chart: null
    }
  },

  // 一个对象，键是需要观察的表达式chartData，值是对应回调函数。
  watch: {
    chartData: {
      // handle就是你watch中需要具体执行的方法；deep：就是你需要监听的数据的深度，一般用来监听对象中某个属性的变化
      deep: true,
      handler(val) {
        this.setOptions(val)
      }
    }
  },

  // 所有的生命周期钩子自动绑定 this 上下文到实例中，因此可以访问数据，对属性和方法进行运算。
  mounted() {
    // Vue 实现响应式并不是数据发生变化之后 DOM 立即变化，而是按一定的策略进行 DOM 的更新。
    // nextTick里面的代码会在DOM更新后执行；
    // VUE的数据驱动视图更新是异步的，即修改数据后视图不会立刻更新，而是等同一事件循环中的所有数据变化完成之后，再统一进行视图更新。
    // ES6 允许使用“箭头”（=>）定义函数。如果箭头函数不需要参数或需要多个参数，就使用一个圆括号代表参数部分。
    this.$nextTick(() => {
      this.initChart()
    })
  },
  // 实例销毁之前调用
  beforeDestroy() {
    if (!this.chart) {
      return
    }
    this.chart.dispose()
    this.chart = null
  },

  // methods 将被混入到 Vue 实例中。可以直接通过 VM 实例访问这些方法，或者在指令表达式中使用。
  // methods中一般都是定义的需要事件触发的一些函数。
  methods: {
    // 初始化Echart
    initChart() {
      // Vue 实例使用的根 DOM 元素，初始化一个 echarts 实例,应用的主题为macarons。
      // this.$el指的是当前组件的元素
      this.chart = echarts.init(this.$el, 'macarons')
      this.setOptions(this.chartData)
    },
    // 指定图表的配置项和数据
    setOptions({ expectedData, actualData } = {}) {
      this.chart.setOption({
        // 直角坐标系 grid 中的 x 轴
        xAxis: {
          // 所有类目名称列表
          data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
          // 坐标轴两边留白策略
          boundaryGap: false,
          // 坐标轴刻度相关设置。
          axisTick: {
            show: false
          }
        },
        // 直角坐标系内绘图网格，单个 grid 内最多可以放置上下两个 X 轴，左右两个 Y 轴。
        grid: {
          // grid 组件离容器左侧的距离。
          left: 10,
          right: 10,
          bottom: 20,
          top: 30,
          // grid 区域是否包含坐标轴的刻度标签。
          containLabel: true
        },
        // 提示框组件。
        tooltip: {
          // 坐标轴触发，主要在柱状图，折线图等会使用类目轴的图表中使用。
          trigger: 'axis',
          // 坐标轴指示器是指示坐标轴当前刻度的工具。
          axisPointer: {
            type: 'cross'
          },
          // 提示框浮层内边距
          padding: [5, 10]
        },
        // 直角坐标系 grid 中的 y 轴
        yAxis: {
          axisTick: {
            show: false
          }
        },
        // 图例组件展现了不同系列的标记(symbol)，颜色和名字。可以通过点击图例控制哪些系列不显示。
        legend: {
          data: ['expected', 'actual']
        },
        // 系列列表。每个系列通过 type 决定自己的图表类型
        series: [{
          // 系列名称，用于tooltip的显示
          name: 'expected',
          // 折线拐点标志的样式。
          itemStyle: {
            normal: {
              color: '#FF005A',
              // 线条样式。
              lineStyle: {
                color: '#FF005A',
                width: 2
              }
            }
          },
          // 是否平滑曲线显示。
          smooth: true,
          // 折线图是用折线将各个数据点标志连接起来的图表，用于展现数据的变化趋势。
          type: 'line',
          // 系列中的数据内容数组。数组项通常为具体的数据项。
          data: expectedData,
          // 初始动画的时长，支持回调函数
          animationDuration: 2800,
          // 初始动画的缓动效果。
          animationEasing: 'cubicInOut'
        },
        {
          // 系列名称，用于tooltip的显示
          name: 'actual',
          smooth: true,
          // 折线图是用折线将各个数据点标志连接起来的图表，用于展现数据的变化趋势。
          type: 'line',
          itemStyle: {
            normal: {
              color: '#3888fa',
              lineStyle: {
                color: '#3888fa',
                width: 2
              },
              areaStyle: {
                color: '#f3f8ff'
              }
            }
          },
          data: actualData,
          animationDuration: 2800,
          animationEasing: 'quadraticOut'
        }]
      })
    }
  }
}
</script>
