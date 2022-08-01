import React, { FC } from 'react'
import { Layout, PageBlock } from 'vtex.styleguide'

const SmartSellControlPanel: FC = () => {
  
  let textoExplicativo = "Abaixo estão listados alguns produtos identificados com alta correlação entre si (numero de vendas, idade do cliente, etc"
  
  return (
    <>
    <Layout>
      <h1>Painel de Controle para solução Smart Sell</h1>
      <PageBlock title="Analise de Product Matching" subtitle={textoExplicativo} variation="full">
      </PageBlock>
    </Layout>
  </>
  )  
}

export default SmartSellControlPanel

