<template>
  <!-- template标签是用来写 html 模板的，且内部必须只有一个根元素 -->
  <div id="app">
    <!-- HTML <div> 元素是块级元素，它可用于组合其他 HTML 元素的容器。 -->
    <!-- 块级元素在浏览器显示时，通常会以新行来开始（和结束）。 -->
    <!-- 路由出口，路由匹配到的组件将渲染在这里 -->
    <!-- <router-link> 是定义页面中点击的部分，<router-view> 定义显示部分 -->
    <!-- 在需要更新的容器内添加 <router-view>标签 -->
    <router-view />
  </div>
</template>

<script>
// App.vue是主组件，所有组件都是在App.vue下进行切换的。
export default {
  name: 'App'
}
</script>

// .vue文件为单文件组件，是Vue.js自定义的一种文件格式，用类似HTML的语法描述一个单独的Vue组件。
//  每个.vue文件包含三种类型的顶级语言块 template,script 和 style。这三个部分分别代表了 html,js,css。
// template代表一个vue组件的html结构,但不是把代码包裹在template中就可以了，而是必须在里面方置一个 html 标签来包裹所有的代码。 一般采用div标签。

