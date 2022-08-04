import React from 'react'
import { ShowProduct } from '../ShowProduct'
import style from '../Combo/style.css'
export const Combo = ({ combinations }) => {

  return (
    <div className={style.combos}>
      {combinations.map((combination) => {
        console.log(combination)
        let skus = combination?.combination.split(',')
        let skusJoined = skus.join(', ')
        let comboLink = '/checkout/cart/add?sc=1'
        for (let i = 0; i < skus.length; i++) {
          comboLink += `&sku=${skus[i]}&qty=1&seller=1`
        }
        return (
          <div className={style.combo}>
            <table key={combination.combinationId + ' table'}>
              <thead>
                <div>
                  <h4>{`Combo com SKUs: ${skusJoined}`}</h4>
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
                <a href={comboLink} target='blank'><button type=''>Combo Link</button></a>
              </div>
            </ table>
          </div>
        )
      })}
    </div>
  )
}
