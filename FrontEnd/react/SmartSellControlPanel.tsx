import { FC, useEffect, useState } from 'react'
import React from 'react'
import { Layout, PageBlock, Spinner, Pagination } from 'vtex.styleguide'
import { useFullSession } from 'vtex.session-client'
import { Combo } from './components/Combo';
import axios from 'axios'
// O hook abaixo recebe via graphQL dados dos produtos da loja

const SmartSellControlPanel: FC = () => {
  const { loading: loadingAuth, data: dataAuth } = useFullSession()
  const [loading, setLoading] = useState(true)
  const [combinations, setCombinations] = useState([])
  const [nextIndex, setNextIndex] = useState([])
  const [prevIndex, setPrevIndex] = useState('')

  const getCombinations = async (pageSize = 10, index = '') => {
    setLoading(true)
    try {
      const dataSession: any = dataAuth
      const cookie = dataSession?.session?.namespaces?.cookie.VtexIdclientAutCookie.value
      const response = await axios.get(`/_v/combination?pageSize=${pageSize}&index=${index}`, {
        headers: {
          'content-type': "application/json",
          "accept": "application/json",
          VtexIdclientAutCookie: cookie
        }
      });
      const items = await response?.data?.Items
      if (items) {
        setCombinations(items)
        setNextIndex(JSON.stringify(response?.data?.LastEvaluatedKey))
        setLoading(false)
      }
    } catch (error) {
      setCombinations([])
      setLoading(false)
    }
  }
  useEffect(() => {
    if (!loadingAuth) {
      getCombinations()
      setLoading(false)
    }
  }, [dataAuth,loadingAuth])




  let textoExplicativo = "Abaixo estão listados alguns produtos identificados com alta correlação entre si (numero de vendas, idade do cliente, etc"
  return (
    <>
      <Layout>
        <h1>Painel de Controle para solução Smart Sell</h1>
        <PageBlock title="Analise de Product Matching" subtitle={textoExplicativo} variation="full">
          {(loading || loadingAuth) ? (
            <Spinner color="#f71964" />
          ) : (
            <>
              <h3>Combos mais vendidos:</h3>
              <div>
                {combinations && (
                  <>
                    <Combo combinations={combinations} />
                    <div>
                      <button
                        onClick={() => {
                          prevIndex.pop();
                          setPrevIndex(prevIndex)
                          getCombinations(10, prevIndex[prevIndex.length - 1] ?? '')
                        }}
                        disabled={prevIndex.length > 0 ? false : true}
                      >
                        {'<'}
                      </button> 
                      <button
                        onClick={() => {
                          if (prevIndex[prevIndex.length - 1] === nextIndex) {
                            setPrevIndex((prevState: any) => [...prevState, nextIndex])
                          }
                          getCombinations(10, nextIndex)
                        }}
                      >
                        {'>'}
                      </button>    
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </PageBlock>
      </Layout>
    </>
  )
}

export default SmartSellControlPanel
