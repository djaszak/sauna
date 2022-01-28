<script lang="ts">
  import { check, LoggedIn } from '$lib/stores/auth'
  import Auth from '$lib/views/Auth.svelte'
  import 'carbon-components-svelte/css/all.css'
  import dayjs from 'dayjs'
  import customParseFormat from 'dayjs/plugin/customParseFormat.js'
  import { onMount } from 'svelte'
  import 'tachyons/css/tachyons.min.css'

  dayjs.extend(customParseFormat)

  onMount(() => {
    check()
  })
</script>

<main>
  <h1>Sauna</h1>

  {#if $LoggedIn === null}
    <p>Loading...</p>
  {:else if $LoggedIn === true}
    <slot />
  {:else}
    <Auth />
  {/if}
</main>

<style>
  main {
    max-width: 50rem;
    margin: 0 auto;
    padding: 2rem;
  }
</style>
