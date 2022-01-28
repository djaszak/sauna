<script lang="ts">
  import DateTime from '$lib/components/DateTime.svelte'
  import { all, bookings, create, update } from '$lib/stores/bookings'

  import type { Booking } from '@prisma/client'

  import { Button, Form, Modal, TextArea } from 'carbon-components-svelte'

  import { onMount } from 'svelte'
  import type { IEventObject, TEventBeforeCreateSchedule } from 'tui-calendar'
  import type Calendar from 'tui-calendar'

  import 'tui-calendar/dist/tui-calendar.css'

  let el: HTMLDivElement
  let calendar: Calendar

  let booking: Pick<Booking, 'start' | 'end' | 'note'> | null = null

  onMount(async () => {
    const Calendar = await import('tui-calendar')
    calendar = new Calendar.default(el, {
      usageStatistics: false,
      defaultView: 'week',
      taskView: false,
    })

    calendar.on('beforeCreateSchedule', (e: TEventBeforeCreateSchedule) => {
      booking = {
        start: new Date(e.start as any),
        end: new Date(e.end as any),
        note: '',
      }
    })

    calendar.on('beforeUpdateSchedule', async (e: IEventObject) => {
      console.debug('beforeUpdateSchedule', e)
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

    calendar.on('clickSchedule', (e: any) => {
      console.log('clickSchedule', e)
    })

    all().then((bookings) => bookings.forEach(addEntry))

    return () => calendar.destroy()
  })

  function addEntry(booking: Booking) {
    calendar.createSchedules([
      {
        isReadOnly: false,
        id: booking.id,
        calendarId: '1',
        title: 'Sauna',
        body: booking.note,
        category: 'time',
        start: booking.start,
        end: booking.end,
      },
    ])
  }

  async function submit() {
    try {
      if (!booking) return
      const created = await create(booking)
      console.log(created)
      addEntry(created)
      booking = null
    } catch (e) {
      console.error(e)
    }
  }
</script>

<Modal
  open={booking !== null}
  size="xs"
  modalHeading="Create Event"
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
  on:submit={submit}
  on:close={() => (booking = null)}
  on:click:button--secondary={() => (booking = null)}
>
  <Form>
    {#if booking}
      <DateTime bind:date={booking.start} />
      <DateTime bind:date={booking.end} />
      <TextArea bind:value={booking.note} labelText="Notes" rows={16} />
    {/if}
  </Form>
</Modal>

<div class="flex items-center justify-between mt2">
  <div class="flex">
    <Button
      size="small"
      kind="primary"
      on:click={() => {
        calendar.today()
        calendar.scrollToNow()
      }}>📆 Current</Button
    >
    <Button size="small" kind="secondary" on:click={() => calendar.prev()}>👈 Previous</Button>
    <Button size="small" kind="secondary" on:click={() => calendar.next()}>👉 Next</Button>
  </div>
</div>
<div bind:this={el} />
