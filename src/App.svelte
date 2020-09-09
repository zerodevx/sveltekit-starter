<script>
import { onDestroy } from 'svelte'
import Navaid from 'navaid'
import { pages } from './stores.js'
import Header from './components/Header.svelte'
import NotFound from './pages/NotFound.svelte'
import Home from './pages/Home.svelte'
import About from './pages/About.svelte'

let component
let props = {}
const run = (thunk, params) => {
  $pages = [location.pathname, ...$pages]
  props = params || {}
  component = thunk
}
const router = Navaid('/')
  .on('/about', () => run(About))
  .on('/', () => run(Home))
  .on('*', () => run(NotFound))
  .listen()

onDestroy(router.unlisten)

</script>


<Header />

<main>
	<svelte:component this={component} {...props} />
</main>
