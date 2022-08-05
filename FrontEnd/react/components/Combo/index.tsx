import React from 'react'
import { ShowProduct } from '../ShowProduct'
import style from '../Combo/style.css'
import { Button, Spinner } from 'vtex.styleguide'
import axios from 'axios'


export const Combo = ({ combinations }) => {
  const [combos, setCombos] = React.useState(combinations)
  const [combinationIsLoading, setCombinationIsLoading] = React.useState(null)
  const [loading, setLoading] = React.useState(true)
  React.useEffect(() => {
    setCombos(combinations)
    setLoading(false)
  }, [combinations])
  async function handleShowInShop(combination: any, index: number) {
    setCombinationIsLoading(index)
    await axios.put(`/_v/combination/${combination.combination}/${combination.combinationId}/put`, {
      "showInShop": !combination.showInShop
    })
      .then(() => {
        const newCombos = combos 
        newCombos[index] = { ...newCombos[index], showInShop: !combination.showInShop }

        setCombos(newCombos)
        setCombinationIsLoading(null)
      })
  }

  return (
    <div className={style.combos}>
      {loading ? (
        <Spinner color="#f71964" />
      ) : (
        <>
          {combos?.map((combination: any, index: number) => {
            let skus = combination?.combination.split(',')
            let comboLink = '/checkout/cart/add?sc=1'
            for (let i = 0; i < skus.length; i++) {
              comboLink += `&sku=${skus[i]}&qty=1&seller=1`
            }
            return (
              <div key={combination.combinationId + ' div'} className={style.combo}>
                <table>
                  <thead>
                    <div>
                      <h4>{`Este combo foi vendido ${combination.occurrences} vezes. ${combination.showInShop ? "Está ativo." : 'Está inativo.'}`}</h4>
                    </div>
                  </thead>
                  <div className={style.showProduct}>
                      <tbody>
                        <ShowProduct combination={combination} />
                      </tbody>
                      <div className="buttons">
                        <Button variation="secondary" size="small" href={comboLink} target='blank' >URL</Button>
                        <Button onClick={() => { handleShowInShop(combination, index) }} variation={`${combination.showInShop ? "danger" : 'primary'}`}>
                          {combinationIsLoading == index ? (
                            <Spinner color={`${combination.showInShop ? "white" : 'white'}`} />
                          ) : (
                            <>{`${combination.showInShop ? "Desativar" : 'Ativar'}`}</>
                          )}
                        </Button>
                      </div>
                  </div>
                </ table>
              </div>
            )
          })}
        </>
      )}
      
    </div>
  )
}
