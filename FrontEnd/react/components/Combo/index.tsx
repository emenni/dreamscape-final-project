import React from 'react'
import { ShowProduct } from '../ShowProduct'
import style from '../Combo/style.css'
export const Combo = ({ combinations }) => {
  console.log(combinations)
  return (
    <div className={style.combos}>
      {combinations.map((combination) => {
        console.log(combination)
        let skus = combination?.combination.split(',')
        let skusJoined = skus.join(', ')
        return (
          <div className={style.combo}>
            <table key={combination.combinationId + ' table'}>
              <thead>
                <div>
                  <h4>{`Combo com SKU's: ${skusJoined}`}</h4>
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
                <a href="https://amandateste--dreamscape.myvtex.com/checkout/cart/add?sc=1&sku=53&qty=1&seller=1&sku=72&qty=1&seller=1" target='blank'><button type=''>Combo Link</button></a>
              </div>
            </ table>
          </div>
        )
      })}
    </div>
  )
}
