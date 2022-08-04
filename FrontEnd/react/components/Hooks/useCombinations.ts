import axios from 'axios'
import combinationsObj from './combinationsObj.js'


export const useCombinations = async (dataAuth) => {

  try {
    const dataSession: any = dataAuth
    const cookie = dataSession?.session?.namespaces?.cookie.VtexIdclientAutCookie.value
    
    
    const mock = true
    let response = {data:""}
   
    if (mock) {

      const sleep = ms => new Promise(
        resolve => setTimeout(resolve, ms)
      );
      
      await sleep(10000);
         console.log('mockedCombinationData',combinationsObj.data)
         response = combinationsObj
      } else {

         response = await axios.get('/_v/combination', {
          headers: {
            'content-type': "application/json",
            "accept": "application/json",
            VtexIdclientAutCookie: cookie
          }
        });

      }
      
      if (await response?.data) {
        return {data:response?.data,loading:false,error:false}

      } else{ 
        console.log('ErroGetCombination:',`No Combination Found.`)
        return {data:"No Combination Found",loading:false,error:true}

      }

    } catch (e) {

      console.log({  e  })
        }
      }