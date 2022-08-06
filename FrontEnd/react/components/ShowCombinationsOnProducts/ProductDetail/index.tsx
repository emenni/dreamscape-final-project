import React from 'react'
import productsByIdentifierQuery from '../../../graphql/productsByIdentifier.gql'
import { useQuery } from 'react-apollo'
import style from '../ListOfCombinations/style.css'

export function ProductDetail({ combination }) {
  const { data: products } = useQuery<any, any>(
    productsByIdentifierQuery,
    {
      variables: {
        field: 'sku',
        values: combination?.combination?.split(','),
        // values: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
      },
      skip: (combination?.combination?.split(',').length ?? 0) === 0,
    }
  )

  return (
    <>
      {products?.productsByIdentifier && products?.productsByIdentifier.map((product: any) => {
        return (            
            <tr 
            onClick={() => {window.open(`/${product.linkText}/p`)}} 
            target='blank' 
            key={ `${combination?.combinationId} ${product.productId} showProduct`} 
            className={style.preetieCombo}>
                <td>
                  <img 
                    src={product.items[0].images[0].imageUrl} 
                    alt={product.items[0].images[0].imageLabel}
                    width="54" 
                    height="54" 
                  />
                </td>
                <td valign="top">
                  <span>{product.productName}</span>
                </td>            
                <td>
                </td>
            </tr>              
        )
      })}
    </>
  )
}
