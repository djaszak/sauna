import { config } from 'dotenv'
import axios from 'axios'
import FormData from 'form-data'
// import Mailgun from 'mailgun.js'

config()

const DOMAIN = process.env['DOMAIN']
const API_KEY = process.env['MAILGUN_API_KEY']

if (!DOMAIN || !API_KEY) throw new Error('Env missing')

// const MG = new Mailgun({ username: 'api', key: API_KEY })
console.log(`https://api.eu.mailgun.net/v3/${DOMAIN}/messages`)

const Transport = axios.create({
  baseURL: `https://api.eu.mailgun.net/v3/${DOMAIN}/messages`,
  auth: { username: 'api', password: API_KEY },
  method: 'POST',
})

export type Message = {
  to: string
  title: string
  body: string
}

export async function send(msg: Message) {
  const data = new FormData()
  data.append('from', 'Saunameister <meister@heisser-schweiss24.de>')
  data.append('to', msg.to), data.append('subject', msg.title)
  data.append('text', msg.body)
  await axios({
    url: `https://api.eu.mailgun.net/v3/${DOMAIN!}/messages`,
    auth: { username: 'api', password: API_KEY! },
    method: 'POST',
    headers: data.getHeaders(),
    data,
  })
}
