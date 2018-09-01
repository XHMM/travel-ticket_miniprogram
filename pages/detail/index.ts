import {formatCycleInfo, login} from "../../utils/helper";
import {requestBeauty, requestAVSeats} from "../../utils/requests";

const app = getApp();
Page({
  data: {
    statusbarHeight:0,
    cycleContentMarginTop:0,

    detailShow: true,
    _id: "", // 来自首页 /xxx?_id=xx

    cycleList:[], // 该景点的所有格式化后的期数信息
    hasSelectCycle: false, // 是否选择了期数
    selectedCycle:{}, // 被选期数的信息 (已过期的也可以被选择，这样方便历史查看)

    name: "",
    location: {
      firstLevel:'',
      secondLevel:''
    },
    seats:0, // 选择期数示时用到
    startLocation:"",
    endLocation:"",
    images: {
      detailUrls: [],
      indexUrl: "" // 传给buy页面用
    },
    price: {
      student: 0,
      adult: 0
    },
    articleUrl: "",

    getOnPlaces:[] // 传给购买页面，这样购买页面不用再次请求了

  },
  async onLoad(options) {
    wx.getSystemInfo({
      success:(res)=>{
        this.setData({
          statusbarHeight: res.statusBarHeight + 8
        })
      }
    })


    wx.showLoading({
      title:"稍等, 旅行者"
    })
    let { _id, scene} = options;
    if(scene) {
      _id = decodeURIComponent(scene).split('=')[1];
      console.log('enter from scan');
      await login(app);
    }

    this.setData({ _id});
    const  beauty  = await requestBeauty(app, {_id });
    const cycleList = formatCycleInfo(beauty.cycleInfo);
    if(cycleList.length === 1) {
      this.setData({
        hasSelectCycle: true,
        selectedCycle: cycleList[0]
      })
    }
    this.setData({
      name: beauty.name,
      location: beauty.location,
      images: {
        detailUrls: beauty.images.detailUrls,
        indexUrl: beauty.images.indexUrl
      },
      price: beauty.price,
      startLocation: beauty.startLocation,
      endLocation: beauty.endLocation,
      seats: beauty.seats,
      articleUrl: encodeURIComponent(beauty.articleUrl),
      getOnPlaces: beauty.getOnPlaces,

      cycleList
    });
    wx.setNavigationBarTitle({
      title: beauty.name
    })
    wx.hideLoading({})
  },
  onReady() {
    const query = wx.createSelectorQuery();
    const $ele = query.select('#cycleTitle')
    $ele.boundingClientRect((rect)=> {
      // 这里要if判断下，因为单期数页面是没有标题节点的
      if(rect) {
        const mt = rect.top + rect.height;
        this.setData({
          cycleContentMarginTop:mt
        })
      }
    }).exec();

  },
  goBack() {
    wx.navigateBack({
      delta:1
    })
  },
  selectCycle(ev) {
    const {id: cycleId} = ev.currentTarget.dataset;
    const target = this.data.cycleList.find(item => item._id === cycleId);
    this.setData({
      hasSelectCycle: true,
      selectedCycle: target
    })
  },
  openDetail() {
    this.setData({
      detailShow: true
    });
  },
  closeDetail() {
    this.setData({
      detailShow: false
    });
  },
  async join() {
    wx.showLoading({
      title:"余位检测中...",
      mask:true
    })
    const {
      _id,
      images: { indexUrl },
      price: { student },
      name,
      selectedCycle,
      getOnPlaces
    } = this.data;
    const avSeats = await requestAVSeats(app, {_id}, selectedCycle._id);
    wx.hideLoading({})
    if (avSeats > 0) {
      wx.navigateTo({
        url: `/pages/buy/index?beautyId=${_id}&cycleOrder=${selectedCycle.order}&indexUrl=${indexUrl}&price=${student}&name=${name}&getOnPlaces=${encodeURIComponent(getOnPlaces.join(','))}&cycleName=${selectedCycle.name}`
      });
    } else {
      wx.showToast({
        icon: "none",
        title: "抱歉，没有余位了"
      });
    }
  }
});



