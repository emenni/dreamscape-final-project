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

    interface CombinationsResponseObj {
      data:CombinationsResponse[];
  }

    let response: CombinationsResponseObj = {data:[{combination:""}]}
   
    if (mock) {

      const sleep = ms => new Promise(
        resolve => setTimeout(resolve, ms)
      );
      
      await sleep(1000);
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
             foundCombinations = response.data.filter(record => {
              const regex  = "^(" + sku + ",)|(," + sku + ",)|(," + sku + ")$|^(" + sku + ")$"
              const regexp = new RegExp(regex,'gm');
              return  record.combination.match(regexp)
          });
        }
        
        return {data: sku ? foundCombinations : response.data ,loading:false,error:false}

      } else{ 
        console.log('ErroGetCombination:',`No Combination Found.`)
        return {data:"No Combination Found",loading:false,error:true}

       }

    } catch (e) {

      console.log({  e  })
        }
      }