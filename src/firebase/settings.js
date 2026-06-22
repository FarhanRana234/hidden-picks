import { db } from './config'
import { doc, getDoc, setDoc } from 'firebase/firestore'

const SETTINGS_ID = 'store'

export async function getSettings() {
  const snap = await getDoc(doc(db, 'settings', SETTINGS_ID))
  if (!snap.exists()) return null
  return { id: snap.id, ...snap.data() }
}

export async function updateSettings(data) {
  return setDoc(doc(db, 'settings', SETTINGS_ID), data, { merge: true })
}
