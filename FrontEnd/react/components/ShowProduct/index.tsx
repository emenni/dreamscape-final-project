import React from 'react'
import productsByIdentifierQuery from '../../graphql/productsByIdentifier.gql'
import { useQuery } from 'react-apollo'
import style from '../Combo/style.css'

export function ShowProduct({ combination }) {
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
          <div key={ `${combination?.combinationId} ${product.productId} showProduct`} className={style.preetieCombo}>
            <tr>
              <a href={`/${product.linkText}/p`} target='blank'>
                <td>
                  <img src={product.items[0].images[0].imageUrl} alt={product.items[0].images[0].imageLabel} />
                </td>
                <td>
                  <span>{product.productName}</span>
                </td>
                <td>
                  <span>{'ID: ' + product.productId}</span>
                </td>
              </a>
            </tr>

          </div>
        )
      })}
    </>
  )
}
