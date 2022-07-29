import React from 'react'
import { useProducts } from './components/hooks/useProducts'

const ProductsBlock= () => {
 
  const { data , isLoading,  hasError } = useProducts()

  console.log(data)
 
  if (isLoading) return <>Loading...</>
  
  return hasError ? console.log("ocorreu um erro") : (
  
    <>{JSON.stringify(data)} </>
    
  
  )
  
}

export default ProductsBlock




