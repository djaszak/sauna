<script lang="ts">
  import { Form, TextInput, Button, Tab, Tabs, TabContent } from 'carbon-components-svelte'

  import axios, { Axios, AxiosRequestConfig } from 'axios'
  import type { Prisma } from '$lib/db'
  import { check } from '$lib/stores/auth'

  let i = 0
  let error: Error | null = null
  let user: Prisma.UserCreateInput = {
    email: '',
    name: '',
    password: '',
  }
  let code: string = ''
  let reset = false

  async function submit(e: Event) {
    try {
      e.preventDefault()
      let config: AxiosRequestConfig = {
        method: 'post',
      }
      switch (reset ? 420 : i) {
        case 0:
          config.url = '/api/auth/login'
          config.data = { email: user.email, password: user.password }
          break
        case 1:
          config.url = '/api/auth/login'
          config.data = { ...user }
          break
        case 2:
          config.url = '/api/auth/forgot'
          config.data = { email: user.email }
          reset = true
          break
        case 420:
          config.url = '/api/auth/reset'
          config.data = { email: user.email, password: user.password, code: code }
          break
        default:
          throw new Error()
      }
      await axios(config)
      check()
    } catch (e) {
      error = new Error('🚨 Nope')
    }
  }
</script>

<div>
  <Tabs bind:selected={i} autoWidth>
    <Tab label="Login" />
    <Tab label="Register" />
    <Tab label="Forgot" />

    <svelte:fragment slot="content">
      <Form on:submit={submit}>
        <TabContent>
          <TextInput type="email" labelText="E-Mail" bind:value={user.email} />
          <div class="mb3" />
          <TextInput type="password" labelText="Password" bind:value={user.password} />
          <div class="mb3" />
          <Button type="submit">Login</Button>
        </TabContent>

        <TabContent>
          <TextInput type="text" labelText="Name" bind:value={user.name} />
          <div class="mb3" />
          <TextInput type="email" labelText="E-Mail" bind:value={user.email} />
          <div class="mb3" />
          <TextInput type="password" labelText="Password" bind:value={user.password} />
          <div class="mb3" />
          <Button type="submit">Register</Button>
        </TabContent>

        <TabContent>
          <TextInput type="email" labelText="E-Mail" bind:value={user.email} disabled={reset} />
          <div class="mb3" />
          {#if reset}
            <TextInput type="text" labelText="Code" bind:value={code} />
            <div class="mb3" />
            <TextInput type="password" labelText="Password" bind:value={user.password} />
            <div class="mb3" />
            <Button type="submit">Reset</Button>
          {:else}
            <Button type="submit">Send Link</Button>
          {/if}
        </TabContent>

        {#if error}
          <p class="mt2">{error.message}</p>
        {/if}
      </Form>
    </svelte:fragment>
  </Tabs>
</div>

<style>
  p {
    color: red;
  }

  div :global(form) {
    max-width: 40rem;
  }

  div :global(.bx--tab-content) {
    padding: 1rem 0;
  }
</style>
