import axios from 'axios'
import combinationsObj from './combinationsObj.js'

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
   
    if (mock) {

      const sleep = ms => new Promise(
        resolve => setTimeout(resolve, ms)
      );
      
      await sleep(100);
         console.log('mockedCombinationData',combinationsObj.data)
         response = combinationsObj
         
      } else {

      response = await axios.get('/_v/combination', {
        headers: {
          'content-type': "application/json",
          "accept": "application/json",
          VtexIdclientAutCookie: cookie
        }
      })
    }
    
     let foundCombinations 

      if (response) {

        if(sku){
            
          response = await axios.get(`/_v/combination`, {
            headers: {
              'content-type': "application/json",
              "accept": "application/json",
              VtexIdclientAutCookie: cookie
            },params:{ 
              skuId:sku,
              ocurrences:1,
              isActive:true
            }
          })

          response.data.Items = foundCombinations
          
        }
  
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