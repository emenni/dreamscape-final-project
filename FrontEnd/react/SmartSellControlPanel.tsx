import { useEffect, useState } from 'react'
import React from 'react'
import { Layout, PageBlock } from 'vtex.styleguide'
import { Combo } from './Combo';



function Smart() {
  const [jsonRecebido, setJsonRecebido] = useState([])

  const getJson = () => {
    const input = require('./combos.json');
    setJsonRecebido(input.combos)
  }
  useEffect(() => {
    getJson()
  }, [])
  console.log('recebido', jsonRecebido);


  let textoExplicativo = "Abaixo estão listados alguns produtos identificados com alta correlação entre si (numero de vendas, idade do cliente, etc"
  return (
    <>
      <Layout>
        <h1>Painel de Controle para solução Smart Sell</h1>
        <PageBlock title="Analise de Product Matching" subtitle={textoExplicativo} variation="full">
          <h3>Combos mais vendidos:</h3>
          <div>
            {jsonRecebido.length === 0 && <p>Carregando...</p>}
            {jsonRecebido.length > 0 && jsonRecebido.map((combos) => <Combo key={combos.combinationId} combos={combos} />)
            }
          </div>
        </PageBlock>
      </Layout>
    </>
  )
}

export default Smart