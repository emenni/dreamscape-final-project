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
  const [combinations, setCombinations] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1)
 
  const getCombinations = async () => {
    setLoading(true)
    try {
      const dataSession: any = dataAuth
      const cookie = dataSession?.session?.namespaces?.cookie.VtexIdclientAutCookie.value
      const response = await axios.get(`/_v/combination`, {
        headers: {
          'content-type': "application/json",
          "accept": "application/json",
          VtexIdclientAutCookie: cookie
        }
      });
      const items = await response?.data?.Items
      if (items) {
        setCombinations(items)
        setTotalItems(items.length)
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


  const tableRows = React.useMemo(() => {
		const lastIndex = currentPage * rowsPerPage;
    const firstIndex = lastIndex - rowsPerPage;

    return combinations.slice(firstIndex, lastIndex);
	}, [currentPage, rowsPerPage, combinations]);


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
                    <Combo
                        combinations={tableRows}
                        currentItemFrom={(rowsPerPage * currentPage) - rowsPerPage}
                        currentItemTo={rowsPerPage * currentPage}
                        setRowsPerPage={setRowsPerPage}
                        totalItems={totalItems}
                        setCurrentPage={setCurrentPage}
                        currentPage={currentPage}
                        handleCombinationsChange={setCombinations}
                        combinationsToSearch={[]}
                    />
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
