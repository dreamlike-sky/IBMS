import axios from 'axios'
import JSONbig from 'json-bigint'
import router from '@/router'
import { Message } from 'element-ui'

const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn',
  transformResponse: [function (data) {
    try {
      return JSONbig.parse(data)
    } catch (error) {
      console.log('转换失败', error)
      return data
    }
  }]
})
request.interceptors.request.use(
  function (config) {
    const user = JSON.parse(window.localStorage.getItem('user'))
    if (user) {
      config.headers.Authorization = `Bearer ${user.token}`
    }
    return config
  },
  function (error) {
    return Promise.reject(error)
  }
)
request.interceptors.response.use(function (response) {
  return response
}, function (error) {
  const { status } = error.response
  if (status === 401) {
    window.localStorage.removeItem('user')
    router.push('/login')
    Message('登录状态无效，请重新登录')
  } else if (status === 403) {
    Message({
      type: 'warning',
      message: '没有操作权限'
    })
  } else if (status === 400) {
    Message('请求参数错误，请检查请求参数')
  } else if (status >= 500) {
    Message.error('服务端内部异常，请稍后重试')
  }
  return Promise.reject(error)
})

export default request
