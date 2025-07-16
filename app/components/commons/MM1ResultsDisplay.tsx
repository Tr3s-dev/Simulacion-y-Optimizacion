import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { MM1Params } from "./MM1Form";

export interface MM1Results {
  rho: number;
  L: number;
  Lq: number;
  W: number;
  Wq: number;
  probabilities: Array<{ n: number; Pn: number }>;
}

export function calculateMM1({ lambda, mu }: MM1Params): MM1Results {
  const rho = lambda / mu;
  const L = rho / (1 - rho);
  const Lq = (rho * rho) / (1 - rho);
  const W = 1 / (mu - lambda);
  const Wq = rho / (mu - lambda);
  // Probability distribution for n = 0 to 10
  const probabilities = Array.from({ length: 11 }, (_, n) => ({
    n,
    Pn: (1 - rho) * Math.pow(rho, n),
  }));
  return { rho, L, Lq, W, Wq, probabilities };
}

function generatePDF(params: MM1Params, results: MM1Results) {
  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text("Reporte M/M/1 (Sin límite de cola)", 14, 18);
  doc.setFontSize(12);
  doc.text(`Tasa de llegada (lambda): ${params.lambda}`, 14, 30);
  doc.text(`Tasa de servicio (mu): ${params.mu}`, 14, 38);
  doc.text("Resultados:", 14, 50);
  doc.text(`Utilización del sistema (rho): ${results.rho.toFixed(4)}`, 14, 58);
  doc.text(
    `Número promedio en el sistema (L): ${results.L.toFixed(4)}`,
    14,
    66
  );
  doc.text(`Número promedio en la cola (Lq): ${results.Lq.toFixed(4)}`, 14, 74);
  doc.text(
    `Tiempo promedio en el sistema (W): ${results.W.toFixed(4)}`,
    14,
    82
  );
  doc.text(`Tiempo promedio en la cola (Wq): ${results.Wq.toFixed(4)}`, 14, 90);
  doc.text("Distribución de probabilidades (Pn):", 14, 102);
  autoTable(doc, {
    startY: 108,
    head: [["n", "Probabilidad Pn"]],
    body: results.probabilities.map((row) => [row.n, row.Pn.toFixed(6)]),
    styles: { fontSize: 10 },
    columnStyles: { 0: { cellWidth: 20 }, 1: { cellWidth: 40 } },
  });
  doc.save("reporte_mm1.pdf");
}

const MM1ResultsDisplay: React.FC<{
  params: MM1Params;
  results: MM1Results;
}> = ({ params, results }) => {
  // Calcular la probabilidad acumulada
  let acumulada = 0;
  const pdfRows = results.probabilities.map((row) => {
    acumulada += row.Pn;
    return {
      n: row.n,
      Pn: row.Pn,
      Psn: acumulada,
    };
  });

  function handlePrint() {
    // PDF/print logic (igual que MM1NResultsDisplay)
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Reporte M/M/1 (Sin límite de cola)", 14, 18);
    doc.setFontSize(12);
    doc.text(`Tasa de llegada (lambda): ${params.lambda}`, 14, 30);
    doc.text(`Tasa de servicio (mu): ${params.mu}`, 14, 38);
    doc.text("Resultados:", 14, 50);
    doc.text(
      `Utilización del sistema (rho): ${results.rho.toFixed(4)}`,
      14,
      58
    );
    doc.text(
      `Número promedio en el sistema (L): ${results.L.toFixed(4)}`,
      14,
      66
    );
    doc.text(
      `Número promedio en la cola (Lq): ${results.Lq.toFixed(4)}`,
      14,
      74
    );
    doc.text(
      `Tiempo promedio en el sistema (W): ${results.W.toFixed(4)}`,
      14,
      82
    );
    doc.text(
      `Tiempo promedio en la cola (Wq): ${results.Wq.toFixed(4)}`,
      14,
      90
    );
    doc.text("Distribución de probabilidades (Pn):", 14, 102);
    autoTable(doc, {
      startY: 108,
      head: [["n", "Probabilidad Pn", "Probabilidad acumulada"]],
      body: pdfRows.map((row) => [
        row.n,
        row.Pn.toFixed(6),
        row.Psn.toFixed(6),
      ]),
      styles: { fontSize: 10 },
      columnStyles: {
        0: { cellWidth: 20 },
        1: { cellWidth: 40 },
        2: { cellWidth: 40 },
      },
    });
    window.open(doc.output("bloburl"), "_blank");
  }

  return (
    <div className="space-y-4">
      <div className="bg-slate-100 rounded-lg p-4 mb-4">
        <h3 className="font-bold text-lg mb-2">
          Resultados del Modelo Sin Límite (M/M/1)
        </h3>
        <div className="grid grid-cols-4 gap-4">
          <ResultCard label="λ (Tasa de llegada)" value={params.lambda} />
          <ResultCard label="μ (Tasa de servicio)" value={params.mu} />
          <ResultCard label="ρ (Factor de utilización)" value={results.rho} />
          <ResultCard
            label="P₀ (Prob. sistema vacío)"
            value={1 - results.rho}
          />
          <ResultCard label="Ls (Clientes en sistema)" value={results.L} />
          <ResultCard label="Lq (Clientes en cola)" value={results.Lq} />
          <ResultCard label="Ws (Tiempo en sistema)" value={results.W} />
          <ResultCard label="Wq (Tiempo en cola)" value={results.Wq} />
        </div>
      </div>
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
            onClick={() => handlePrint()}
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
};

function ResultCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="bg-white rounded-lg p-4 shadow text-center">
      <div className="font-bold text-sm mb-1">{label}</div>
      <div className="text-2xl font-mono">{value.toFixed(4)}</div>
    </div>
  );
}

export default MM1ResultsDisplay;
