import axios from 'axios'

export const useCombinations = async (dataAuth,sku?:string) => {
  
  try {

    const dataSession: any = dataAuth
    const cookie = dataSession?.session?.namespaces?.cookie.VtexIdclientAutCookie.value

    const mock = false

    interface CombinationsResponse {
      combination:string;
  }

    interface CombinationsResponseItems {
      Items:CombinationsResponse[];
  }

    interface CombinationsResponseObj {
      data:CombinationsResponseItems;
  }

    let response = <CombinationsResponseObj>{data:{Items:[{combination:""}]}}
   
        if(sku){
          response = await axios.get(`/_v/combination`, {
            headers: {
              'content-type': "application/json",
              "accept": "application/json",
              VtexIdclientAutCookie: cookie
            },params:{ 
              skuId:sku,
             //CombinationsResponseObj>/ occurrencesMoreThan:1,
              isActive:true
            }
          })

       } else {
          response = await axios.get('/_v/combination', {
            headers: {
              'content-type': "application/json",
              "accept": "application/json",
              VtexIdclientAutCookie: cookie
            }
          })
        }
    

    if (response) {
  
      response.data.Items.forEach((combinationObj) => {
        combinationObj['combinationDetails'] = []
        combinationObj.combination.split(",")?.forEach((value) => {
        combinationObj['combinationDetails'].push({  sku: value })
        } ) 
      })
        return {data: response.data.Items ,loading:false,error:false}

      } else{ 
        console.log('ErroGetCombination:',`No Combination Found.`)
        return {data:[],loading:false,error:true}
       }

    } catch (e) {

      console.log({  e  })
        }
}