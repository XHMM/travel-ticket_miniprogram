import {isBefore, differenceInDays, closestIndexTo, isAfter} from "date-fns";

import {graphql, login, clone} from "../../utils/helper";

import {requestBeauties} from "../../utils/requests";

const app = getApp<any>();
const LIMIT = 8;
Page({
  data: {
    firstLoad: true,
    loading: true, // 仅第一次加载时控制UI

    currentPos:1,
    status: "hasAlive", // hasAlive 和 noAlive
    hasAliveBeauties: [],
    noAliveBeauties: [],

    hasAliveTotal:0,
    noAliveTotal:0,
    // 下面三个字段暂未在UI内用到，因为目前还没有分页
    hasNext: false,
    page:0,

  },
  async onLoad() {
   await login(app, async ()=>{
      this.setData({
        firstLoad: false
      });
      await loadBeautiesAndSetData({
        page:0,
        app,
        pageThis:this,
        type: 'hasAlive'
      });
      this.setData({
       loading: false
     });
    })
  },
  async onShow() {
    if (this.data.firstLoad) return;
    await loadBeautiesAndSetData({
      page:0,
      app,
      pageThis:this,
      type: 'hasAlive'
    });
  },
  toggleStatus() {
    this.setData({
      status: this.data.status === "hasAlive" ? "noAlive" : "hasAlive"
    }, async () => {
      await loadBeautiesAndSetData({
        page:0,
        app,
        pageThis:this,
        type: this.data.status,
      });
      this.setData({
        currentPos:1
      })
    });

  },
  onSwipe(ev) {
    const {current, source} = ev.detail;
    this.setData({
      currentPos: current+1
    })
  }
});

interface ILoadBeautiesParam {
  page: number,
  type:'hasAlive'|'noAlive',
  pageThis: any,
  app: any
}
async function loadBeautiesAndSetData({page,type,pageThis,app}:ILoadBeautiesParam) {
  try {
    wx.showNavigationBarLoading({});
    const {beauties,hasNext, total}  = await requestBeauties(app, {
      offset: page*LIMIT,
      limit: LIMIT,
      type
    });
    const sortedBeauties = sortBeauties(beauties);
    pageThis.setData({
      hasNext,
      [type+'Total']: total
    });
    if(type === 'hasAlive') {
      pageThis.setData({
        hasAliveBeauties: sortedBeauties,
      });
    }
    if(type === 'noAlive') {
      pageThis.setData({
        noAliveBeauties: sortedBeauties,
      });
    }
  } catch (e) {
    console.log(e);
    wx.showToast({
      icon: "none",
      title: "[CATCH]列表获取出错"
    });
  } finally {
    wx.hideNavigationBarLoading({});
  }
}
function sortBeauties(beauties) {
  const now = new Date();
  const beautiesClone = clone(beauties);
  // 按照 距离当日日期由近到远的顺序排序
  beautiesClone.sort((a, b) => {
    const afterTodayStartTimes_a = a.cycleInfo.filter(item=>{
      return isBefore(now, item.startTime)
    }).map(item => item.startTime);
    const afterTodayStartTimes_b = b.cycleInfo.filter(item=>{
      return isBefore(now, item.startTime)
    }).map(item => item.startTime);

    const closestIdx_a = closestIndexTo(now, afterTodayStartTimes_a);
    const closestIdx_b = closestIndexTo(now, afterTodayStartTimes_b);
    return  isAfter(afterTodayStartTimes_b[closestIdx_b] , afterTodayStartTimes_a[closestIdx_a]) ? -1: 1;
  });
  return beautiesClone
}
