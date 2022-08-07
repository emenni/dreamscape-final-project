import React from 'react'
import { ProductDetail } from '../ProductDetail'
import style from './style.css'
import { Button } from 'vtex.styleguide'
import ShoppingCart from '@vtex/styleguide/lib/icon/ShoppingCart'
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
          <div  
            key={combination.combinationId + ' div'} 
            className={style.combosContent}
          >
            <div className={style.combo}>
              <table>              
                  {combinations.length === 0 && (
                    <>Carregando...</>
                  )}
                  {combinations.length > 0 && (
                    <tbody>

                      {/* {combination.combinationDetails.map((valor) => { return ( <SKUDetail sku={valor.sku} /> )})} */}
                      
                      {<ProductDetail combination={combination} />}
                              
                    </tbody>
                  )}            
              </table>
            </div>
            <div className={style.bt}>
              <Button variation="primary" size="small" href={comboLink} >
                <ShoppingCart />
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}