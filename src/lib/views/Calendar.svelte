<script lang="ts">
  import DateTime from '$lib/components/DateTime.svelte'
  import { all, create, remove, update } from '$lib/stores/bookings'
  import { load, userById } from '$lib/stores/users'
  import type { Booking } from '@prisma/client'
  import { Button, Form, Modal, TextArea } from 'carbon-components-svelte'
  import dayjs from 'dayjs'
  import { onMount } from 'svelte'
  import type Calendar from 'tui-calendar'
  import type { IEventObject, IEventScheduleObject, TEventBeforeCreateSchedule } from 'tui-calendar'
  import 'tui-calendar/dist/tui-calendar.css'

  const calendarId = '1'
  let el: HTMLDivElement
  let calendar: Calendar

  let booking: (Pick<Booking, 'start' | 'end' | 'note'> & Partial<Pick<Booking, 'id'>>) | null = null

  onMount(async () => {
    load()

    const Calendar = await import('tui-calendar')
    calendar = new Calendar.default(el, {
      usageStatistics: false,
      defaultView: 'week',
      taskView: false,
      week: {
        startDayOfWeek: 1,
      },
    })

    calendar.on('beforeCreateSchedule', (e: TEventBeforeCreateSchedule) => {
      booking = {
        start: new Date(e.start as any),
        end: new Date(e.end as any),
        note: '',
      }
    })

    calendar.on('beforeUpdateSchedule', async (e: IEventObject) => {
      const id = e.schedule.id
      if (!id || !e.schedule.calendarId) return
      const booking: Partial<Booking> = {
        id,
        start: e.start.toDate(),
        end: e.end.toDate(),
        note: e.schedule.body,
      }
      const updated = await update(booking)
      calendar.deleteSchedule(id, e.schedule.calendarId)
      addEntry(updated)
    })

    calendar.on('clickSchedule', (e: IEventScheduleObject) => {
      booking = {
        id: e.schedule.id as string,
        start: (e.schedule.start! as any).toDate(),
        end: (e.schedule.end! as any).toDate(),
        note: e.schedule.body || '',
      }
    })

    all().then((bookings) => bookings.forEach(addEntry))

    return () => calendar.destroy()
  })

  function getTitle(booking: Booking): string {
    let title = $userById(booking.userId)
    const limit = 20
    title += booking.note.length > limit ? ` - ${booking.note.slice(0, limit)}...` : ` - ${booking.note}`
    return title
  }

  function addEntry(booking: Booking) {
    calendar.createSchedules([
      {
        isReadOnly: false,
        id: booking.id,
        calendarId: calendarId,
        title: getTitle(booking),
        body: booking.note,
        category: 'time',
        start: booking.start,
        end: booking.end,
      },
    ])
  }

  function emptyBooking() {
    const start = dayjs().startOf('hour').add(1, 'hour')
    booking = { note: '', start: start.toDate(), end: start.add(2, 'hours').toDate() }
  }

  async function submit() {
    try {
      if (!booking) return
      if (booking.id) {
        const updated = await update(booking)
        calendar.deleteSchedule(booking.id, calendarId)
        addEntry(updated)
      } else {
        const created = await create(booking)
        addEntry(created)
      }
      booking = null
    } catch (e) {
      console.error(e)
    }
  }

  async function del() {
    if (!booking?.id) return
    await remove(booking.id)
    calendar.deleteSchedule(booking.id, calendarId)
    booking = null
  }

  $: secondary = (booking && booking.id ? [{ text: 'Cancel' }, { text: 'Delete' }] : []) as [
    { text: string },
    { text: string }
  ]
</script>

<Modal
  open={booking !== null}
  size="sm"
  modalHeading="Create Event"
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  secondaryButtons={secondary}
  on:submit={submit}
  on:close={() => (booking = null)}
  on:click:button--secondary={(e) => {
    if (e.detail.text === 'Delete') del()
    else booking = null
  }}
>
  <Form>
    {#if booking}
      <DateTime bind:date={booking.start} />
      <DateTime bind:date={booking.end} />
      <TextArea bind:value={booking.note} labelText="Notes" rows={5} />
    {/if}
  </Form>
</Modal>

<div class="flex items-center justify-between  flex-wrap mv2 buttons">
  <div class="flex">
    <Button
      size="small"
      kind="primary"
      on:click={() => {
        calendar.today()
        calendar.scrollToNow()
      }}>📆 Current</Button
    >
    <Button size="small" kind="primary" on:click={emptyBooking} class="ml1">✏️ Add</Button>
  </div>
  <div class="flex">
    <Button size="small" kind="secondary" on:click={() => calendar.prev()}>👈 Previous</Button>
    <Button size="small" kind="secondary" on:click={() => calendar.next()} class="ml1">👉 Next</Button>
  </div>
</div>
<div class="calendar" bind:this={el} />

<style>
  @media (max-width: 30rem) {
    .buttons :global(.bx--btn) {
      width: calc((100vw / 2) - 2rem);
    }
  }
</style>
