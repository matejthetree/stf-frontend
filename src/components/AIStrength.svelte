<script lang="ts">
    import { RangeSlider } from '@skeletonlabs/skeleton';
    import { aiStrength, guidance_scale, control_guidance_start, control_guidance_end } from '../store/ai-params.store';  // Import both shared stores

    // Temporary value to bind to the slider and synchronize with both stores
    let sliderValue = $aiStrength; // Starting point from aiStrength

    // Reactive statement to update both `aiStrength` and `guidanceScale`
    $: {
        aiStrength.set(0.3 + parseFloat((sliderValue * 0.5).toFixed(2)));
        guidance_scale.set(1.4 + parseFloat((sliderValue * 1.1).toFixed(2))); 
        control_guidance_end.set(1 - parseFloat((sliderValue * 0.3).toFixed(2)));
    }
</script>

<RangeSlider bind:value={sliderValue} min={0} max={1} step={0.05} name="RangeSlider">
    <span slot="trail">
        <p>AI Strength: {sliderValue}</p>
    </span>
</RangeSlider>