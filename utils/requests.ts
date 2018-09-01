import {graphql} from "./helper";
import {BEAUTIES, BEAUTY} from "./gqls";
import {Beauty} from "../typings/graphql-client";


// 注：gql里并不是所有参数都包括了，所以还请注意着使用！

export const requestBeauty = async (app:any, variables:any):Promise<Beauty> => {
  const res = await graphql({
    app,
    variables,
    query: BEAUTY
  });
  return res.beauty
}

export const requestBeauties = async (app:any, variables:any):Promise<{hasNext:boolean, total:number, beauties: Beauty[]} > => {
  const {beauties} = await graphql({
    app,
    variables,
    query: BEAUTIES
  });
  return {
    hasNext: beauties.hasNext,
    total: beauties.total,
    beauties: beauties.beauties
  }

}

export const requestAVSeats = async (app:any, variables:any, cycleId: string):Promise<number> => {
  const {beauty} = await graphql({
    app,
    variables,
    query: BEAUTY
  });
  const targetCycle = beauty.cycleInfo.find(item => item._id === cycleId);
  return targetCycle.availableSeats;
}