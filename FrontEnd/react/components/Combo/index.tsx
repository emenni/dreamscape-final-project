import React from 'react'
// import { ShowProduct } from '../ShowProduct'
import style from '../Combo/style.css'
import { Spinner, Table, Pagination, Tag, Button, Modal, Checkbox, Input } from 'vtex.styleguide'
import axios from 'axios'
import { ShowProduct } from '../ShowProduct';

import "./style.css"

export const Combo = ({
  combinations,
  setRowsPerPage,
  currentItemFrom,
  currentItemTo,
  setCurrentPage,
  currentPage,
  totalItems,
  handleCombinationsChange,
  combinationsToSearch
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(null)
  const [combinationIsLoading, setCombinationIsLoading] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [searchValue, setSearchValue] = React.useState('')
  const [imageUrl, setImageUrl] = React.useState('')
  const [imageLabel, setImageLabel] = React.useState('')
  const [showImage, setShowImage] = React.useState(false)
  const [filterStatements, setFilterStatements] = React.useState([])
  const [hasToBeActive, setHasToBeActive] = React.useState(undefined)
  const [isModalCreationOpen, setIsModalCreationOpen] = React.useState(false)
  const [checkCreateCombination, setCheckCreateCombination] = React.useState(true)

  React.useState(() => {
    if (combinations) {
      setLoading(false)
    }
  },[])

  async function handleShowInShop(combination: any) {
    setCombinationIsLoading(combination.combinationId)
    await axios.put(`/_v/combination/${combination.combination}/${combination.combinationId}/put`, {
      "showInShop": !combination.showInShop
    })
      .then(() => {
        const newCombos = combinations
        const index = combinations.findIndex((element: any) => element.combinationId === combination.combinationId)
        newCombos[index] = { ...newCombos[index], showInShop: !combination.showInShop }

        handleCombinationsChange(newCombos)
        setCombinationIsLoading(null)
        setLoading(false)
      }).catch(() => {
        const newCombos = combinations 
        const index = combinations.findIndex((element: any) => element.combinationId === combination.combinationId)
        newCombos[index] = { ...newCombos[index], showInShop: !combination.showInShop }

        handleCombinationsChange(newCombos)
        setCombinationIsLoading(null)
        setLoading(false)
      })
  }

  async function handleDeleteCombination(combination: any) {
    setCombinationIsLoading(combination.combinationId)
    await axios.delete(`/_v/combination/${combination.combination}/${combination.combinationId}/delete`)
      .then(() => {
        handleCombinationsChange(combinations.filter((combo: any) => combo.combinationId !== combination.combinationId))
        setCombinationIsLoading(null)
      }).catch(() => {
        handleCombinationsChange(combinations.filter((combo: any) => combo.combinationId !== combination.combinationId))
        setCombinationIsLoading(null)
        setIsModalOpen(null)
      })
  }

  async function searchProductIdByName(value: any) {
    const productsItems = await axios.get(`/api/catalog_system/pub/products/search/${value}`).then((response: any) => {
      if (!response && !response?.data) {
        return []
      }
      const productsItems = response?.data?.map((product: any) => {
        return product.items
      })
      return productsItems
       
    }).catch(() => {
      return []
    })
    if (!productsItems && productsItems?.length <= 0) {
      return []
    }
    const skusIds = []

    productsItems?.map((productItems: any) => {
      productItems.map((productItem: any) => {
        skusIds.push(productItem.itemId)
        return true
      })
      return true
    })

    return skusIds
  }
  
  function handleOnHover(imageUrl: string, imageLabel) {
    setImageUrl(imageUrl)
    setImageLabel(imageLabel)
    setShowImage(true)
  }

  function handleOnHoverEnd() {
    setImageUrl('')
    setImageLabel('')
    setShowImage(false)
  }

  const customSchema = {
    properties: {
      combination: {
        title: "Combinação",
        cellRenderer: ({ rowData }) => {
          return (
            <ShowProduct
              combination={rowData}
              handleOnHover={handleOnHover}
              handleOnHoverEnd={handleOnHoverEnd}
            />
          )
        },
        width: 980,
      },
      occurrences: {
        title: 'Num. Ocorrência',
        width: 150
      },
      showInShop: {
        title: 'Ativo',
        // you can customize cell component render (also header component with headerRenderer)
        cellRenderer: ({ rowData }) => {
          if (combinationIsLoading === rowData.combinationId) {
            return (
              <Spinner variant={"primary"} />
            )
          } else {
            return (
              <Tag
                bgColor={rowData.showInShop ? "#8bc34a" : "red"}
                color="#fff">
                <span className="nowrap">{rowData.showInShop ? "Sim" : "Não"}</span>
              </Tag>
            )
          }
        },
        width: 100
      },
      
    }
  }

  const lineActions = [
    {
      label: ({ rowData }) => {
        return (
          <span className="nowrap">{`${rowData.showInShop ? "Desativar" : 'Ativar'}`}</span>
        )
      },
      onClick: ({ rowData }) => {
        handleShowInShop(rowData)
      }
    },{
      label: () => {
        return (
          <span className="nowrap">{"Deletar"}</span>
        )
      },
      onClick: ({ rowData }) => {
        setIsModalOpen(rowData)
      },
      isDangerous: true
    }
  ]

  function handleSearchClear() {
    setSearchValue('')
    handleCombinationsChange()
  }

  function handleSearchChange(e: any) {
    if (e?.target?.value?.trim() === '') {
      handleCombinationsChange()
    }
    setSearchValue(e?.target?.value ?? '')
  }

  async function handleSearchSubmit(e: any) {
    const value = e && e?.target && e?.target?.value
    
    if (!value) {
      handleCombinationsChange(combinationsToSearch.filter((item: any) => {
        if (typeof hasToBeActive !== "undefined") {
          return item.showInShop === hasToBeActive
        }
        return true
      }))
    } else {
      // const getProductsSearchedData = showProductsRef?.current?.handleSearchSubmit(value)
      let productSkusId: any = undefined
      if (Number.isNaN(Number(value))) {
        productSkusId = await searchProductIdByName(value)
      }
      handleCombinationsChange(combinationsToSearch.filter((item: any) => { 
        if (productSkusId) {
          const findedProducts = productSkusId?.filter((skuId: any) => {
            return item.combination.includes(skuId)
          })
          if (findedProducts && findedProducts?.length > 0) {
            return item
          }
        }
        

        if (typeof hasToBeActive !== "undefined") {
          return item.combination.includes(value) && item.showInShop === hasToBeActive
        }
        return item.combination.includes(value)
      }))
      setCurrentPage(1)

    }
  }
  
  async function handleCreateCombination(e: any) {
    const { combination: {
        value: combination
      }, showInShop: {
        checked: showInShop
      }, occurrences: {
        value: occurrences
      } } = e.target
    const body = { combination, showInShop, occurrences }
    await axios.post(`/_v/combination/new`, body)
      .then(() => {
        setIsModalCreationOpen(false)
        e.persist()
      }).catch(() => {
        setIsModalCreationOpen(false)
        e.persist()
      })
  }
  ////

  function handleOnRowsChange(_: any, value: any){
    setRowsPerPage(Number(value))
    setCurrentPage(1)
  }

  function handleOnNextClick(){
    setCurrentPage(currentPage + 1)
  }

  function handleOnPrevClick(){
    setCurrentPage(currentPage - 1)
  }
  
  function activeSelectorObject({
    statements,
    values,
    statementIndex,
    error,
    extraParams,
    onChangeObjectCallback,
  }) {
    const initialValue = {
      Ativo: true,
      Inativo: true,
      ...(values || {}),
    }
    const toggleValueByKey = key => {
      const newValues = {
        ...(values || initialValue),
        [key]: values ? !values[key] : false,
      }
      return newValues
    }
    return (
      <div>
        {Object.keys(initialValue).map((opt, index) => {
          return (
            <div className="mb3" key={`class-statment-object-${opt}-${index}`}>
              <Checkbox
                checked={values ? values[opt] : initialValue[opt]}
                label={opt}
                name="default-checkbox-group"
                onChange={() => {
                  const newValue = toggleValueByKey(`${opt}`)
                  const newValueKeys = Object.keys(newValue)
                  const isEmptyFilter = !newValueKeys.some(
                    key => !newValue[key]
                  )
                  onChangeObjectCallback(isEmptyFilter ? null : newValue)
                }}
                value={opt}
              />
            </div>
          )
        })}
      </div>
    )
  }

  async function handleFiltersChange(statements = []) {
    // here you should receive filter values, so you can fire mutations ou fetch filtered data from APIs
    // For the sake of example I'll filter the data manually since there is no API
    let newData = undefined
    let productSkusId: any = undefined
    if (Number.isNaN(Number(searchValue))) {
      productSkusId = await searchProductIdByName(searchValue)
    }
    let oldData = undefined
    if (searchValue.trim() !== '' && productSkusId) {
      oldData = combinationsToSearch.filter((item: any) => { 
        if (productSkusId) {
          const findedProducts = productSkusId?.filter((skuId: any) => {
            return item.combination.includes(skuId)
          })
          if (findedProducts && findedProducts?.length > 0) {
            return item
          }
        }
        
  
        return item.combination.includes(searchValue)
      })
    } else {
      oldData = combinationsToSearch
    }
    statements?.forEach((st: any) => {
      if (!st || !st.object) return
      const { subject, object } = st
      switch (subject) {
        case 'showInShop':
          if (!object) return
          if (object['Inativo'] == true) {
            setHasToBeActive(false)
          } else if (object['Ativo'] == true) {
            setHasToBeActive(true)
          }
          if (object['Ativo'] && object['Inativo']) {
            newData = oldData
            setHasToBeActive(undefined)
            break
          } else if (!object['Ativo'] && !object['Inativo']) {
            newData = oldData
            setHasToBeActive(undefined)
            break
          }
          if (oldData) {
            newData = oldData.filter((item: any) => item['showInShop'] === hasToBeActive )
            break
          }
          newData = oldData.filter((item: any) => item['showInShop'] === hasToBeActive )
          break
        
      }
    })

    setFilterStatements(statements)
    handleCombinationsChange(newData ?? oldData ?? combinationsToSearch)
    setCurrentPage(1)
  }
  function onlynumber(evt: any, combination = undefined) {
    let theEvent = evt || window.event;
    let key = theEvent.keyCode || theEvent.which;
    key = String.fromCharCode( key );
    //var regex = /^[0-9.,]+$/;
    let regex = /^[0-9]+$/
    if (combination) {
      regex = /^[0-9,]+$/
    }
    if( !regex.test(key) ) {
       theEvent.returnValue = false;
       if(theEvent.preventDefault) theEvent.preventDefault();
    }
 }
  return (
    <div className={style.combos}>
      {(loading && combinations?.length <= 0) ? (
        <Spinner color="#f71964" />
      ) : (
        <>
          <Table
            fullWidth
            schema={customSchema}
            items={combinations}
            loading={loading}
            lineActions={lineActions}
            toolbar={{
              inputSearch: {
                value: searchValue,
                placeholder: 'Pesquise por...',
                onClear: handleSearchClear,
                onChange: handleSearchChange,
                onSubmit: handleSearchSubmit,
              },
              density: {
                buttonLabel: 'Espessura das Linhas',
                lowOptionLabel: 'Pequena',
                mediumOptionLabel: 'Mediana',
                highOptionLabel: 'Alta',
              },
              fields: {
                label: 'Alternar visibilidade das colunas',
                showAllLabel: 'Exibe Todas',
                hideAllLabel: 'Esconde Todas',
              },
              extraActions: {
                label: 'Aguarde',
                actions: [
                  {
                    label: 'Aguarde',
                    handleCallback: () => console.log('Aguarde'),
                  }
                ],
              },
              newLine: {
                label: 'Novo',
                handleCallback: () => setIsModalCreationOpen(true),
               
              },
              }}
              filters={{
                alwaysVisibleFilters: ['showInShop'],
                statements: filterStatements,
                onChangeStatements: handleFiltersChange,
                clearAllFiltersButtonLabel: 'Limpar Filtros',
                collapseLeft: true,
                options: {
                  showInShop: {
                    label: 'Ativo',
                    renderFilterLabel: (st: any) => {
                      if (!st || !st.object) {
                        // you should treat empty object cases only for alwaysVisibleFilters
                        return 'Todos'
                      }
                      const keys = st.object ? Object.keys(st.object) : undefined
                      const isAllTrue = !keys?.some(key => !st.object[key])
                      const isAllFalse = !keys?.some(key => st.object[key])
                      const trueKeys = keys?.filter(key => st.object[key])
                      let trueKeysLabel = ''
                      trueKeys.forEach((key, index) => {
                        trueKeysLabel += `${key}${
                          index === trueKeys.length - 1 ? '' : ', '
                        }`
                      })
                      return `${
                        isAllTrue ? 'Todos' : isAllFalse ? 'Nenhum' : `${trueKeysLabel}`
                      }`
                    },
                    verbs: [
                      {
                        label: 'Ativo',
                        value: 'showInShop',
                        object: {
                          renderFn: activeSelectorObject,
                          extraParams: {},
                        },
                      },
                    ],
                  },
                },
              }}
          />
          <Pagination
            rowsOptions={[10, 15, 20, 25]}
            currentItemFrom={currentItemFrom}
            currentItemTo={currentItemTo}
            onRowsChange={handleOnRowsChange}
            textOf="de"
            textShowRows="Combos por página"
            totalItems={totalItems}
            onNextClick={handleOnNextClick}
            onPrevClick={handleOnPrevClick}
          />
          <Modal
            centered
            isOpen={isModalOpen ? true : false}
            onClose={() => setIsModalOpen(null)}
          >
            <div className="dark-gray"
              style={{
                display: 'flex',
                gap: '1rem',
                flexDirection: 'column'
              }}
            >
              <p>Você realmente deseja deletar esta combinação.</p>
              <div
                style={{
                  backgroundColor: '#edf4fa',
                  borderRadius: '4px',
                  border: 'solid red',
                  borderWidth: '0 0 0 4px',
                  boxSizing: 'border-box',
                  padding: '12px 16px',
                }}
              >
                Essa Ação é irreversível
              </div>
              <div className="mb4">
                <Button
                  variation={"danger"}
                  onClick={() => {handleDeleteCombination(isModalOpen)}}
                > 
                  Deletar
                </ Button>
              </div>
            </div>
            </Modal>
            
            <Modal
              centered
              isOpen={isModalCreationOpen ? true : false}
              onClose={() => setIsModalCreationOpen(null)}
            >
              <div className="dark-gray"
                style={{
                  display: 'flex',
                  gap: '1rem',
                  flexDirection: 'column'
                }}
              >
                <p>Para criar suas combinação preencha o campo abaixo.</p>
                <form onSubmit={(e: any) => {handleCreateCombination(e)}}>
                  <div className="mb5">
                    <Input name="combination"
                      placeholder="Preencha com o os skus"
                      size="small"
                      label="Combinações  são skus separados por virgula Ex.: 1,2,3,4"
                      required={true}
                      onKeyPress={(e: any) => {
                        onlynumber(e, true)
                      }}
                    />
                  </div>

                  <div className="mb5">
                  <Checkbox
                    id="checked-fromsCreation"
                    label="Ativo"
                    name="showInShop"
                    value={true}
                    onChange={(e: any) => setCheckCreateCombination(!checkCreateCombination)}
                    checked={checkCreateCombination}
                  />
                  </div>

                  <div className="mb5">
                    <Input
                      placeholder="Núm. Ocorrências"
                      size="small"
                      label="Núm. Ocorrências"
                      name="occurrences"
                      type="number"
                      onKeyPress={(e: any) => {
                        onlynumber(e)
                      }}
                    />
                  </div>
                  <div
                    style={{
                      backgroundColor: '#edf4fa',
                      borderRadius: '4px',
                      border: 'solid green',
                      borderWidth: '0 0 0 4px',
                      boxSizing: 'border-box',
                      padding: '12px 16px',
                    }}
                    className="mb4"
                  >
                    Poderar haver combinações repetidas
                  </div>
                  <div className="mb4">
                    <Button
                      variation={"primary"}
                      type="submit"
                    > 
                      Criar
                    </ Button>
                  </div>
                </form>
              </div>
            </Modal>
          
        </>
      )}
      {showImage ? (
      <div className={style.showImage} >
        <img
          className={style.imgTag}
          src={imageUrl}
          alt={imageLabel}
          draggable="true"
        />
      </div>
      ) : (
        null
      )}
    </div>
  )
}
