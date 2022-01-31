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

<svelte:head>
  <title>Schwitzen bis in die Ritze</title>
</svelte:head>

<main>
  <h1>Peters Garten Sauna</h1>

  {#if $LoggedIn === null}
    <p>Loading...</p>
  {:else if $LoggedIn === true}
    <h2>Buch dein Schwitzgang 💨</h2>
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
