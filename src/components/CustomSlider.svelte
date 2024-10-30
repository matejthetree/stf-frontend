<!-- CustomSlider.svelte -->
<script lang="ts">
    import { RangeSlider } from '@skeletonlabs/skeleton';
    import type { Writable } from 'svelte/store';

    // Props for the slider
    export let value: Writable<number>;
    export let min: number = 0;
    export let max: number = 1;
    export let step: number = 0.1;
    export let label: string = "Slider";
</script>

<div class="flex items-center space-x-4">
    <p class="w-50 text-sm font-medium">{label}: <span class="font-semibold">{$value}</span></p>
    <div class="flex-grow">
        <RangeSlider bind:value={$value} {min} {max} {step} name="RangeSlider" />
    </div>
</div>
