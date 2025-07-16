// Simulación básica de Montecarlo para colas M/M/1
// Puedes ajustar la lógica según el modelo que desees simular
export interface MontecarloParams {
  numSimulations: number;
  lambda: number;
  mu: number;
}

export interface MontecarloResultRow {
  iteracion: number;
  llegada: number;
  servicio: number;
  tiempoEnSistema: number;
}

export interface MontecarloResults {
  rows: MontecarloResultRow[];
  promedioTiempoEnSistema: number;
  promedioLlegadas: number;
  promedioServicios: number;
}

export function calcularMontecarlo({ numSimulations, lambda, mu }: MontecarloParams): MontecarloResults {
  const rows: MontecarloResultRow[] = [];
  let totalTiempoEnSistema = 0;
  let totalLlegadas = 0;
  let totalServicios = 0;

  for (let i = 1; i <= numSimulations; i++) {
    // Genera tiempos de llegada y servicio aleatorios (exponencial)
    const llegada = -Math.log(Math.random()) / lambda;
    const servicio = -Math.log(Math.random()) / mu;
    const tiempoEnSistema = llegada + servicio;
    rows.push({
      iteracion: i,
      llegada,
      servicio,
      tiempoEnSistema,
    });
    totalTiempoEnSistema += tiempoEnSistema;
    totalLlegadas += llegada;
    totalServicios += servicio;
  }

  return {
    rows,
    promedioTiempoEnSistema: totalTiempoEnSistema / numSimulations,
    promedioLlegadas: totalLlegadas / numSimulations,
    promedioServicios: totalServicios / numSimulations,
  };
}
