import { FC, useEffect, useState } from 'react'
import React from 'react'
import { Layout, PageBlock, Spinner } from 'vtex.styleguide'
import { useFullSession } from 'vtex.session-client'
import { Combo } from './components/Combo';
import axios from 'axios'
// O hook abaixo recebe via graphQL dados dos produtos da loja

const SmartSellControlPanel: FC = () => {
  const { loading: loadingAuth, data: dataAuth } = useFullSession()
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(undefined)
  const [jsonRecebido, setJsonRecebido] = useState([])
  const [combinations, setCombinations] = useState([])

  const getCombinations = async () => {
    setLoading(true)
    try {
      const dataSession: any = dataAuth
      const cookie = dataSession?.session?.namespaces?.cookie.VtexIdclientAutCookie.value
      const response = await axios.get('/_v/combination', {
        headers: {
          'content-type': "application/json",
          "accept": "application/json",
          VtexIdclientAutCookie: cookie
        }
      });
      if (await response.data?.Items) {
        setCombinations(response.data?.Items)
      }
      setLoading(false)
    } catch (error) {
      setCombinations([])
      setLoading(false)
    }
  }
  useEffect(() => {
    getCombinations()
    setLoading(false)
  }, [dataAuth])




  let textoExplicativo = "Abaixo estão listados alguns produtos identificados com alta correlação entre si (numero de vendas, idade do cliente, etc"
  if (loading) {
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
            {combinations && <Combo combinations={combinations} getCombinations={getCombinations} setLoading={setLoading} />}
          </div>
        </PageBlock>
      </Layout>
    </>
  )
}

export default SmartSellControlPanel
