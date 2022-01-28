import type { User } from '$lib/db'
import axios from 'axios'
import { derived, writable } from 'svelte/store'

export const users = writable<User[]>([])

export async function load() {
  const response = await axios({
    url: '/api/users',
    method: 'GET',
  })
  users.set(response.data)
}

export const userById = derived(
  users,
  ($users) => (id: string) => $users.find((user) => user.id === id)?.name || 'Not Found'
)
