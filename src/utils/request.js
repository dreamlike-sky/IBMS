import axios from 'axios'
import JSONbig from 'json-bigint'
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
export default request
