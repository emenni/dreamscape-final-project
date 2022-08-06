import React from 'react'
import productsByIdentifierQuery from '../../graphql/productsByIdentifier.gql'
import { useQuery } from 'react-apollo'
import style from './style.css'
import { Spinner } from 'vtex.styleguide'

export function ShowProduct({ combination, handleOnHover, handleOnHoverEnd }) {
  const [products, setProducts] = React.useState([])
  const { data, loading } = useQuery<any, any>(
    productsByIdentifierQuery,
    {
      variables: {
        field: 'sku',
        values: combination?.combination?.split(','),
      },
      skip: (combination?.combination?.split(',').length ?? 0) === 0,
    }
  )
  React.useEffect(() =>{
    if (!loading && data?.productsByIdentifier) {
      setProducts(data.productsByIdentifier)
    }
  },[loading,data])

  if (loading) {
    return (
      <Spinner  color="#f71964"  />
    )
  }

  

  return (
    <div className={style.products} >
      {products?.map((product: any) => {
        return (
          <div
            className={style.productInfo} key={product.productId + 'showProduct'}
            onMouseEnter={() => {
              handleOnHover(product?.items[0]?.images[0]?.imageUrl ?? '', product?.items[0]?.images[0]?.imageLabel ?? "Imagem Sem Label")
            }}
            onMouseLeave={handleOnHoverEnd}
          >
            <a href={`/admin/Site/SkuForm.aspx?IdSku=${product.productId}`} target='blank'>
              <span className="nowrap">{product.productName}</span>
            </a>
          </div>
        )
      })}
    </div>
  )
}
