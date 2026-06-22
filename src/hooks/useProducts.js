import { useState, useEffect } from 'react'
import { getProducts } from '../firebase/products'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getProducts()
      .then(setProducts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return { products, loading, refetch: () => getProducts().then(setProducts) }
}
