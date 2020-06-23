// ES6 模块不是对象，而是通过export命令显式指定输出的代码，再通过import命令输入。
import request from '@/utils/request'

// function 命令:函数声明
export function login(data) {
  // 调用request，request为axios实例。可以通过向 axios 传递相关配置来创建请求。
  // 传入参数为配置对象，返回一个Promise实例对象
  return request({
    url: '/vue-element-admin/user/login',
    method: 'post',
    data
  })
}

export function getInfo(token) {
  return request({
    url: '/vue-element-admin/user/info',
    method: 'get',
    params: { token }
  })
}

export function logout() {
  return request({
    url: '/vue-element-admin/user/logout',
    method: 'post'
  })
}
