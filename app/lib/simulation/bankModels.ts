// Lógica para determinar el modelo de línea de espera y estabilidad
export function getQueueModel(params) {
  const { numTaquillas, llegada, servicio } = params;
  // MM1: 1 taquilla
  // MM1N: 1 taquilla, capacidad limitada
  // MMC: varias taquillas
  // MMCN: varias taquillas, capacidad limitada
  if (numTaquillas === 1) {
    return "MM1";
  } else {
    return "MMC";
  }
}

export function isStable(params) {
  const { numTaquillas, llegada, servicio } = params;
  // Criterio de estabilidad para MMC: llegada < numTaquillas * servicio
  return llegada < numTaquillas * servicio;
}
