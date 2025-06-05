<script lang="ts">
	import '../app.css';

	let { children } = $props();
</script>

{@render children()}

export const ssr = false; export const prerender = false;
