import { db } from './config'
import { collection, addDoc, getDoc, getDocs, updateDoc, deleteDoc, doc, query, orderBy } from 'firebase/firestore'

const col = collection(db, 'products')

export async function getProducts() {
  try {
    const q = query(col, orderBy('createdAt', 'desc'))
    const snap = await getDocs(q)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  } catch {
    const snap = await getDocs(col)
    return snap.docs.map(d => ({ id: d.id, ...d.data() }))
  }
}

export async function getProduct(id) {
  const snap = await getDoc(doc(db, 'products', id))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export async function getProductBySlug(slug) {
  const snap = await getDocs(col)
  const match = snap.docs.find(d => d.data().slug === slug)
  if (!match) return null
  return { id: match.id, ...match.data() }
}

export async function addProduct(data) {
  return addDoc(col, { ...data, createdAt: new Date().toISOString() })
}

export async function updateProduct(id, data) {
  return updateDoc(doc(db, 'products', id), data)
}

export async function deleteProduct(id) {
  return deleteDoc(doc(db, 'products', id))
}
