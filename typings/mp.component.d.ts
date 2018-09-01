// 由于官方没有Component的组件声明，先自己从以前的repo里截取过来用下
interface Component {
  properties?: any;
  data?: any;
  methods?: any;
  behaviors?: any;
  created?: () => void;
  attached?: () => void;
  ready?: () => void;
  moved?: () => void;
  detached?: () => void;
  relations?: any;
  externalClasses?: any;
  options?: any;
  lifetimes?:any;
  pageLifetimes?:any;
  definitionFilter?: (defFields?:any,definitionFilterArr?:any[])=>void;
}

declare function Component(component: Component): void;