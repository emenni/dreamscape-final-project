import axios from 'axios'
import combinationsObj from './combinationsObj.js'

export const useCombinations = async (dataAuth,sku?:string) => {
  
  try {

    const dataSession: any = dataAuth
    const cookie = dataSession?.session?.namespaces?.cookie.VtexIdclientAutCookie.value

    const mock = true

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

      if (await response) {

        if(sku){
             foundCombinations = response.data.Items.filter(record => {
              const regex  = "^(" + sku + ",)|(," + sku + ",)|(," + sku + ")$|^(" + sku + ")$"
              const regexp = new RegExp(regex,'gm');
              return  record.combination.match(regexp)
          });

          foundCombinations.sort((a,b) => { return a.ocurrence - b.ocurrence })
          
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