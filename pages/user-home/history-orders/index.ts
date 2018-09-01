import {graphql, formatCycleInfo, clone} from "../../../utils/helper";
import {ORDERS} from "../../../utils/gqls";
import {isBefore} from "date-fns";

const LIMIT = 30;
const app = getApp()
Page({
  data :{
    loading:true,

    status:'alive',

    aliveOrders:[],
    doingOrders:[],
    expiredOrders:[],

    page:0,
    hasNext: false
  },
  async onLoad() {
    const {orders:{orders,total, hasNext}} = await graphql({
      app,
      variables:{
        offset: this.data.page * LIMIT,
        limit: LIMIT
      },
      query: ORDERS
    })
    // 给返回的订单数据注入UI所需的一些信息
    const formattedOrders = orders.map(order => {
      // 格式化该订单对应的景点的所有期数信息
      const cycleInfo = formatCycleInfo(order.beauty.cycleInfo);
      // 找到该订单购买的是哪一期
      order.cycle = cycleInfo.find(item2 => {
        return item2.order === order.beautyCycleOrder
      });
      // item.beauty.articleUrl = encodeURIComponent(item.beauty.articleUrl);
      order.formsOpen = false;
      return order;
    })
    this.setData({
      aliveOrders: formattedOrders.filter(item => item.cycle.status === 'alive').sort((a,b) => {return isBefore(a.cycle.startTime,b.cycle.startTime) ? -1: 1}),
      doingOrders: formattedOrders.filter(item => item.cycle.status === 'doing'),
      expiredOrders: formattedOrders.filter(item => item.cycle.status === 'expired'),
      loading:false
    })
  },
  changeType(ev) {
    const {status} = ev.currentTarget.dataset
    if(status !== this.data.status) {
      this.setData({
        status
      })
    }
  },
  toggleForms(e) {
    const {id} = e.currentTarget.dataset
    const status = this.data.status
    const orders = this.data[status+'Orders'];
    const ordersClone = clone(orders);
    const idx = ordersClone.findIndex(item => {
      return item._id == id;
    })
    ordersClone[idx].formsOpen = !ordersClone[idx].formsOpen;
    this.setData({
      [status+'Orders']: ordersClone
    })
  },
  previewImage(ev) {
    wx.previewImage({
      urls:[ev.currentTarget.dataset.url]
    })
  }
})