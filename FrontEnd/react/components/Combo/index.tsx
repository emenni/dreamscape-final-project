import React from 'react'
// import { ShowProduct } from '../ShowProduct'
import style from '../Combo/style.css'
import { Spinner, Table, Pagination, Tag, Button, Modal } from 'vtex.styleguide'
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
  const [combos, setCombos] = React.useState(combinations)
  const [isModalOpen, setIsModalOpen] = React.useState(null)
  const [combinationIsLoading, setCombinationIsLoading] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  const [searchValue, setSearchValue] = React.useState('')
  const [imageUrl, setImageUrl] = React.useState('')
  const [imageLabel, setImageLabel] = React.useState('')
  const [showImage, setShowImage] = React.useState(false)

  React.useEffect(() => {
    setCombos(combinations)
    setLoading(false)
  }, [combinations])
  async function handleShowInShop(combination: any) {
    setCombinationIsLoading(combination.combinationId)
    await axios.put(`/_v/combination/${combination.combination}/${combination.combinationId}/put`, {
      "showInShop": !combination.showInShop
    })
      .then(() => {
        const newCombos = combinations 
        const index = combinations.findIndex((element: any) => element.combinationId === combination.combinationId)
        newCombos[index] = { ...newCombos[index], showInShop: !combination.showInShop }

        setCombos(newCombos)
        handleCombinationsChange(newCombos)
        setCombinationIsLoading(null)
      }).catch(() => {
        const newCombos = combinations 
        const index = combinations.findIndex((element: any) => element.combinationId === combination.combinationId)
        newCombos[index] = { ...newCombos[index], showInShop: !combination.showInShop }

        setCombos(newCombos)
        handleCombinationsChange(newCombos)
        setCombinationIsLoading(null)
      })
  }

  async function handleDeleteCombination(combination: any) {
    setCombinationIsLoading(combination.combinationId)
    await axios.delete(`/_v/combination/${combination.combination}/${combination.combinationId}/delete`)
      .then(() => {
        const newCombos = combinations.filter((combo: any) => combo.combinationId !== combination.combinationId) 
        setCombos(newCombos)
        handleCombinationsChange(newCombos)
        setCombinationIsLoading(null)
      }).catch(() => {
        const newCombos = combinations.filter((combo: any) => combo.combinationId !== combination.combinationId) 
        setCombos(newCombos)
        handleCombinationsChange(newCombos)
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
        width: 1150,
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
    setSearchValue(e?.target?.value ?? '')
  }

  async function handleSearchSubmit(e: any) {
    const value = e && e?.target && e?.target?.value
    
    if (!value) {
      handleCombinationsChange()
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
        

        return item.combination.includes(value)
      }))
      setCurrentPage(1)

    }
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
  return (
    <div className={style.combos}>
      {loading ? (
        <Spinner color="#f71964" />
      ) : (
        <>
          <Table
            className={style.tableCustomCss}
            fullWidth
            schema={customSchema}
            items={combos}
            loading={loading}
            lineActions={lineActions}
            toolbar={{
              inputSearch: {
                value: searchValue,
                placeholder: 'Pesquise por...',
                onClear: handleSearchClear,
                onChange: handleSearchChange,
                onSubmit: handleSearchSubmit,
              }
            }}
          />
          <Pagination
            rowsOptions={[10, 15, 20, 25]}
            currentItemFrom={currentItemFrom}
            currentItemTo={currentItemTo}
            onRowsChange={handleOnRowsChange}
            textOf="de"
            textShowRows="Filas por página"
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
