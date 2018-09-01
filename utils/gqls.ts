export const LOGIN = `
mutation SmallappLogin($code:String!){
 smallappLogin(code:$code) {
    code
    token
    msg
    errcode
    errmsg
  }
}    
`;

export const PAY = `
mutation Pay($beautyId:String!,$beautyCycleOrder:Int! , $count:Int!){
  pay(beautyId:$beautyId, beautyCycleOrder:$beautyCycleOrder, count:$count) {
    code
    msg
    
    timeStamp
    nonceStr
    prepayId
    signType
    paySign

    outTradeNo
  }
}
`;
export const CANCEL_PAY = `
mutation CancelPay($beautyId:String!, $count:Int!,$beautyCycleOrder:Int!){
  cancelPay(beautyId:$beautyId, count:$count, beautyCycleOrder: $beautyCycleOrder){
    code
    msg
  }
}
`;
export const PAID = `
mutation Paid($beautyId: String!, $beautyCycleOrder:Int!, $outTradeNo:String!, $forms:[FormInput]!){
  paid(beautyId:$beautyId, beautyCycleOrder: $beautyCycleOrder, outTradeNo:$outTradeNo, forms:$forms){
    code
    qrUrl
    orderId
    payTime
    payFee
    msg
  }
}
`;

const beauty = ` {
    _id
    name
    price{
      student
      adult
    }
    location {
      firstLevel
      secondLevel
    }
    getOnPlaces
    startLocation
    endLocation
    cycleInfo {
      _id
      order
      availableSeats
      startTime
      endTime
    }
    articleUrl
    seats
    images{
      indexUrl
      detailUrls
      qrUrl
    }
 }`
export const BEAUTY = `
query Beauty($_id:String!) {
  beauty(_id:$_id) ${beauty}
}
`;
export const BEAUTIES =  `
query Beauties($offset:Int, $limit:Int, $type: BEAUTY_TYPE) {
  beauties(offset:$offset,limit:$limit, type:$type){
    hasNext
    total
    beauties ${beauty}
  }
}
`;
export const ORDERS = `
query Orders($offset:Int!, $limit:Int!){
  orders(offset:$offset, limit:$limit) {
    hasNext
    total
    orders{
      _id
      payTime
      payFee
      beautyCycleOrder
      forms {
        userName
        tel
        idCard
        getOnPlace
      }
      beauty{
        _id
        name
        price {
          student
          adult
        }
        location{
          firstLevel
          secondLevel
        }
        cycleInfo {
          _id
          startTime
          endTime
          order  
        }
        images{
          indexUrl
          qrUrl
        }
      } 
    }
    
  }
}

`;

export const PROVINCES  = `{
  aggregatedProvinces {
    name
    value
  }
}
`;