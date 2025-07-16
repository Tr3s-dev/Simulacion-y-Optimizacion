export interface MMCNResults {
  lambda: number;
  mu: number;
  servers: number;
  N: number;
  rho: number;
  P0: number;
  Pn: number;
  lambda_e: number;
  Ls: number;
  Lq: number;
  Ws: number;
  Wq: number;
  probabilities: Array<{ n: number; Pn: number; Psn: number }>;
}

export function calculateMMCN({
  lambda,
  mu,
  servers,
  N,
}: {
  lambda: number;
  mu: number;
  servers: number;
  N: number;
}): MMCNResults {
  // Factor de utilización
  const rho = lambda / (servers * mu);

  // Calcular P0
  let sum = 0;
  for (let n = 0; n <= servers - 1; n++) {
    sum += Math.pow(lambda / mu, n) / factorial(n);
  }
  let sum2 = 0;
  for (let n = servers; n <= N; n++) {
    sum2 +=
      Math.pow(lambda / mu, n) /
      (factorial(servers) * Math.pow(servers, n - servers));
  }
  const P0 = 1 / (sum + sum2);

  // Probabilidad sistema lleno
  const Pn =
    (Math.pow(lambda / mu, N) /
      (factorial(servers) * Math.pow(servers, N - servers))) *
    P0;

  // Tasa efectiva
  const lambda_e = lambda * (1 - Pn);

  // Probabilidades individuales y acumuladas
  let probabilities: Array<{ n: number; Pn: number; Psn: number }> = [];
  let acumulada = 0;
  for (let n = 0; n <= N; n++) {
    let prob;
    if (n < servers) {
      prob = (Math.pow(lambda / mu, n) / factorial(n)) * P0;
    } else {
      prob =
        (Math.pow(lambda / mu, n) /
          (factorial(servers) * Math.pow(servers, n - servers))) *
        P0;
    }
    acumulada += prob;
    probabilities.push({ n, Pn: prob, Psn: acumulada });
  }

  // Ls (clientes en sistema)
  let Ls = 0;
  for (let n = 0; n <= N; n++) {
    Ls += n * probabilities[n].Pn;
  }

  // Lq (clientes en cola)
  let Lq = 0;
  for (let n = servers; n <= N; n++) {
    Lq += (n - servers) * probabilities[n].Pn;
  }

  // Ws y Wq
  const Ws = Ls / lambda_e;
  const Wq = Lq / lambda_e;

  return {
    lambda,
    mu,
    servers,
    N,
    rho,
    P0,
    Pn,
    lambda_e,
    Ls,
    Lq,
    Ws,
    Wq,
    probabilities,
  };
}

function factorial(n: number): number {
  if (n === 0 || n === 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}
