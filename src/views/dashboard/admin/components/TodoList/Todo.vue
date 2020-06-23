<template>
  <!-- 每个列表项始于 <li> 标签。 class 绑定 -->
  <li :class="{ completed: todo.done, editing: editing }" class="todo">
    <div class="view">
      <!-- type="checkbox" 定义了复选框. 用户需要从若干给定的选择中选取一个或若干选项。toggle切换 -->
      <input
        :checked="todo.done"
        class="toggle"
        type="checkbox"
        @change="toggleTodo( todo)"
      >
      <!-- v-text更新元素的文本内容 -->
      <label @dblclick="editing = true" v-text="todo.text" />
      <!-- 子组件 -->
      <button class="destroy" @click="deleteTodo( todo )" />
    </div>
    <input
      v-show="editing"
      v-focus="editing"
      :value="todo.text"
      class="edit"
      @keyup.enter="doneEdit"
      @keyup.esc="cancelEdit"
      @blur="doneEdit"
    >
  </li>
</template>

<script>
export default {
  name: 'Todo',
  // 包含 Vue 实例可用指令的哈希表。Vue指令：用以改写某个组件的默认行为，或者增强使其获得额外功能
  directives: {
    focus(el, { value }, { context }) {
      if (value) {
        context.$nextTick(() => {
          el.focus()
        })
      }
    }
  },

  // 父组件通过 props 向下传递数据给子组件；子组件通过 events 给父组件发送消息。
  props: {
    todo: {
      type: Object,
      default: function() {
        return {}
      }
    }
  },
  data() {
    return {
      editing: false
    }
  },
  methods: {
    deleteTodo(todo) {
      // 触发当前实例上的事件。附加参数都会传给监听器回调。
      this.$emit('deleteTodo', todo)
    },
    editTodo({ todo, value }) {
      this.$emit('editTodo', { todo, value })
    },
    toggleTodo(todo) {
      this.$emit('toggleTodo', todo)
    },
    doneEdit(e) {
      const value = e.target.value.trim()
      const { todo } = this
      if (!value) {
        this.deleteTodo({
          todo
        })
      } else if (this.editing) {
        this.editTodo({
          todo,
          value
        })
        this.editing = false
      }
    },
    cancelEdit(e) {
      e.target.value = this.todo.text
      this.editing = false
    }
  }
}
</script>
