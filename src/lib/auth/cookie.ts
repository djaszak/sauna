import cookie from 'cookie'
import ms from 'ms'
import { Duration } from './jwt'

export function set(key: string, value: string): string {
  return cookie.serialize(key, value, {
    httpOnly: true,
    // secure: true,
    sameSite: 'strict',
    path: '/',
    expires: new Date(Date.now() + ms(Duration)),
  })
}
