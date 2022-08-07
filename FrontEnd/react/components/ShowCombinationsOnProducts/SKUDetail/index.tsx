import React, { FC, useEffect } from 'react'
import checkInventory from '../../../graphql/checkInventory.gql'
import { useQuery } from 'react-apollo'
import style from '../ListOfCombinations/style.css'


export function SKUDetail({sku}) {

const { loading , data , error  } = useQuery<any, any>(
  checkInventory,
  {
    variables: {
      sku: parseInt(sku),
    },
  }
  )


if ((data?.inventoryProduct?.quantity - data?.inventoryProduct?.reservedQuantity) <= 0){

  return (
       <> 
          <div key={ `${data?.inventoryProduct?.id} ${data?.inventoryProduct?.CatalogProduct?.id} SKUDetail`} className={style.preetieCombo}>
            <tr>
                <td>
                {/* <span>{'PRODUTO ESGOTADO'}</span> */}
                </td>
              </tr>
          </div>
      </>
     )
}

else return <></>

}