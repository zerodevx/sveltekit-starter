<script>
import { pages } from '../stores.js'

const items = [
  { title: 'HOME', href: '/' },
  { title: 'ABOUT', href: '/about' },
  { title: '404', href: '/error' }
]
</script>

<header class="w-full h-16 bg-white shadow-md">
  <nav>
    <ul class="flex flex-row justify-center">
      {#each items as { title, href }}
      <li>
        <a
          class="flex items-center justify-center border-red-500 hover:text-red-500 px-3 pt-4 pb-1"
          class:border-b-2={$pages[0] === href}
          {href}>{title}</a>
      </li>
      {/each}
    </ul>
  </nav>
</header>

