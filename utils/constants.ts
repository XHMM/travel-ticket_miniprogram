// [！管理后台，小程序，API Server公用，务必保持一致！]
// 用于请求响应的状态码
// 2打头类似状态码2xx
// 3打头类似状态码3xx
// 4打头类似状态码4xx
// 序号都是依次递增，没啥特殊表示
export enum RESPONSE_CODE {
  OK = 2000,
  NEW_USER = 2001,

  NO_CHANGE = 3000, // 内容无变化

  FAIL = 4000,
  NO_RIGHT = 4001, // 没有足够权力(token通过但是权限不足时返回此码)


  NO_SEAT = 4004, // 没有空位了
  SEATS_NOT_ENOUGH = 4005, // 位子不足

  MENG_BI = 5000, // 懵逼状态码
}


