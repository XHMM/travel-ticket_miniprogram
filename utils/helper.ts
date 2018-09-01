import {differenceInDays, isBefore, isAfter} from "date-fns";
import {LOGIN} from "./gqls";
import {RESPONSE_CODE} from "./constants";
import * as cloneDeep from 'lodash.clonedeep';

export function clone(obj: any) {
  return cloneDeep(obj);
}

async function getWXCode():Promise<string> {
  return new Promise<string>((resolve, reject) => {
    wx.login({
      success:(res)=>{
        resolve(res.code)
      },
      fail:(err)=>{
        reject(err)
      }
    })
  })
}
export async function login(app: any, cb?: any):Promise<void> {
  const localToken = wx.getStorageSync("token");
  if (localToken) app.data.token = localToken;
  try {
    const code = await getWXCode();
    const { smallappLogin } = await graphql({
      app,
      variables: { code },
      query: LOGIN
    });
    if (
      smallappLogin.code === RESPONSE_CODE.OK ||
      smallappLogin.code === RESPONSE_CODE.NEW_USER
    ) {
      if (smallappLogin.token) {
        wx.setStorageSync("token", smallappLogin.token);
        app.data.token = smallappLogin.token;
      }
      cb && cb();
    } else {
      console.log(
        `登录失败, code is ${smallappLogin.code}, errcode is ${
          smallappLogin.errcode
          }, errMsg is ${smallappLogin.errMsg}`
      );
    }
  } catch (err) {
    console.log("wx.login code获取失败");
    console.log(err);
  }
}


export  function graphql({app, query, header = {}, variables}): Promise<any> {
  return new Promise((resolve, reject) => {
    const newHeader = Object.assign({}, header)
    if (app.data.token)
      newHeader['authorization'] = app.data.token
    wx.request({
      url: app.data.url,
      method: 'POST',
      header: newHeader,
      data: {
        query,
        variables
      },
      success: (res) => {
        const {data} = res // 小程序会把服务端的返回数据置于res.data下
        // @ts-ignore
        resolve(data.data) // graphql server返回的数据是 { data: {queryName: {}}}的格式
      },
      fail: (err) => {
        reject(err)
      }
    })
  })
}

export enum CHINESE_NUMBER {
  '一',
  '二',
  '三',
  '四',
  '五',
  '六',
  '七',
  '八',
  '九',
  '十',
  '十一',
  '十二',
  '十三'
}
export function formatCycleInfo(cycleInfo: any):Array<{
  _id:string,
  name:string, // 空 或者是  第x期
  order: number, // -1 or 1,2,3...
  status: 'alive' | 'doing' | 'expired', // alive表示活动还未开始，doing表示进行中，expired表示已结束
  leftDaysToStart: number,
  startTime: string,
  endTime: string,
  av: number
}> {
  return cycleInfo.map( (item, idx) => {
    const now = Date.now();
    return {
      _id: item._id,
      name: item.order===-1? '':`第${CHINESE_NUMBER[item.order]}期`, //只有一期时不加“第x期”
      order: item.order,
      status: isBefore(now, item.startTime) ? 'alive' :  isAfter(now, item.endTime) ?  'expired': 'doing',
      leftDaysToStart: differenceInDays(item.startTime, now), // expired时就说负值了
      startTime: item.startTime,
      endTime: item.endTime,
      av: item.availableSeats
    }
  })
}