import React from 'react'
import productsByIdentifierQuery from '../../graphql/productsByIdentifier.gql'
import { useQuery } from 'react-apollo'
import style from '../Combo/style.css'

export function ShowProduct({ combination }) {
  console.log("🚀 ~ file: ShowProduct.tsx ~ line 6 ~ ShowProduct ~ combination", combination)
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
          <div className={style.preetieCombo}>
            <tr key={combination?.combinationId}>
              <a href={`https://amandateste--dreamscape.myvtex.com/${product.linkText}/p`} target='blank'>
                <td>
                  <img src={product.items[0].images[0].imageUrl} alt={product.items[0].images[0].imageLabel} />
                </td>
                <td>
                  <span>{product.productName}</span>
                  {console.log("🚀 ~ file: index.tsx ~ line 32 ~ {products?.productsByIdentifier&&products?.productsByIdentifier.map ~ product", product)}
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
