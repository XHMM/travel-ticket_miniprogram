import * as echarts from '../../../libs/ec-canvas/echarts';
import chinaMap from '../../../maps/china'
import {graphql }from "../../../utils/helper";
import {PROVINCES} from "../../../utils/gqls";

const app = getApp();
const loadingSentences = [
  "这样的旅行也是我的梦",
  "旅行，总让人有一种恍如隔世，行走在天堂的感觉",
  "旅行是为了离开，旅行是对庸常生活的一次越狱",
  "只要你行走，就能与你生命中的真相相遇",
  "如果不出去走走，你或许以为这就是世界",
  "我们终将会牵手旅行，凤凰稻城或是巴黎",
  "每天都是一次新的旅行，每一个和我们走过一段的人都值得感激",
  "世界那么大，我想去看看",
  "说走就走，是人生最华美的奢侈，也是最灿烂的自由",
  "旅行是消除无知和仇恨的最好方法",
  "旅行的真谛，不是运动，而是带动你的灵魂，去寻找到生命的春光",
  "人生最好的旅行，就是你在一个陌生的地方，发现一种久违的感动",
  "路上，不为旅行，不因某人，只为在未知的途中遇见未知的自己",
  "没有旅行的生活，只能称之为生存",
  "背起行囊走四方，不为天宽，不为地广，只为见见风吹草低见牛羊",
  "做一个世界的水手，游遍每一个港口",
  "你终于明白，原来旅行的意义，是遇见一些人，再与他们告别",
  "生命是场旅行，生活是种态度",
  "在旅行中修行",
  "据说每个人心里、都有一只想旅行的小魔鬼",
  "每个人心中，都会有一个古镇情怀，流水江南，烟笼人家",
  "背上背包，明天就出发吧",
  "人生至少要有两次冲动，一为奋不顾身的爱情，一为说走就走的旅行",
]

Page({
  data: {
    sentence:"",
    ec: {
      lazyLoad: true
    },
    chartLoading:true
  },
  async onLoad() {
    this.setData({
      sentence:loadingSentences[Math.floor(Math.random()*loadingSentences.length)]
    })
  },
  async onReady() {
    const footmap = this.selectComponent('#footmap')
    this.footmap = footmap;
   wx.showLoading({
      title:"读取足迹中...",
      mask: true
    })
    const {aggregatedProvinces} = await graphql({
      app,
      variables:{},
      query: PROVINCES
    });
    wx.hideLoading({})
    this.setData({
      chartLoading:false
    },()=>{
      footmap.init((canvas, width, height) => {
        const chart = echarts.init(canvas, null, {
          width: width,
          height: height
        });
        canvas.setChart(chart);
        echarts.registerMap('china', chinaMap);
        const option = {
          title:{
            textStyle:{
              fontSize:14
            },
            text:"历史足迹",
            bottom:30,
            left:30
          },
          tooltip: {
            trigger: 'item',
            formatter:({name, value})=>{
              if(name) return `去过${value}次${name}`
              else return "未曾探索"
            }
          },
          visualMap: {
            show:false,
            min: 0,
            max: 20
          },
          series: [{
            type: 'map',
            map: 'china',
            itemStyle: {
              borderWidth: 0,
              emphasis: {
                areaColor: '#87CEFA'
              }
            },
            data: aggregatedProvinces,
            label: {
              normal: {
                show: false
              },
              emphasis: {
                show: false
              }
            }
          }]

        };
        chart.setOption(option);
        return chart;
      })
    })
  }
});