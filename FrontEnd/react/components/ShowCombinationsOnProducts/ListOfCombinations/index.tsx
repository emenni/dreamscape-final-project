import React from 'react'
import { ProductDetail } from '../ProductDetail'
import style from './style.css'
import { Button } from 'vtex.styleguide'
import { SKUDetail } from '../SKUDetail'

export const ListOfCombinations = ({ combinations }) => {

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
            <div key={combination.combinationId + ' div'} className={style.combo}>
              <table>
                <div className={style.showProduct}>
                  {combinations.length === 0 && (
                    <>Carregando...</>
                  )}
                  {combinations.length > 0 && (
                    <tbody>

                      {combination.combinationDetails.map((valor) => { return ( <SKUDetail sku={valor.sku} /> )})}
                      
                      {<ProductDetail combination={combination} />}
                
                      <Button variation="secondary" size="small" href={comboLink} target='blank' >Comprar</Button>
                    </tbody>
                  )}
                </div>
              </table>
            </div>
          </div>
        )
      })}
    </div>
  )
}