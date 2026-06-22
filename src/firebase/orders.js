import { db } from './config'
import { collection, addDoc, getDocs, updateDoc, doc, orderBy, query } from 'firebase/firestore'

const col = collection(db, 'orders')

export async function getOrders() {
  const q = query(col, orderBy('createdAt', 'desc'))
  const snap = await getDocs(q)
  return snap.docs.map(d => ({ id: d.id, ...d.data() }))
}

export async function addOrder(data) {
  return addDoc(col, { ...data, createdAt: new Date().toISOString() })
}

export async function updateOrderStatus(id, status) {
  return updateDoc(doc(db, 'orders', id), { status })
}
