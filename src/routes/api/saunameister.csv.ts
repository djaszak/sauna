import DB from '$lib/db'
import type { RequestHandler } from '@sveltejs/kit'
import dayjs from 'dayjs'

export const get: RequestHandler = async () => {
  let csv = '\n'

  const bookings = await DB.booking.findMany({ orderBy: { start: 'desc' }, where: { start: { gte: new Date() } } })
  for (const booking of bookings) {
    // 00, Minute, Hour, Day, Month,*,Year,1,CJ0, Ofen an, 0, 24, 1, *
    // 00,00,17,24,11,*,2021,1,CJ0,Ofen an,0,24,1,*
    const start = dayjs(booking.start)
    const data = [
      start.format('ss'),
      start.format('mm'),
      start.format('HH'),
      start.format('DD'),
      start.format('MM'),
      '*',
      start.format('YYYY'),
      '1',
      'CJ0',
      'Ofen an',
      '0',
      '24',
      '1',
      '*',
    ]
    csv += data.join(',') + '\n'
  }
  return {
    headers: {
      'Content-Disposition': 'attachment; filename="ccron.csv"',
      'Content-Type': 'text/csv',
    },
    body: csv.trimEnd(),
  }
}
