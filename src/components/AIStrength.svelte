<script lang="ts">
    import { RangeSlider } from '@skeletonlabs/skeleton';
    import { aiStrength, guidance_scale, control_guidance_start, control_guidance_end } from '../store/ai-params.store';

    // Temporary value to bind to the slider and synchronize with both stores
    let sliderValue = $aiStrength; // Starting point from aiStrength

    // Define the base of the exponent for exponential scaling
    const exponentBase = 2; // Exponential base for transformation
    let exponentialValue = 0; // Normalized exponential value from 0 to 1
    // Normalize exponential values to maintain the min and max range
    $: {
        aiStrength.set(parseFloat((0.3 + (sliderValue * 0.5)).toFixed(2)));
        guidance_scale.set(parseFloat((1.4 + (sliderValue * 1.1)).toFixed(2)));
        control_guidance_end.set(parseFloat((1 - (sliderValue * 0.3)).toFixed(2)));
    }
</script>

<RangeSlider bind:value={sliderValue} min={0} max={1} step={0.01} name="RangeSlider">
    <span slot="trail">
        <p>AI Strength: {sliderValue}</p>
    </span>
</RangeSlider>