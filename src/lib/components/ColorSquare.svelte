<script lang="ts">
    // Solo permitimos estos valores válidos
    type ValidColor = 'R' | 'Y' | 'G' | 'B';
    type ColorProp = ValidColor | null | (string & {});
  
    // Prop con valor por defecto null
    export let color: ColorProp = null;
  
    // Mapeo de colores válidos a clases Tailwind
    const colorMap: Record<ValidColor, string> = {
      R: 'bg-red-500',
      Y: 'bg-yellow-400',
      G: 'bg-green-500',
      B: 'bg-blue-500'
    };
  
    // Solo si es un color válido, obtenemos la clase
    $: bgClass = (color && color in colorMap) ? colorMap[color as ValidColor] : null;
  </script>
  
  {#if bgClass}
    <div class="w-12 h-12 {bgClass} rounded inline-block"></div>
  {/if}