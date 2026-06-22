import { db } from './config'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const BANNERS_ID = 'banners'

export async function getBanners() {
  const snap = await getDoc(doc(db, 'settings', BANNERS_ID))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export async function updateBanners(data) {
  return setDoc(doc(db, 'settings', BANNERS_ID), data, { merge: true })
}
