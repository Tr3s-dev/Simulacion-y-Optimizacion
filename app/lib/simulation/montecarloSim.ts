// Simulación Montecarlo para el banco
export function runMontecarloSimulation(params, onStep, onFinish, onUnstable) {
  // params: { numTaquillas, numClientes, llegada, servicio }
  // onStep: callback para cada paso visual
  // onFinish: callback al finalizar
  // onUnstable: callback si el sistema es inestable
  const { numTaquillas, numClientes, llegada, servicio } = params;
  let clientesEnCola = Array(numClientes).fill({ estado: "enCola" });
  let taquillas = Array(numTaquillas).fill(null);
  let tiempo = 0;
  let report = { eventos: [], tiempoTotal: 0 };

  // Verificar estabilidad
  if (llegada >= numTaquillas * servicio) {
    onUnstable();
    return;
  }

  // Simulación simple paso a paso
  function step() {
    // Lógica de movimiento de clientes y atención
    // ...
    tiempo++;
    // onStep({ clientesEnCola, taquillas, tiempo });
    // Si termina:
    // onFinish(report);
  }

  // Iniciar pasos (usar setInterval en componente visual)
}
