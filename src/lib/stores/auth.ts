import { writable } from 'svelte/store'
import axios from 'axios'

export const LoggedIn = writable<null | boolean>(null, () => {
  const i = setInterval(check, 3000)
  return () => {
    clearInterval(i)
  }
})

export async function check() {
  try {
    await axios({
      url: '/api/auth/me',
      method: 'get',
    })
    LoggedIn.set(true)
  } catch {
    LoggedIn.set(false)
  }
}
