import React, { FC, useEffect, useState } from 'react'
import {useProduct} from 'vtex.product-context'
import { ListOfCombinations } from './components/ShowCombinationsOnProducts/ListOfCombinations';
import { useCombinations } from './components/ShowCombinationsOnProducts/Hooks/useCombinations';
import { useFullSession } from 'vtex.session-client'
import { Layout, PageBlock, Spinner } from 'vtex.styleguide'


const ProductCombination: FC = () => {

    const productContext = useProduct()
    const [combinations, setCombinations] = useState([])
    const [loading, setLoading] = useState(true)
    

    const { loading: loadingAuth, data: dataAuth } =  useFullSession()

    const handlerGetCombination = (async() =>{
 
        const {data:combinationData,loading:loadinngCombination,error:combinationE} = await useCombinations(dataAuth,productContext.selectedItem.itemId)
         setCombinations(combinationData);
         setLoading(loadinngCombination)
  })

       useEffect(() => {
        if((!loadingAuth && loading) ){
            handlerGetCombination()
        }
      },[loadingAuth,loading])
       

      useEffect(() => {
        if(!loadingAuth && !productContext) return
          
        handlerGetCombination()

        
      },[productContext.selectedItem])
      
      if (loading || loadingAuth) {
        <Spinner color="#f71964" />    
      }
    
      if (combinations?.length > 0)       
          {
        return   <>
              <Layout>           
                <div style={{
                  padding: "1rem",
                  border: "none"
                }}>
                    <PageBlock title="" variation="full">  
                      <h1> Separamos essas combinações para você: </h1>
                    <ListOfCombinations combinations={combinations} />
                  </PageBlock>
                </div>
              </Layout>
            </>
          } 
      
      return <></>
}
export default ProductCombination