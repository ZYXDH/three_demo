import { axios } from '@/utils/http/axios'

// 首页藏品信息
export const getPositionList = () =>
  axios({
    url: 'getPositionList',
    
    method: 'get'
  })
  export const addPosition = (data:object) =>
  axios({
    url: 'addPosition',
    data,
    method: 'get'
  })