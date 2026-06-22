import { db } from './config'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const DOC_ID = 'instagram'

export async function getInstagramImages() {
  const snap = await getDoc(doc(db, 'settings', DOC_ID))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export async function updateInstagramImages(data) {
  return setDoc(doc(db, 'settings', DOC_ID), data, { merge: true })
}
