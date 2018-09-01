export type Maybe<T> = T | null;

/** 创建景点时所需参数 */
export interface CreateBeautyInput {
  name: string;
  /** 上车地点 */
  getOnPlaces: string[];

  location: CreateBeautyLocationInput;

  price: CreateTicketPriceInput;

  startLocation: string;

  endLocation: string;
  /** 活动时间，多个表示有很多期，第一期第二期 */
  time: CreateTimeInput[];

  seats: number;

  articleUrl: string;
}

export interface CreateBeautyLocationInput {
  firstLevel: string;

  secondLevel?: Maybe<string>;
}

export interface CreateTicketPriceInput {
  student: number;

  adult: number;
}

export interface CreateTimeInput {
  start: string;

  end: string;
}
/** 更新景点时传入的payload */
export interface UpdateBeautyInput {
  name?: Maybe<string>;
  /** 上车地点 */
  getOnPlaces?: Maybe<string[]>;

  location?: Maybe<UpdateBeautyLocationInput>;

  price?: Maybe<UpdateTicketPriceInput>;

  startLocation?: Maybe<string>;

  endLocation?: Maybe<string>;
  /** 活动时间，多个表示有很多期，第一期第二期 */
  time?: Maybe<UpdateTimeInput[]>;

  seats?: Maybe<number>;

  articleUrl?: Maybe<string>;
}

export interface UpdateBeautyLocationInput {
  firstLevel?: Maybe<string>;

  secondLevel?: Maybe<string>;
}

export interface UpdateTicketPriceInput {
  student?: Maybe<number>;

  adult?: Maybe<number>;
}

export interface UpdateTimeInput {
  start?: Maybe<string>;

  end?: Maybe<string>;
}

export interface FormInput {
  userName: string;

  tel: string;

  idCard: string;

  getOnPlace: string;
}

export enum ImagePrefix {
  Index = "index",
  Detail = "detail",
  Qr = "qr",
  Bonus = "bonus"
}

export enum CacheControlScope {
  Public = "PUBLIC",
  Private = "PRIVATE"
}

/** The `Upload` scalar type represents a file upload. */
export type Upload = any;

// ====================================================
// Scalars
// ====================================================

// ====================================================
// Types
// ====================================================

export interface Query {
  /** 根据id或者name查询景点信息 */
  beauty?: Maybe<Beauty>;

  beauties: (Maybe<Beauty>)[];
  /** 获取token包含的userid下的单个订单 */
  order?: Maybe<Order>;
  /** 获取token包含的userid下的多个订单 */
  orders: (Maybe<Order>)[];

  aggregatedProvinces: (Maybe<WentProvinces>)[];
  /** 检测header[authentication]的token是否还有效 */
  checkInfo?: Maybe<CheckInfoResponse>;
}

/** 景点信息，没有给字段加!的原因是考虑验证不通过时返回的是{} */
export interface Beauty {
  id?: Maybe<string>;

  name?: Maybe<string>;
  /** 上车地点 */
  getOnPlaces?: Maybe<string[]>;
  /** 活动所在地 */
  location?: Maybe<BeautyLocation>;

  price?: Maybe<TicketPrice>;

  startLocation?: Maybe<string>;

  endLocation?: Maybe<string>;
  /** 每一期的信息 */
  cycleInfo?: Maybe<CycleInfo[]>;
  /** 总座位数 */
  seats?: Maybe<number>;

  images?: Maybe<Images>;
  /** 微信文章链接 */
  articleUrl?: Maybe<string>;
}

export interface BeautyLocation {
  firstLevel: string;

  secondLevel?: Maybe<string>;
}

/** 学生价格，成人价格 */
export interface TicketPrice {
  student: number;

  adult: number;
}

/** 每一期的信息 */
export interface CycleInfo {
  id?: Maybe<string>;
  /** 剩余座位数 */
  availableSeats?: Maybe<number>;

  startTime?: Maybe<string>;

  endTime?: Maybe<string>;
}

/** 图片cdn地址 */
export interface Images {
  indexUrl: string;

  detailUrls: string[];

  bonusUrl?: Maybe<string>;

  qrUrl: string;
}

export interface Order {
  /** objectId */
  id?: Maybe<string>;

  payTime?: Maybe<string>;

  beauty?: Maybe<Beauty>;
  /** objectId 购买的是哪一期 */
  beautyCycleId?: Maybe<string>;

  forms?: Maybe<(Maybe<Form>)[]>;
}

export interface Form {
  userName?: Maybe<string>;

  tel?: Maybe<string>;

  idCard?: Maybe<string>;

  getOnPlace?: Maybe<string>;
}

export interface WentProvinces {
  name?: Maybe<string>;
  /** 去的次数 */
  value?: Maybe<number>;
}

export interface CheckInfoResponse {
  tokenValid: boolean;

  identity?: Maybe<number>;
}

export interface Mutation {
  createBeauty: CreateBeautyResponse;

  deleteBeauty: DeleteBeautyResponse;

  updateBeauty: UpdateBeautyResponse;
  /** 单图上传 */
  uploadAndSaveImageToBeauty: UploadAndSaveImageResponse;
  /** 多图上传 */
  uploadAndSaveImagesToBeauty: UploadAndSaveImagesResponse;
  /** 设置/取消该订单的差价支付 */
  updateOrderPayDiff: UpdateOrderResponse;
  /** 获取小程序requestPayment所需参数，count为购买数量 */
  pay: PayResponse;
  /** 创建order并存入db，但此时表单信息还未存入，须调用createOrderForms接口 */
  paid: PaidResponse;
  /** 用户取消支付时请求该接口 */
  cancelPay: CancelPayResponse;
  /** pay接口调用成功后再调用此接口，表示存入购买时填写的表单数据 */
  createOrderForms: CreateOrderFormsResponse;
  /** 提供小程序里的code进行登录 */
  smallappLogin?: Maybe<SmallappLoginResponse>;
  /** 后台管理登录接口 */
  backendLogin?: Maybe<BackendLoginResponse>;
}

export interface CreateBeautyResponse {
  /** 景点ObjectId.toString() */
  id?: Maybe<string>;
  /** 操作响应值，1成功，其它失败 */
  code: number;
  /** 图片存放父目录，值为 景点名-2012-12-2 ，前后无slash */
  path?: Maybe<string>;
  /** 附加消息 */
  msg?: Maybe<string>;
}

export interface DeleteBeautyResponse {
  /** 景点ObjectId.toString() */
  id?: Maybe<string>;
  /** 操作响应值，1成功，其它失败 */
  code: number;

  msg?: Maybe<string>;
}

export interface UpdateBeautyResponse {
  /** 操作响应值，1成功，2表示未更新(目前实现是仅判断payload是否有键值)，其它为失败 */
  code: number;

  beauty?: Maybe<Beauty>;

  msg?: Maybe<string>;
}

export interface UploadAndSaveImageResponse {
  /** 景点ObjectId.toString() */
  id?: Maybe<string>;
  /** 操作响应值，1成功，其它失败 */
  code: number;

  msg?: Maybe<string>;
}

export interface UploadAndSaveImagesResponse {
  code: number;

  msg?: Maybe<string>;

  data?: Maybe<(Maybe<UploadAndSaveImageResponse>)[]>;
}

export interface UpdateOrderResponse {
  code: number;

  msg?: Maybe<string>;
}

export interface PayResponse {
  code: number;

  msg?: Maybe<string>;

  timeStamp?: Maybe<number>;

  nonceStr?: Maybe<string>;

  prepayId?: Maybe<string>;

  signType?: Maybe<string>;

  paySign?: Maybe<string>;
  /** 商户订单号，用于传给paid */
  outTradeNo?: Maybe<string>;
}

export interface PaidResponse {
  code: number;

  qrUrl?: Maybe<string>;

  orderId?: Maybe<string>;

  payTime?: Maybe<string>;

  msg?: Maybe<string>;
}

export interface CancelPayResponse {
  code: number;

  msg?: Maybe<string>;
}

export interface CreateOrderFormsResponse {
  code: number;

  msg?: Maybe<string>;
}

export interface SmallappLoginResponse {
  /** 1是ok，2是new user，其它值为错误 */
  code: number;

  token?: Maybe<string>;
  /** 可能含有错误信息 */
  msg?: Maybe<string>;
  /** 微信接口获取openid的返回errcode，errcode不为0时会返回该字段 */
  errcode?: Maybe<number>;
  /** 微信接口获取openid的返回errmsg，errcode不为0时会返回该字段 */
  errmsg?: Maybe<string>;
}

export interface BackendLoginResponse {
  /** 1是ok，2是new user，其它值为错误 */
  code: number;

  token?: Maybe<string>;
  /** 可能含有错误信息 */
  msg?: Maybe<string>;
}

/** 活动开始结束时间 */
export interface Time {
  start: string;

  end: string;
}

export interface User {
  /** objectId */
  id?: Maybe<string>;

  openid?: Maybe<string>;

  orders?: Maybe<(Maybe<Order>)[]>;

  firstLoginTime?: Maybe<string>;

  lastLoginTime?: Maybe<string>;

  identity?: Maybe<number>;
  /** 区别于微信openid的个人账号 */
  account?: Maybe<string>;
}

// ====================================================
// Arguments
// ====================================================

export interface BeautyQueryArgs {
  id?: Maybe<string>;

  name?: Maybe<string>;
}
export interface BeautiesQueryArgs {
  /** 传入小于0的值则按0算 */
  offset?: Maybe<number>;
  /** 传入小于等于0的值则按1算 */
  limit?: number;
}
export interface OrderQueryArgs {
  id: string;
}
export interface OrdersQueryArgs {
  offset?: Maybe<number>;

  limit?: number;
}
export interface CreateBeautyMutationArgs {
  beauty: CreateBeautyInput;
}
export interface DeleteBeautyMutationArgs {
  id: string;
}
export interface UpdateBeautyMutationArgs {
  id: string;

  payload: UpdateBeautyInput;
}
export interface UploadAndSaveImageToBeautyMutationArgs {
  image: Upload;
  /** 存放图片的父目录，由createBeauty提供 */
  path: string;

  prefix: ImagePrefix;
  /** 对应景点信息的ObjectId，用以将图片url存入 */
  beautyId: string;
}
export interface UploadAndSaveImagesToBeautyMutationArgs {
  images: Upload[];

  path: string;

  prefix: ImagePrefix;

  beautyId: string;
}
export interface UpdateOrderPayDiffMutationArgs {
  orderId: string;

  payDiff: boolean;
}
export interface PayMutationArgs {
  beautyId: string;

  count: number;
}
export interface PaidMutationArgs {
  beautyId: string;

  outTradeNo: string;
}
export interface CancelPayMutationArgs {
  beautyId: string;

  count: number;
}
export interface CreateOrderFormsMutationArgs {
  orderId: string;

  beautyCycleId: string;

  forms: (Maybe<FormInput>)[];
}
export interface SmallappLoginMutationArgs {
  code: string;
}
export interface BackendLoginMutationArgs {
  account: string;

  pwd: string;
}
