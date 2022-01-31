<script lang="ts">
  import { Form, TextInput, Button, Tab, Tabs } from 'carbon-components-svelte'

  import axios from 'axios'
  import type { Prisma } from '$lib/db'
  import { check } from '$lib/stores/auth'

  let i = 0
  let error: Error | null = null
  let user: Prisma.UserCreateInput = {
    email: '',
    name: '',
    password: '',
  }

  $: isRegister = i !== 0

  async function submit(e: Event) {
    e.preventDefault()
    try {
      const data = isRegister ? { ...user } : { email: user.email, password: user.password }
      await axios({
        url: isRegister ? '/api/auth/register' : '/api/auth/login',
        method: 'post',
        data,
      })
      check()
    } catch (e) {
      error = new Error(isRegister ? 'Could not register' : 'Could not login')
    }
  }
</script>

<div>
  <Tabs bind:selected={i}>
    <Tab label="Login" />
    <Tab label="Register" />
  </Tabs>

  <div class="mt3" />

  <Form on:submit={submit}>
    {#if isRegister}
      <TextInput type="text" labelText="Name" bind:value={user.name} />
    {/if}
    <TextInput type="email" labelText="E-Mail" bind:value={user.email} />
    <TextInput type="password" labelText="Password" bind:value={user.password} />
    <Button class="mt3" type="submit">{isRegister ? 'Register' : 'Login'}</Button>
  </Form>

  {#if error}
    <p>{error.message}</p>
  {/if}
</div>

<style>
  p {
    color: red;
  }
</style>
