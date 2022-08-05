import { FC, useEffect, useState } from 'react'
import React from 'react'
import { Layout, PageBlock, Spinner } from 'vtex.styleguide'
import { useFullSession } from 'vtex.session-client'
import { Combo } from './components/Combo';
import  {useCombinations} from './components/Hooks/useCombinations'

//1 Renderizacao
  const SmartSellControlPanel: FC =  () => {
    
    console.log('Renderizou')
    
     const [combinations, setCombinations] = useState([])
     const [loading, setLoading] = useState(true)

//2 Renderizacao     
     const { loading: loadingAuth, data: dataAuth } =  useFullSession()
  
     const handlerGetCombination = (async() =>{
     const {data:combinationData,loading:loadinngCombination,error:combinationE} = await useCombinations(dataAuth)

//3 Renderizacao - Renderiza mais 2 vezes (4/5)

      setCombinations(combinationData);
      setLoading(loadinngCombination)
      
    })

  useEffect(() => {
    if (!loadingAuth) {
      //3 Renderizacao - Chamada para
      handlerGetCombination()
    }
  }, )
 
  let textoExplicativo = "Abaixo estão listados alguns produtos identificados com alta correlação entre si (numero de vendas, idade do cliente, etc"
   if (loading || loadingAuth) {
     return (
       <Spinner color="#f71964" />
     )
   }
  return (
    <>
      <Layout>
        <h1>Painel de Controle para solução Smart Sell</h1>
        <PageBlock title="Analise de Product Matching" subtitle={textoExplicativo} variation="full">
          <h3>Combos mais vendidos:</h3>
          <div>
            {combinations ? (
              <>
                {combinations?.length > 0 && (
                  <Combo combinations={combinations} getCombinations={handlerGetCombination} setLoading={setLoading} />
                )}
              </>
            ) : (
              <Spinner color="#f71964" />
            )}
          </div>
        </PageBlock>
      </Layout>
    </>
  )
}

export default SmartSellControlPanel
