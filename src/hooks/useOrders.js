import { useState, useEffect } from 'react'
import { getOrders } from '../firebase/orders'

export function useOrders() {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getOrders()
      .then(setOrders)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return { orders, loading, refetch: () => getOrders().then(setOrders) }
}
