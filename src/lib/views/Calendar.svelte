<script lang="ts">
  import DateTime from '$lib/components/DateTime.svelte'

  import type { Booking } from '@prisma/client'

  import { Button, Form, Modal, TextArea, TextInput } from 'carbon-components-svelte'

  import { onMount } from 'svelte'
  import type Calendar from 'tui-calendar'

  // import Calendar from 'tui-calendar' /* ES6 */
  import 'tui-calendar/dist/tui-calendar.css'

  let el: HTMLDivElement
  let calendar: Calendar

  let booking: Pick<Booking, 'start' | 'end'> | null = null

  onMount(async () => {
    const Calendar = await import('tui-calendar')
    calendar = new Calendar.default(el, {
      usageStatistics: false,
      defaultView: 'week',
      taskView: false,
    })

    calendar.on('beforeCreateSchedule', (e: any) => {
      booking = {
        start: new Date(e.start),
        end: new Date(e.end),
      }
      calendar.createSchedules([
        {
          ...e,
          isReadOnly: true,
          id: '1',
          calendarId: '1',
          title: 'my schedule',
          category: 'time',
        },
      ])
    })

    return () => calendar.destroy()
  })
</script>

<Modal
  open={booking !== null}
  size="xs"
  modalHeading="Create Event"
  primaryButtonText="Confirm"
  secondaryButtonText="Cancel"
>
  <Form>
    {#if booking}
      <DateTime bind:date={booking.start} />
      <DateTime bind:date={booking.end} />
      <TextArea labelText="Notes" rows={16} />
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
