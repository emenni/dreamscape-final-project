import React, { FC, useEffect } from 'react'
import {useProduct} from 'vtex.product-context'
import { Combo } from './components/Combo';

const ProductCombination: FC = () => {

  const productContext = useProduct()

useEffect(() => {
  
  if (!productContext) return 

}, [productContext.selectedItem])


const skuItems = `${productContext.product.items.map(item => item.itemId)}`

let arr = [{combination:"40,56,38"}]

//return  <Combo combinations={arr} />

//return (<>{skuItems + '->' + productContext.selectedItem.itemId }</>)


}


export default ProductCombination
