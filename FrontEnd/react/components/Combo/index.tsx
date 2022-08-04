import React from 'react'
import { ShowProduct } from '../ShowProduct'
import style from '../Combo/style.css'
import { Button, Spinner } from 'vtex.styleguide'
import axios from 'axios'


export const Combo = ({ combinations, getCombinations, setLoading }) => {

  async function handleShowInShop(combination: any, index: number) {
    await axios.put(`/_v/combination/${combination.combination}/${combination.combinationId}/put`, {
      "showInShop": !combination.showInShop
    })
      .then(async (response: any) => {
        if (response.status === 200) {
          setLoading(true)
          await getCombinations()
        }
      })
  }
  return (
    <div className={style.combos}>
      {combinations.map((combination: any, index: number) => {
        let skus = combination?.combination.split(',')
        let comboLink = '/checkout/cart/add?sc=1'
        for (let i = 0; i < skus.length; i++) {
          comboLink += `&sku=${skus[i]}&qty=1&seller=1`
        }
        return (
          <div className={style.combo}>
            <table key={combination.combinationId + ' table'}>
              <thead>
                <div>
                  <h4>{`Este combo foi vendido ${combination.occurrences} vezes. ${combination.showInShop ? "Está ativo." : 'Está inativo.'}`}</h4>
                </div>
              </thead>
              <div className={style.showProduct}>

                {combinations.length === 0 && (
                  <tbody>
                    <tr>
                      <td colSpan={3}>Carregando...</td>
                    </tr>
                  </tbody>
                )}
                {combinations.length > 0 && (
                  <tbody>
                    <ShowProduct combination={combination} />
                  </tbody>
                )}

                <div className="buttons">
                  <Button variation="secondary" size="small" href={comboLink} target='blank' >URL</Button>
                  <Button onClick={() => { handleShowInShop(combination, index) }}>Ativar</Button>
                </div>
              </div>
            </ table>
          </div>
        )
      })}
    </div>
  )
}
