<script lang="ts">
	import '../app.postcss';
	import { AppShell, AppBar } from '@skeletonlabs/skeleton';
</script>

<!-- App Shell -->
<AppShell>
	<svelte:fragment slot="header">
		<!-- App Bar -->
		<AppBar>
			<svelte:fragment slot="lead">
				<strong class="text-xl uppercase">STF Real-Time</strong>
			</svelte:fragment>
			<svelte:fragment slot="trail">
				<a
					class="btn btn-sm variant-ghost-surface"
					href="https://nvidia.com"
					target="_blank"
					rel="noreferrer"
				>
					Nvidia
				</a>
				<a
					class="btn btn-sm variant-ghost-surface"
					href="https://microsoft.com"
					target="_blank"
					rel="noreferrer"
				>
					Microsoft
				</a>
				<a
					class="btn btn-sm variant-ghost-surface"
					href="https://azure.com"
					target="_blank"
					rel="noreferrer"
				>
					Azure
				</a>
			</svelte:fragment>
		</AppBar>
	</svelte:fragment>
	<!-- Page Route Content -->
	<slot />
</AppShell>
