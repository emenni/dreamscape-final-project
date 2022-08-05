import React, { FC, useEffect, useState } from 'react'
import {useProduct} from 'vtex.product-context'
import { ComboInProductDetail } from './components/showInProductDetail/Combo';
import { useCombinations } from './components/Hooks/useCombinations';
import { useFullSession } from 'vtex.session-client'
import { Layout, PageBlock, Spinner } from 'vtex.styleguide'



const ProductCombination: FC = () => {

    console.log('Renderizou')

    const productContext = useProduct()
    const [combinations, setCombinations] = useState([])
    const [loading, setLoading] = useState(true)

    const { loading: loadingAuth, data: dataAuth } =  useFullSession()


    const handlerGetCombination = (async() =>{
 
        const {data:combinationData,loading:loadinngCombination,error:combinationE} = await useCombinations(dataAuth,productContext.selectedItem.itemId)
         setCombinations(combinationData);
         setLoading(loadinngCombination)
         
       })
    

    //console.log('ProductContextSelectedItem',productContext.selectedItem)

       // useEffect(() => {

    // if (!productContext) return 

    // }, [productContext.selectedItem])

       useEffect(() => {
        if(!loadingAuth && loading ){

            handlerGetCombination()
        }

      },[loadingAuth])

        
    if (loading || loadingAuth) {
        return (
          <Spinner color="#f71964" />
        )
      }   
     return (
        <>
          <Layout>           
           <h1>Ola $NomeCliente|Null. Será que estas combinações te animam ? Olha o que preparamos pra você! </h1>
              <div>
                {combinations ? (
                  <>
                    {combinations?.length > 0 && (
                      <ComboInProductDetail combinations={combinations} />
                    )}
                  </>
                ) : (
                  <Spinner color="#f71964" />
                )}
              </div>
          </Layout>
        </>
      )
    


//const skuItems = `${productContext.product.items.map(item => item.itemId)}`
//return (<>{skuItems + '->' + productContext.selectedItem.itemId }</>)


}


export default ProductCombination
