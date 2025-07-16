// M/M/c (multi-server, no limit) queueing model calculations
// Returns all required results and probability tables for MMCResultsDisplay

export interface MMCResults {
  lambda: number;
  mu: number;
  servers: number;
  p: number;
  p0: number;
  pw: number;
  Lq: number;
  Ls: number;
  Wq: number;
  Ws: number;
  pnTable: Array<{ n: number; pn: number; psn: number }>;
}

function factorial(n: number): number {
  if (n <= 1) return 1;
  let res = 1;
  for (let i = 2; i <= n; i++) res *= i;
  return res;
}

function mmcModel(
  lambda: number,
  mu: number,
  servers: number,
  maxN: number = 20
): MMCResults {
  const c = servers;
  const p = lambda / (c * mu);
  // Calculate P0
  let sum = 0;
  for (let n = 0; n < c; n++) {
    sum += Math.pow(lambda / mu, n) / factorial(n);
  }
  const lastTerm = Math.pow(lambda / mu, c) / (factorial(c) * (1 - p));
  const p0 = 1 / (sum + lastTerm);

  // Lq (expected number in queue)
  const Lq =
    (p0 * Math.pow(lambda / mu, c) * p) / (factorial(c) * Math.pow(1 - p, 2));
  // Ls (expected number in system)
  const Ls = Lq + lambda / mu;
  // Wq (expected waiting time in queue)
  const Wq = Lq / lambda;
  // Ws (expected time in system)
  const Ws = Wq + 1 / mu;
  // Pw (probability an arrival waits)
  const pw = (p0 * Math.pow(lambda / mu, c) * p) / (factorial(c) * (1 - p));

  // Probability table P(n) and cumulative P(≤n)
  let pnTable: Array<{ n: number; pn: number; psn: number }> = [];
  let cumulative = 0;
  for (let n = 0; n <= maxN; n++) {
    let pn: number;
    if (n < c) {
      pn = (Math.pow(lambda / mu, n) / factorial(n)) * p0;
    } else {
      pn =
        (Math.pow(lambda / mu, n) / (factorial(c) * Math.pow(c, n - c))) * p0;
    }
    cumulative += pn;
    pnTable.push({ n, pn, psn: cumulative });
  }

  return {
    lambda,
    mu,
    servers,
    p,
    p0,
    pw,
    Lq,
    Ls,
    Wq,
    Ws,
    pnTable,
  };
}

export default mmcModel;
