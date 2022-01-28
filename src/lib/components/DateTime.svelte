<script lang="ts">
  import { DatePicker, TimePicker, TimePickerSelect, DatePickerInput } from 'carbon-components-svelte'
  import dayjs from 'dayjs'

  export let date: Date

  $: time = dayjs(date).format('HH:mm')

  function updateTime(e: any) {
    const time = dayjs(e.target.value, 'HH:mm')
    const d = dayjs(date).hour(time.hour()).minute(time.minute())
    date = d.toDate()
  }

  function updateDate(e: any) {
    const d = dayjs(date)
    const updated = dayjs(e.detail.dateStr, 'dd/mm/yyyy').hour(d.hour()).minute(d.minute())
    date = updated.toDate()
  }
</script>

<div class="flex">
  <DatePicker
    datePickerType="single"
    flatpickrProps={{ static: true }}
    dateFormat="d/m/Y"
    value={date.valueOf()}
    on:change={updateDate}
  >
    <DatePickerInput labelText="Meeting date" placeholder="dd/mm/yyyy" />
  </DatePicker>
  <TimePicker labelText="Cron job" placeholder="hh:mm" value={time} on:change={updateTime} />
</div>
