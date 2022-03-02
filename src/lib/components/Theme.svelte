<script lang="ts">
  import { onMount } from 'svelte'

  function set(dark: boolean) {
    window.document.documentElement.setAttribute('theme', dark ? 'g100' : 'white')
  }

  onMount(() => {
    if (!window.matchMedia) return
    const query = window.matchMedia('(prefers-color-scheme: dark)')
    set(query.matches)
    query.addEventListener('change', (e) => set(e.matches))
  })
</script>
