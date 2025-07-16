import React from "react";
import { Card, CardContent } from "../ui/card";
import { MMCNParams } from "./MMCNForm";
import { generateMMCNPDF, MMCNProbabilityRow } from "~/lib/mmcnReport";

// Resultados de ejemplo, en la práctica estos vendrían de la función de cálculo
interface MMCNResults {
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

interface MMCNResultsDisplayProps {
  results: MMCNResults;
}

const MMCNResultsDisplay: React.FC<{ params?: any; results?: any }> = ({
  params,
  results,
}) => {
  // Usar params si results no está definido
  const data = results || params || {};

  // Prepara los datos para la tabla PDF
  let acumulada = 0;
  const pdfRows: MMCNProbabilityRow[] = (data.probabilities || []).map(
    (row: any) => {
      acumulada += row.Pn;
      return {
        n: row.n,
        Pn: row.Pn,
        Psn: acumulada,
      };
    }
  );

  function handlePrint() {
    generateMMCNPDF({ rows: pdfRows, results: data, print: true });
  }

  return (
    <div className="space-y-4">
      <div className="bg-slate-100 rounded-lg p-4 mb-4">
        <h3 className="font-bold text-lg mb-2">
          Resultados del Modelo Múltiples Servidores Con Límite (M/M/s/N, s=
          {data.servers ?? "-"}, N={data.N ?? "-"})
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <ResultCard label="λ (Tasa de llegada)" value={data.lambda ?? 0} />
          <ResultCard label="μ (Tasa de servicio)" value={data.mu ?? 0} />
          <ResultCard label="s (Servidores)" value={data.servers ?? 0} />
          <ResultCard label="N (Capacidad máxima)" value={data.N ?? 0} />
          <ResultCard label="ρ (Factor de utilización)" value={data.rho ?? 0} />
          <ResultCard label="P₀ (Prob. sistema vacío)" value={data.P0 ?? 0} />
          <ResultCard label="Pₙ (Prob. sistema lleno)" value={data.Pn ?? 0} />
          <ResultCard label="λₑ (Tasa efectiva)" value={data.lambda_e ?? 0} />
          <ResultCard label="Ls (Clientes en sistema)" value={data.Ls ?? 0} />
          <ResultCard label="Lq (Clientes en cola)" value={data.Lq ?? 0} />
          <ResultCard label="Ws (Tiempo en sistema)" value={data.Ws ?? 0} />
          <ResultCard label="Wq (Tiempo en cola)" value={data.Wq ?? 0} />
        </div>
      </div>
      {data.probabilities && (
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
              {data.probabilities.map((row: any) => (
                <tr key={row.n}>
                  <td>{row.n}</td>
                  <td>{row.Pn?.toFixed(6) ?? "-"}</td>
                  <td>{row.Psn?.toFixed(6) ?? "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="flex gap-4 mt-6 justify-center">
            <button
              type="button"
              className="bg-red-600 text-white px-6 py-2 rounded shadow font-semibold"
              onClick={() => generateMMCNPDF({ rows: pdfRows, results: data })}
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
              onClick={() => {
                window.location.reload();
              }}
            >
              Limpiar
            </button>
            <button
              type="button"
              className="bg-yellow-500 text-white px-6 py-2 rounded shadow font-semibold"
              onClick={() => {
                /* IA analysis logic */
              }}
            >
              Explicar con IA
            </button>
            <button
              type="button"
              className="bg-teal-600 text-white px-6 py-2 rounded shadow font-semibold"
              onClick={() => {
                /* IA scenario logic */
              }}
            >
              Analizar Escenario con IA
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

function ResultCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow text-center">
      <div className="font-bold text-sm mb-1">{label}</div>
      <div className="text-2xl font-mono">{value.toFixed(4)}</div>
    </div>
  );
}

export default MMCNResultsDisplay;
