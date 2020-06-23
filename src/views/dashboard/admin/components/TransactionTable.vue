<template>
  <!-- el-table用于展示多条结构类似的数据，可对数据进行排序、筛选、对比或其他自定义操作。el-table元素中注入data对象数组, data属性用于存放请求数据回来的数组list" -->
  <el-table :data="list" style="width: 100%;padding-top: 15px;">
    <!-- 在el-table-column中用prop属性来对应对象中的键名即可填入数据，用label属性来定义表格的列名，即为索引。可以使用width属性来定义列宽。 -->
    <!--1、订单号列 -->
    <el-table-column label="Order_No" min-width="200">
      <!-- 插槽slot，是组件的一块HTML模板，这块模板显示不显示、以及怎样显示由父组件来决定。 -->
      <!-- slot-scope是一个作用域插槽，配合elementUI里的table组件来使用,这里取到当前单元格 -->
      <template slot-scope="scope">
        <!-- scope.row 直接取到该单元格对象，就是数组里的元素对象 -->
        <!-- 过滤器可以用在两个地方：双花括号插值和 v-bind 表达式。过滤器应该被添加在 JavaScript 表达式的尾部，由“管道”符号指示 -->
        {{ scope.row.order_no | orderNoFilter }}
      </template>
    </el-table-column>

    <!-- 2、价格列 -->
    <el-table-column label="Price" width="195" align="center">
      <template slot-scope="scope">
        ¥{{ scope.row.price | toThousandFilter }}
      </template>
    </el-table-column>

    <!-- 3、状态列 -->
    <el-table-column label="Status" width="100" align="center">
      <template slot-scope="{row}">
        <!-- 用于标记和选择。由type属性来选择tag的类型 -->
        <el-tag :type="row.status | statusFilter">
          {{ row.status }}
        </el-tag>
      </template>
    </el-table-column>
  </el-table>
</template>

<script>
import { transactionList } from '@/api/remote-search'

export default {
  // 包含 Vue 实例可用过滤器的哈希表。
  // Vue.js允许你自定义过滤器，可被用于一些常见的文本格式化。
  filters: {
    statusFilter(status) {
      const statusMap = {
        success: 'success',
        pending: 'danger'
      }
      return statusMap[status]
    },
    orderNoFilter(str) {
      return str.substring(0, 30)
    }
  },

  // 数据
  data() {
    return {
      list: null
    }
  },
  created() {
    this.fetchData()
  },

  // methods 将被混入到 Vue 实例中。可以直接通过 VM 实例访问这些方法，或者在指令表达式中使用。
  methods: {
    // 异步函数
    fetchData() {
      // Promise实例生成以后，可以用then方法分别指定resolved状态和rejected状态的回调函数。
      // then方法可以接受两个回调函数作为参数。第一个回调函数是Promise对象的状态变为resolved成功时调用，第二个回调函数是Promise对象的状态变为rejected失败时调用。其中第二个函数失败是可选的不一定要提供。这两个函数都接受Promise对象传出的值作为参数。
      transactionList().then(response => {
        this.list = response.data.items.slice(0, 8)
      })
    }
  }
}
</script>
