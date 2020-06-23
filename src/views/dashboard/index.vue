<template>
  <div class="dashboard-container">
    <!-- 动态组件，是Vue内置的标签，根据is的值而变化 -->
    <!-- HTML 属性中的值应使用 v-bind 指令。 -->
    <component :is="currentRole" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import adminDashboard from './admin'
import editorDashboard from './editor'

export default {
  name: 'Dashboard',
  // ES6语法在大括号里面，直接写入变量和函数，作为对象的属性和方法
  // 变量直接写在大括号里面。这时属性名就是变量名, 属性值就是变量值
  components: { adminDashboard, editorDashboard },
  data() {
    return {
      currentRole: 'adminDashboard'
    }
  },
  // 计算属性将被混入到 Vue 实例中。所有 getter 和 setter 的 this 上下文自动地绑定为 Vue 实例。
  computed: {
    // mapGetters 辅助函数仅仅是将 store 中的 getter 映射到局部计算属性：
    ...mapGetters([
      'roles'
    ])
  },
  created() {
    if (!this.roles.includes('admin')) {
      this.currentRole = 'editorDashboard'
    }
  }
}
</script>
