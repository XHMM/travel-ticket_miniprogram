
import {graphql} from "../../utils/helper";
import {clone} from "../../utils/helper";
import {RESPONSE_CODE} from "../../utils/constants";
import {CANCEL_PAY, PAY, PAID} from "../../utils/gqls";

function genId() {
  return 'i'+ new Date().getTime()+'' // scroll-into-view id不能以数字开头
}

const initialId = genId();
const app = getApp()

Page({
  data : {
    helpOpen: false,
    toInputs: initialId, // scroll-view

    // onLoad中获取
    beautyId: "",
    cycleOrder:-2, // 期数
    cycleName:"", // 第几期汉字，用于页面显示
    indexUrl: "",
    price: 9999, // 默认就是学生价格
    name: "", // 景点名
    getOnPlaces:[], // 上车地点

    // 表单内容
    forms:[
      {
        id: initialId,
        'name':'',
        'tel':'',
        'idcard':'',
        'getonplacestatus':"select", // select表示选择预置上车地点，input表示自行填写
        'getonplaceinput':"", // input值
        'getonplaceselect':0, // select索引，传给后台时传具体值！
      }
    ],

    qrUrl: "", // 用于页面显示
    hasBought: false, // 用于页面控制
    orderId: "", // 用于页面显示

    payTime: "", // 用于后续请求
  },
  async onLoad(options) {
    // 若访问量大，此处应考虑实现进入此页面后，提示请在10分钟内完成，10分钟后解除avSeats！
    const { beautyId, indexUrl, price, name, cycleOrder, getOnPlaces, cycleName} = options;
    wx.setNavigationBarTitle({title: "整装待发"})
    this.setData({
      beautyId,
      cycleOrder: +cycleOrder,
      indexUrl,
      price,
      name,
      cycleName,
      getOnPlaces: decodeURIComponent(getOnPlaces).split(',')
    });
  },
  toggleHelp(e) {
    this.setData({
      helpOpen: !this.data.helpOpen
    })
  },
  closeHelp() {
    this.setData({
      helpOpen: false
    })
  },
  // 新增表单输入项
  addInputs() {
    const curForms = this.data.forms
    const emptyIndex = curForms.findIndex((item,idx)=> {
      return item.name.trim() === '' || item.tel.trim() === '' || item.idcard.trim() === '' ||  (item.getonplacestatus === 'input' && item.getonplaceinput.trim() === '' )
    })
    if(emptyIndex !== -1) {
      wx.showToast({
        icon:"none",
        title:"请补全当前内容"
      })
      this.setData({
        toInputs: curForms[emptyIndex].id
      })
      return;
    }

    const newForm = {id: genId(), name:'',tel:'',idcard:'', getonplaceinput: '', getonplacestatus: 'select',getonplaceselect:0}
    this.setData({
      forms: [...this.data.forms, newForm],
      toInputs: newForm.id
    })
  },
  removeInputs(e) {
    const id = e.currentTarget.dataset.id;
    const _forms  = clone(this.data.forms).filter(item=>{
      return item.id !==id
    })
    this.setData({
      forms: _forms
    })
  },
  // 已trim
  onInput(e) {
    const {id, name} = e.currentTarget.dataset;
    const _forms = clone(this.data.forms);
    const _formIdx = _forms.findIndex(item=> item.id === id);
    _forms[_formIdx][name] = e.detail.value.trim() // 字数限制在input组件的maxlength中
    this.setData({
      forms: _forms
    })
  },
  onGetOnPlacePickerChange(e) {
    const {id} = e.currentTarget.dataset;
    const formsClone = clone(this.data.forms);
    const targetIdx = formsClone.findIndex(item=> item.id === id);
    formsClone[targetIdx].getonplaceselect = +e.detail.value;
    this.setData({
      forms: formsClone
    })
  },
  toggleGetOnPlaceStatus(e) {
    const {id} = e.currentTarget.dataset;
    const formsClone = clone(this.data.forms);
    const targetIdx = formsClone.findIndex(item=> item.id === id);
    formsClone[targetIdx].getonplacestatus = formsClone[targetIdx].getonplacestatus==='select'? 'input': 'select';
    this.setData({
      forms: formsClone
    })
  },
  async submit() {
    const {forms, beautyId, getOnPlaces, cycleOrder} = this.data;
    const emptyFormIdx = forms.findIndex((item,idx)=> {
      return item.name.trim() === '' || item.tel.trim() === '' || item.idcard.trim() === '' ||  (item.getonplacestatus === 'input' && item.getonplaceinput.trim() === '' )
    })
    if(emptyFormIdx !== -1) {
      wx.showToast({
        icon:"none",
        title:"表单未填写完整"
      })
      this.setData({
        toInputs: forms[emptyFormIdx].id
      })
      return;
    }

    const invalidFormIdx = forms.findIndex((item, idx) => {
      return item.tel.length !== 11 || item.idcard.length !== 18
    })
    if(invalidFormIdx !== -1) {
      wx.showToast({
        icon:"none",
        title:"手机或身份证输入不全"
      })
      this.setData({
        toInputs: forms[invalidFormIdx].id
      })
      return;
    }
    const formattedForms = forms.map((item, idx)=>{
      return {
        userName:item.name,
        tel: item.tel,
        idCard: item.idcard,
        getOnPlace: item.getonplacestatus ==='select' ? getOnPlaces[item.getonplaceselect] : item.getonplaceinput
      }
    })
    wx.showLoading({
      mask: true,
      title: "处理中..."
    });
    try {
      const {pay} = await graphql({
        app,
        variables:{
          beautyId,
          count: forms.length,
          beautyCycleOrder: cycleOrder
        },
        query: PAY
      });
      wx.hideLoading({})
      if (pay.code === RESPONSE_CODE.OK) {
        wx.requestPayment({
          timeStamp: pay.timeStamp.toString(),
          nonceStr: pay.nonceStr,
          package: "prepay_id=" + pay.prepayId,
          signType: pay.signType,
          paySign: pay.paySign,
          // 注：支付成功后，用户必须点击关闭页面才能触发下面的回调
          success: async res => {
            wx.showLoading({
              title:"订单创建中",
              mask:true
            })
            const {paid} = await graphql(
              {
                app,
                variables:{
                  beautyId: this.data.beautyId,
                  outTradeNo: pay.outTradeNo,
                  forms: formattedForms,
                  beautyCycleOrder: cycleOrder
                },
                query:PAID
              }
            )
            wx.hideLoading({})
            if(paid.code===RESPONSE_CODE.OK) {
              wx.showToast({
                icon:'none',
                title:"支付成功"
              })
              this.setData({
                hasBought: true,
                qrUrl: paid.qrUrl,
                payTime:paid.payTime,
                payFee: paid.payFee,
                orderId:paid.orderId
              });
            }else {
              wx.showToast({
                icon:'none',
                title:`[PAID_RES NOT OK]${paid.msg}`
              })
            }
          },
          fail: async err => {
            if (err.errMsg.includes("cancel")) {
              wx.showToast({
                icon: "none",
                title: "支付取消"
              });
              try {
                await graphql({
                  app,
                  variables:{
                    beautyId,
                    count: forms.length,
                    beautyCycleOrder: cycleOrder
                  },
                  query: CANCEL_PAY
                });
              } catch (e) {
                console.log(e)
                wx.showToast({
                  icon: "none",
                  title: `[CANCELPAY_REQ CATCH]${e}`
                });
              }
            } else {
              wx.showToast({
                icon: "none",
                title: `[requestPayment fail]${err.errMsg}`
              });
            }
          }
        });
      } else {
        wx.showToast({
          icon: "none",
          title: `[PAY_RES NOT OK]${pay.msg}`
        });
      }
    } catch (e) {
      wx.hideLoading({})
      console.log(e)
    }

  },

  previewImage(ev) {
    wx.previewImage({
      urls:[ev.currentTarget.dataset.url]
    })
  }
})
