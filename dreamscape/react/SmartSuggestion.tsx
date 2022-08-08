import { FC, useEffect, useState } from 'react'
import React from 'react'
import { Layout, PageBlock, Spinner } from 'vtex.styleguide'
import { useFullSession } from 'vtex.session-client'
import { defineMessages, useIntl } from 'react-intl'
import { Combo } from './components/Combo';
import axios from 'axios'
// O hook abaixo recebe via graphQL dados dos produtos da loja
const messages = defineMessages({
  subTitle: {
    id: 'smart-suggestion.subTitle',
  },
  title: {
    id: "smart-suggestion.title"
  },
  tableTitle: {
    id: "smart-suggestion.tableTitle"
  }
})
const SmartSuggestion: FC = () => {
  const { loading: loadingAuth, data: dataAuth } = useFullSession()
  const [loading, setLoading] = useState(true)
  const [combinations, setCombinations] = useState([])
  const [combinationsToTable, setCombinationsToTable] = useState([])
  const [totalItems, setTotalItems] = useState(0)
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1)
  const { formatMessage } = useIntl()
  const getCombinations = async () => {
    setLoading(true)
    await axios.get(`/_v/combination`)
      .then(async (response: any) => {
        const items = await response?.data?.Items
        if (items) {
          setCombinations(items)
          setCombinationsToTable(items)
          setTotalItems(items.length)
          setLoading(false)
        }
      }).catch(() => {
        setCombinations([])
        setLoading(false)
      })
  }
  useEffect(() => {
    if (!loadingAuth) {
      getCombinations()
      setLoading(false)
    }
  }, [dataAuth,loadingAuth])


  const tableRows = React.useMemo(() => {
    setLoading(true)
		const lastIndex = currentPage * rowsPerPage;
    const firstIndex = parseInt((lastIndex - rowsPerPage).toString());

    setLoading(false)
    return combinationsToTable?.slice(firstIndex, lastIndex);
	}, [currentPage, rowsPerPage, combinationsToTable]);

  function handleCombinationsChange(newCombos: any = undefined) {
    if (newCombos) {
      setCombinationsToTable(newCombos)
      setTotalItems(newCombos.length)
      setLoading(false)
      return
    }
    setCombinationsToTable(combinations)
    setTotalItems(combinations.length)
    setCurrentPage(1)
    setLoading(false)
    
  }
  let subTitle = formatMessage(messages.subTitle) ?? "Abaixo estão combinações que ocorreram em compras anteriores."

  let title = formatMessage(messages.title) ?? "Painel de Controle - Sugestão Inteligentes"

  let tableTitle = formatMessage(messages.tableTitle) ?? "Combos Vendidos"
  return (
    <Layout fullWidth>
      <>
        <PageBlock title={title} subtitle={subTitle} variant="full" >
          {(loading || loadingAuth) ? (
            <Spinner color="#f71964" />
          ) : (
            <>
              <div style={{ padding: "5rem"}}>
                <h3>{tableTitle}</h3>
                {combinationsToTable && (
                  <>
                    <Combo
                      combinations={tableRows}
                      currentItemFrom={(rowsPerPage * currentPage) - rowsPerPage}
                      currentItemTo={rowsPerPage * currentPage}
                      setRowsPerPage={setRowsPerPage}
                      totalItems={totalItems}
                      setCurrentPage={setCurrentPage}
                      currentPage={currentPage}
                      handleCombinationsChange={handleCombinationsChange}
                      combinationsToSearch={combinations}
                    />
                  </>
                )}
              </div>
            </>
          )}
        </PageBlock>
      </ >
    </Layout>
  )
}

export default SmartSuggestion
