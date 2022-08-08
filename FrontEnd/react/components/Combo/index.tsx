import React from 'react'
// import { ShowProduct } from '../ShowProduct'
import style from '../Combo/style.css'
import { Spinner, Table, Pagination, Tag, Button, Modal, Checkbox, Input } from 'vtex.styleguide'
import axios from 'axios'
import { defineMessages, useIntl } from 'react-intl'
import { ShowProduct } from '../ShowProduct';

import "./style.css"
const messages = defineMessages({
  searchTableText: {
    id: 'smart-suggestion.searchTableText',
  },
  densityTableButtonLabel: {
    id: 'smart-suggestion.densityTableButtonLabelTableText',
  },
  densityLowOptionLabel: {
    id: 'smart-suggestion.densityLowOptionLabelTableText',
  },
  densityMediumOptionLabel: {
    id: 'smart-suggestion.densityMediumOptionLabelTableText',
  },
  densityHighOptionLabel: {
    id: 'smart-suggestion.densityHighOptionLabelTableText',
  },
  fieldsLabel: {
    id: 'smart-suggestion.fieldsLabelTableText',
  },
  fieldsShowAllLabel: {
    id: 'smart-suggestion.fieldsShowAllLabelTableText',
  },
  fieldsHideAllLabel: {
    id: 'smart-suggestion.fieldsHideAllLabelTableText',
  },
  extraActionsShowAllLabel: {
    id: 'smart-suggestion.extraActionsShowAllLabelTableText',
  },
  newLine: {
    id: "smart-suggestion.newLineTableText"
  },
  clearAllFilters: {
    id: "smart-suggestion.clearAllFiltersTableText"
  },
  optionsShowInShop: {
    id: "smart-suggestion.optionsShowInShopTableText"
  },
  modalCreationTitle: {
    id: "smart-suggestion.modalCreationTitleTableText"
  },
  modalCreationCombinationLabel: {
    id: "smart-suggestion.modalCreationCombinationLabelTableText"
  },
  modalCreationCombinationPlaceHolder: {
    id: "smart-suggestion.modalCreationCombinationPlaceHolderTableText"
  },
  modalCreationShowInShopLabel: {
    id: "smart-suggestion.modalCreationShowInShopLabelTableText"
  },
  modalCreationOccurrencesLabel: {
    id: "smart-suggestion.modalCreationOccurrencesLabelTableText"
  },
  modalCreationWarnLabel: {
    id: "smart-suggestion.modalCreationWarnLabelTableText"
  },
  modalCreationButtonLabel: {
    id: "smart-suggestion.modalCreationButtonLabelTableText"
  },
  modalDeleteTitle: {
    id: "smart-suggestion.modalDeleteTitleTableText"
  },
  modalDeleteWarnLabel: {
    id: "smart-suggestion.modalDeleteWarnLabelTableText"
  },
  modalDeleteButtonLabel: {
    id: "smart-suggestion.modalDeleteButtonLabelTableText"
  },
  paginationTextShowRows: {
    id: "smart-suggestion.paginationTextShowRowsTableText"
  },
  paginationTextOf: {
    id: "smart-suggestion.paginationTextOfTableText"
  },
  showInShopTitle: {
    id: "smart-suggestion.showInShopTitleTableText"
  },
  showInShopStatusActive: {
    id: "smart-suggestion.showInShopStatusActiveTableText"
  },
  showInShopStatusNotActive: {
    id: "smart-suggestion.showInShopStatusNotActiveTableText"
  },
  ocurrencesTitle: {
    id: "smart-suggestion.ocurrencesTitleTableText"
  },
  combinationTitle: {
    id: "smart-suggestion.combinationTitleTableText"
  },
  allFilter: {
    id: "smart-suggestion.allFilterTableText"
  }

})


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
  const { formatMessage } = useIntl()


  let searchTableText = formatMessage(messages.searchTableText) ?? "Pesquise por..."

  let densityTableButtonLabel = formatMessage(messages.densityTableButtonLabel) ?? 'Espessura das Linhas'

  let densityLowOptionLabel = formatMessage(messages.densityLowOptionLabel) ?? "Pequena"

  let densityMediumOptionLabel = formatMessage(messages.densityMediumOptionLabel) ?? "Mediana"

  let densityHighOptionLabel = formatMessage(messages.densityHighOptionLabel) ?? "Alta"

  let fieldsLabel = formatMessage(messages.fieldsLabel) ?? "Alternar visibilidade das colunas"

  let fieldsShowAllLabel = formatMessage(messages.fieldsShowAllLabel) ?? "Exibe todas"

  let fieldsHideAllLabel = formatMessage(messages.fieldsHideAllLabel) ?? "Esconde todas"
  
  let extraActionsShowAllLabel = formatMessage(messages.extraActionsShowAllLabel) ?? "Aguarde"
  
  let newLine = formatMessage(messages.newLine) ?? "Novo"
  
  let optionsShowInShop = formatMessage(messages.optionsShowInShop) ?? "Ativo"

  let clearAllFilters = formatMessage(messages.clearAllFilters) ?? "Limpar Filtros"
  
  let modalCreationTitle = formatMessage(messages.modalCreationTitle) ?? "Para criar suas combinação preencha o campo abaixo."

  let modalCreationCombinationLabel = formatMessage(messages.modalCreationCombinationLabel) ?? "Combinações  são skus separados por virgula Ex.: 1,2,3,4"

  let modalCreationCombinationPlaceHolder = formatMessage(messages.modalCreationCombinationPlaceHolder) ?? "Preencher com os skus"

  let modalCreationShowInShopLabel = formatMessage(messages.modalCreationShowInShopLabel) ?? "Ativo"
  
  let modalCreationOccurrencesLabel = formatMessage(messages.modalCreationOccurrencesLabel) ?? "Núm. Ocorrências"

  let modalCreationWarnLabel = formatMessage(messages.modalCreationWarnLabel) ?? "Poderá haver combinações repetidas"

  let modalCreationButtonLabel = formatMessage(messages.modalCreationButtonLabel) ?? "Criar"

  let modalDeleteTitle = formatMessage(messages.modalDeleteTitle) ?? "Você realmente deseja deletar esta combinação."

  let modalDeleteWarnLabel = formatMessage(messages.modalDeleteWarnLabel) ?? "Essa Ação é irreversível"

  
  let modalDeleteButtonLabel = formatMessage(messages.modalDeleteButtonLabel) ?? "Deletar"

  let paginationTextOf = formatMessage(messages.paginationTextOf) ?? 'de'
  
  let paginationTextShowRows = formatMessage(messages.paginationTextShowRows) ?? "Combos por página"

  let showInShopTitle = formatMessage(messages.showInShopTitle) ?? "Ativo"

  let showInShopStatusActive = formatMessage(messages.showInShopStatusActive) ?? "Sim"

  let showInShopStatusNotActive = formatMessage(messages.showInShopStatusNotActive) ?? "Não"

  let ocurrencesTitle = formatMessage(messages.ocurrencesTitle) ?? "Num. Ocorrência"

  let combinationTitle = formatMessage(messages.combinationTitle) ?? "Combinação"

  let allFilter = formatMessage(messages.allFilter) ?? "Todos"
  
  React.useEffect(() => {
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

        setCombinationIsLoading(null)
        setLoading(false)
        location.reload()
      }).catch(() => {

        setCombinationIsLoading(null)
        setLoading(false)
        location.reload()
      })
  }

  async function handleDeleteCombination(combination: any) {
    setCombinationIsLoading(combination.combinationId)
    await axios.delete(`/_v/combination/${combination.combination}/${combination.combinationId}/delete`)
      .then(() => {
        setCombinationIsLoading(null)
        location.reload()
      }).catch(() => {
        setCombinationIsLoading(null)
        setIsModalOpen(null)
        location.reload()
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
        title: combinationTitle,
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
        title: ocurrencesTitle,
        width: 150
      },
      showInShop: {
        title: showInShopTitle,
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
                <span className="nowrap">{rowData.showInShop ? showInShopStatusActive : showInShopStatusNotActive}</span>
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
                placeholder: searchTableText,
                onClear: handleSearchClear,
                onChange: handleSearchChange,
                onSubmit: handleSearchSubmit,
              },
              density: {
                buttonLabel: densityTableButtonLabel,

                lowOptionLabel: densityLowOptionLabel,

                mediumOptionLabel: densityMediumOptionLabel,

                highOptionLabel: densityHighOptionLabel,
              },
              fields: {
                label: fieldsLabel,
                showAllLabel: fieldsShowAllLabel,
                hideAllLabel: fieldsHideAllLabel,
              },
              extraActions: {
                label: extraActionsShowAllLabel,
                actions: [
                  {
                    label: extraActionsShowAllLabel,
                    handleCallback: () => console.log(extraActionsShowAllLabel),
                  }
                ],
              },
              newLine: {
                label: newLine,
                handleCallback: () => setIsModalCreationOpen(true),
               
              },
              }}
              filters={{
                alwaysVisibleFilters: ['showInShop'],
                statements: filterStatements,
                onChangeStatements: handleFiltersChange,
                clearAllFiltersButtonLabel: clearAllFilters,
                collapseLeft: true,
                options: {
                  showInShop: {
                    label: optionsShowInShop,
                    renderFilterLabel: (st: any) => {
                      if (!st || !st.object) {
                        // you should treat empty object cases only for alwaysVisibleFilters
                        return allFilter
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
                        isAllTrue ? allFilter : isAllFalse ? 'Nenhum' : `${trueKeysLabel}`
                      }`
                    },
                    verbs: [
                      {
                        label: optionsShowInShop,
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
            textOf={paginationTextOf}
            textShowRows={paginationTextShowRows}
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
              <p>{modalDeleteTitle}</p>
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
                {modalDeleteWarnLabel}
              </div>
              <div className="mb4">
                <Button
                  variation={"danger"}
                  onClick={() => {handleDeleteCombination(isModalOpen)}}
                > 
                  {modalDeleteButtonLabel}
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
                <p>{modalCreationTitle}</p>
                <form onSubmit={(e: any) => {handleCreateCombination(e)}}>
                  <div className="mb5">
                    <Input name="combination"
                      placeholder={modalCreationCombinationPlaceHolder}
                      size="small"
                      label={modalCreationCombinationLabel}
                      required={true}
                      onKeyPress={(e: any) => {
                        onlynumber(e, true)
                      }}
                    />
                  </div>

                  <div className="mb5">
                  <Checkbox
                    id="checked-fromsCreation"
                    label={modalCreationShowInShopLabel}
                    name="showInShop"
                    value={true}
                    onChange={(e: any) => setCheckCreateCombination(!checkCreateCombination)}
                    checked={checkCreateCombination}
                  />
                  </div>

                  <div className="mb5">
                    <Input
                      placeholder={modalCreationOccurrencesLabel}
                      size="small"
                      label={modalCreationOccurrencesLabel}
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
                    {modalCreationWarnLabel}
                  </div>
                  <div className="mb4">
                    <Button
                      variation={"primary"}
                      type="submit"
                    > 
                      {modalCreationButtonLabel}
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
