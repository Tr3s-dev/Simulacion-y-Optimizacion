// Simulación básica de Montecarlo para colas M/M/1
// Puedes ajustar la lógica según el modelo que desees simular
export interface MontecarloParams {
  numSimulations: number;
  numVariables: number;
  modelo: "poisson" | "exponencial" | "ambas";
}

export interface MontecarloResults {
  poisson?: number[][];
  exponencial?: number[][];
}

function randomPoisson(lambda: number) {
  // Algoritmo de Knuth
  let L = Math.exp(-lambda);
  let k = 0;
  let p = 1;
  do {
    k++;
    p *= Math.random();
  } while (p > L);
  return k - 1;
}

function randomExponencial(lambda: number) {
  return -Math.log(Math.random()) / lambda;
}

export function calcularMontecarlo({
  numSimulations,
  numVariables,
  modelo,
}: MontecarloParams): MontecarloResults {
  const results: MontecarloResults = {};
  if (modelo === "poisson" || modelo === "ambas") {
    const poisson: number[][] = [];
    for (let i = 0; i < numSimulations; i++) {
      const row: number[] = [];
      for (let j = 0; j < numVariables; j++) {
        row.push(randomPoisson(3)); // lambda fijo ejemplo
      }
      poisson.push(row);
    }
    results.poisson = poisson;
  }
  if (modelo === "exponencial" || modelo === "ambas") {
    const exponencial: number[][] = [];
    for (let i = 0; i < numSimulations; i++) {
      const row: number[] = [];
      for (let j = 0; j < numVariables; j++) {
        row.push(Number(randomExponencial(3).toFixed(4))); // lambda fijo ejemplo
      }
      exponencial.push(row);
    }
    results.exponencial = exponencial;
  }
  return results;
}
