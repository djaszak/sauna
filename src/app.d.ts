/// <reference types="@sveltejs/kit" />

declare namespace App {
  interface Locals {
    user: import('$lib/db').User | null
  }

  interface Platform {}

  interface Session {}

  interface Stuff {}
}
