<script>
import { BUILD } from '$lib/env'
import '../app.postcss'
</script>

<svelte:head>
  {#if BUILD === 'staging'}
    <meta name="robots" content="noindex" />
  {/if}
</svelte:head>

<slot />
