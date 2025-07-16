import React from "react";
import { MM1NParams } from "./MM1NForm";
import { generateMM1NPDF, MM1NProbabilityRow } from "~/lib/mm1nReport";

export interface MM1NResults {
  lambda: number;
  mu: number;
  N: number;
  rho: number;
  P0: number;
  Pn: number;
  lambda_e: number;
  Ls: number;
  Lq: number;
  Ws: number;
  Wq: number;
  probabilities: Array<{ n: number; Pn: number }>;
}

function calculateMM1N({ lambda, mu, N }: MM1NParams): MM1NResults {
  const rho = lambda / mu;
  let P0: number;
  if (rho === 1) {
    P0 = 1 / (N + 1);
  } else {
    P0 = (1 - rho) / (1 - Math.pow(rho, N + 1));
  }
  let probabilities: Array<{ n: number; Pn: number }> = [];
  let sum = 0;
  for (let n = 0; n <= N; n++) {
    const Pn = P0 * Math.pow(rho, n);
    probabilities.push({ n, Pn: parseFloat(Pn.toFixed(4)) });
    sum += Pn;
    if (sum > 0.9999) break;
  }
  const Pn_full = probabilities[probabilities.length - 1].Pn;
  const lambda_e = lambda * (1 - Pn_full);
  let Ls = 0;
  for (let n = 0; n < probabilities.length; n++) {
    Ls += probabilities[n].n * probabilities[n].Pn;
  }
  const Lq = Ls - (1 - probabilities[0].Pn);
  const Ws = Ls / lambda_e;
  const Wq = Lq / lambda_e;
  return {
    lambda,
    mu,
    N,
    rho: parseFloat(rho.toFixed(4)),
    P0: parseFloat(probabilities[0].Pn.toFixed(4)),
    Pn: parseFloat(Pn_full.toFixed(4)),
    lambda_e: parseFloat(lambda_e.toFixed(4)),
    Ls: parseFloat(Ls.toFixed(4)),
    Lq: parseFloat(Lq.toFixed(4)),
    Ws: parseFloat(Ws.toFixed(4)),
    Wq: parseFloat(Wq.toFixed(4)),
    probabilities,
  };
}

export default function MM1NResultsDisplay({
  results,
}: {
  results: MM1NResults;
}) {
  // Genera los datos para la tabla PDF
  let acumulada = 0;
  const pdfRows: MM1NProbabilityRow[] = results.probabilities.map((row) => {
    acumulada += row.Pn;
    return {
      n: row.n,
      Pn: row.Pn,
      Psn: acumulada,
    };
  });

  function handlePrint() {
    // Genera el PDF y lo abre en una nueva ventana para imprimir
    const doc = generateMM1NPDF({ rows: pdfRows, results, print: true });
  }

  return (
    <div className="space-y-4">
      <div className="bg-slate-100 rounded-lg p-4 mb-4">
        <h3 className="font-bold text-lg mb-2">
          Resultados del Modelo Con Límite (M/M/1/N)
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <ResultCard label="λ (Tasa de llegada)" value={results.lambda} />
          <ResultCard label="μ (Tasa de servicio)" value={results.mu} />
          <ResultCard label="ρ (Factor de utilización)" value={results.rho} />
          <ResultCard label="P₀ (Prob. sistema vacío)" value={results.P0} />
          <ResultCard label="N (Capacidad máxima)" value={results.N} />
          <ResultCard label="Pₙ (Prob. sistema lleno)" value={results.Pn} />
          <ResultCard label="λₑ (Tasa efectiva)" value={results.lambda_e} />
          <ResultCard label="Ls (Clientes en sistema)" value={results.Ls} />
          <ResultCard label="Lq (Clientes en cola)" value={results.Lq} />
          <ResultCard label="Ws (Tiempo en sistema)" value={results.Ws} />
          <ResultCard label="Wq (Tiempo en cola)" value={results.Wq} />
        </div>
      </div>
      {/* El cuadro informativo de valores de entrada y resultados ha sido removido de la vista. */}
      <div className="bg-white rounded-lg p-4 shadow">
        <h4 className="font-bold mb-2">
          Distribución de Probabilidad P(n) y P(≤n)
        </h4>
        <table className="w-full text-center">
          <thead>
            <tr>
              <th>n (Clientes en sistema)</th>
              <th>P(n) (Probabilidad de n clientes)</th>
              <th>P(≤n) (Probabilidad acumulada)</th>
            </tr>
          </thead>
          <tbody>
            {pdfRows.map((row) => (
              <tr key={row.n}>
                <td>{row.n}</td>
                <td>{row.Pn.toFixed(6)}</td>
                <td>{row.Psn.toFixed(6)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex gap-4 mt-6 justify-center">
          <button
            type="button"
            className="bg-red-600 text-white px-6 py-2 rounded shadow font-semibold"
            onClick={() => generateMM1NPDF({ rows: pdfRows, results })}
          >
            Generar PDF
          </button>
          <button
            type="button"
            className="bg-purple-600 text-white px-6 py-2 rounded shadow font-semibold"
            onClick={handlePrint}
          >
            Imprimir
          </button>
          <button
            type="button"
            className="bg-gray-500 text-white px-6 py-2 rounded shadow font-semibold"
            onClick={() => window.location.reload()}
          >
            Limpiar
          </button>
          <button
            type="button"
            className="bg-yellow-500 text-white px-6 py-2 rounded shadow font-semibold"
            onClick={() => {}}
          >
            Explicar con IA
          </button>
          <button
            type="button"
            className="bg-teal-600 text-white px-6 py-2 rounded shadow font-semibold"
            onClick={() => {}}
          >
            Analizar Escenario con IA
          </button>
        </div>
      </div>
    </div>
  );
}

function ResultCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow text-center">
      <div className="font-bold text-sm mb-1">{label}</div>
      <div className="text-2xl font-mono">{value.toFixed(4)}</div>
    </div>
  );
}

export { calculateMM1N };
