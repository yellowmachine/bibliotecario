<script lang="ts">
  import Quagga from '@ericblade/quagga2';
	import { fetchOpenLibraryBookQuery } from '../../routes/data.remote';
	import type { NewBook } from '$lib/db/books';
	import BookCard from './BookCard.svelte';

  let isScanning = $state(false);
  let isLoading = $state(false);
  let manualISBN = $state('');
  let scannedISBN: string | null = $state(null);
  let error = $state('');
  let success = $state('');
  let book: NewBook | null = $state(null);

  const startScanner = async () => {
    
    try {
      error = '';  
      Quagga.init({
        inputStream: {
          name: "Live",
          type: "LiveStream",
          target: '#scanner-container',
          constraints: {
            width: 640,
            height: 480,
            facingMode: "environment"
          }
        },
        locator: {
          patchSize: "medium",
          halfSample: true
        },
        decoder: {
          readers: ["ean_reader", "ean_8_reader"]
        },
        locate: true
      }, function(err) {
        if (err) {
          console.error('Error inicializando Quagga:', err);
          error = '❌ Error inicializando el scanner: ' + err.message;
          isScanning = false;
          return;
        }
        console.log("Quagga inicializado correctamente");
        Quagga.start();
      });

      // Configurar el detector de códigos
      Quagga.onDetected(onBarcodeDetected);
      
    } catch (err) {
      console.error('Error starting scanner:', err);
      error = '❌ No se pudo acceder a la cámara. Usa la entrada manual.';
      isScanning = false;
    }
  };

  const stopScanner = () => {
    try {
      Quagga.offDetected(onBarcodeDetected);
      Quagga.stop();
      console.log('Scanner stopped');
    } catch (err) {
      console.log('Error stopping Quagga:', err);
    }
  };

  const onBarcodeDetected = async (result: any) => {
    try {
      const code = result.codeResult?.code;
      if (!code) return;

      // 🔍 Calculamos el promedio de error (según issue #237)
      let totalError = 0;
      let validSamples = 0;

      result.codeResult.decodedCodes?.forEach((decoded: any) => {
        if (decoded.error !== undefined) {
          totalError += decoded.error;
          validSamples++;
        }
      });

      const avgError = validSamples > 0 ? totalError / validSamples : 1;

      console.log(`📷 Código detectado: ${code}, error promedio: ${avgError.toFixed(3)}`);

      // ⚠️ Si el error medio es alto, ignoramos la detección
      if (avgError > 0.1) {
        console.log('❌ Detección descartada por baja confianza');
        return;
      }

      stopScanner();

      // ✅ Detección válida
      scannedISBN = code;

      if (isLoading) return;

      isLoading = true;
      console.log("📘 Buscando libro en OpenLibrary...");
      book = await fetchOpenLibraryBookQuery({ isbn: code });
      
    } catch (err) {
      console.error('Error procesando código detectado:', err);
      error = '❌ Error procesando código detectado.';
    } finally {
      isLoading = false;
      // Si quieres detener el escáner tras una lectura válida, puedes hacerlo aquí:
      // isScanning = false;
    }
  };

  $effect(() => {
    if(isScanning)
      startScanner();
    else
      stopScanner();
  });

  $effect(() => {
    return () => {
      stopScanner();
    };
  });
</script>

<div class="isbn-scanner bg-gray-900 text-gray-100 p-6 rounded-lg border border-gray-700">
  <h2 class="text-2xl font-bold mb-6 text-center">📚 Escanear ISBN</h2>
  
  <div class="scanner-section mb-6">
    <div class="flex gap-3 mb-4">
      {#if !isScanning}
        <button class="btn" onclick={() => isScanning = true} disabled={isLoading}>
          📱 Activar Cámara
        </button>
      {:else}
        <button class="btn" onclick={() => isScanning = false}>
          ⏹️ Detener Scanner
        </button>
      {/if}
    </div>
    
    {#if isScanning}
      <div class="camera-container relative mb-4">
        <div id="scanner-container"></div>
      </div>
      <p class="text-center text-sm text-gray-400">
        Coloca el código de barras del libro frente a la cámara
      </p>
    {/if}
  </div>

  <div class="text-2xl font-bold mb-6 text-center">{scannedISBN}</div>
  {#if book}
  <BookCard {book} />
  {/if}

  <div class="manual-section mb-6">
    <h3 class="text-lg font-semibold mb-3">✏️ Entrada Manual</h3>
    <div class="flex gap-3">
      <input
        bind:value={manualISBN}
        placeholder="Ingresa ISBN (10 o 13 dígitos)"
        disabled={isLoading}
        class="flex-1 bg-neutral-900 border border-neutral-700 text-white placeholder-neutral-400 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-white/20 focus:border-neutral-500 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      />
      <button class="btn" 
        disabled={isLoading || !manualISBN.trim()}
      >
        🔍 Buscar
      </button>
    </div>
    <p class="text-xs text-gray-400 mt-2">
      Ejemplo: 9780134685991 o 0134685997
    </p>
  </div>

  <!-- Estados de Carga -->
  {#if isLoading}
    <div class="loading text-center py-8">
      <div class="animate-spin inline-block w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mb-3"></div>
      <p class="text-gray-300">Buscando libro...</p>
    </div>
  {/if}

  <!-- Mensajes -->
  {#if error}
    <div class="error bg-red-900/30 border border-red-700 text-red-300 p-4 rounded-md mb-4">
      {error}
    </div>
  {/if}

  {#if success}
    <div class="success bg-green-900/30 border border-green-700 text-green-300 p-4 rounded-md mb-4">
      {success}
    </div>
  {/if}
</div>

<style>
  .isbn-scanner {
    max-width: 600px;
    margin: 0 auto;
  }
  
  .camera-container {
    position: relative;
    display: flex;
    justify-content: center;
  }
  
  /* Estilos para Quagga2 - mejorados para evitar problemas de dimensiones */
  :global(#scanner-container) {
    width: 100%;
    height: 400px;
    max-width: 600px;
    margin: 0 auto;
    background-color: #000;
    border: 2px solid #3b82f6;
    border-radius: 0.5rem;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  :global(#scanner-container video) {
    width: 100% !important;
    height: 100% !important;
    object-fit: cover !important;
    transform: none !important;
  }
  
  :global(#scanner-container canvas) {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
    width: 100% !important;
    height: 100% !important;
  }
  
  :global(#scanner-container .drawingBuffer) {
    position: absolute !important;
    top: 0 !important;
    left: 0 !important;
  }

</style>