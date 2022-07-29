import {  useEffect, useState } from 'react'
import { useQuery } from 'react-apollo'
import QUERY_PRODUCTS from '../../graphql/products.gql'

  export const useProducts = () => {

  const [hasLoaded, setHasLoaded] = useState(false)
  
    const { loading: loadingW, data , error: errorW } = useQuery( QUERY_PRODUCTS, {
        ssr: false,
       // skip:sessionUserId ? false : true,   
      }) 
      
    useEffect(() => {

      if (hasLoaded) return
      
      if (!data) return
      
      setHasLoaded(true)

    },[
      data,
      hasLoaded
    ])
     
    const isLoading =  loadingW  
    const hasError =   errorW

    if (hasError) {
      console.error(`There was a error while loading app.`)
      console.error({
        errorW
      })
    }

    return {
        data,
        isLoading,
        hasError,
      }
    }