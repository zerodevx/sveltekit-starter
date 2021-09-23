<script>
import { BUILD } from '$lib/env'
import '../app.css'
</script>

<svelte:head>
  {#if BUILD === 'staging'}
    <meta name="robots" content="noindex" />
  {/if}
</svelte:head>

<slot />
