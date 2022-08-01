import { useEffect, useState } from 'react'
import React from 'react'
import { Layout, PageBlock } from 'vtex.styleguide'
import { useFullSession } from 'vtex.session-client'
import { Combo } from '../Combo';
import axios from 'axios'
// O hook abaixo recebe via graphQL dados dos produtos da loja

export function Smart() {
  const { loading: loadingAuth, data: dataAuth } = useFullSession()
  console.log("🚀 Smart ~ file: index.tsx ~ line 11 ~ Smart ~ dataAuth", dataAuth)
  const [user, setUser] = useState<any>(undefined)
  const [jsonRecebido, setJsonRecebido] = useState([])
  const [combinations, setCombinations] = useState([])

  const getCombinations = async () => {
    try {
      const dataSession: any = dataAuth
      const cookie = dataSession?.session?.namespaces?.cookie.VtexIdclientAutCookie.value
      console.log("🚀 ~ file: index.tsx ~ line 20 ~ getCombinations ~ cookie", cookie)
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
    } catch (error) {
      setCombinations([])
    }
  }
  useEffect(() => {
    getCombinations()
  }, [dataAuth])
  //console.log('recebido', jsonRecebido);

  // async function newProducts() {
  //   var newProductsList = []
  //   const combinationReceived = await getJson()
  //   const productsReceived = await getProducts()
  //   console.log("tiago veja as combinações", combinationReceived);

  //   console.log('Tiago veja aqui: ', productsReceived);

  // }
  // newProducts()
  // newProducts().then(data => console.log('data no then', data)
  // )


  let textoExplicativo = "Abaixo estão listados alguns produtos identificados com alta correlação entre si (numero de vendas, idade do cliente, etc"
  return (
    <>
      <Layout>
        <h1>Painel de Controle para solução Smart Sell</h1>
        <PageBlock title="Analise de Product Matching" subtitle={textoExplicativo} variation="full">
          <h3>Combos mais vendidos:</h3>
          <div>
            {combinations && <Combo combinations={combinations} />}
          </div>
        </PageBlock>
      </Layout>
    </>
  )
}

