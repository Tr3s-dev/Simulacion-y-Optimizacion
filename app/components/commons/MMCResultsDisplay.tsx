import React from "react";
import { Card, CardContent } from "../ui/card";
import { MMCParams } from "./MMCForm";
import mmcModel from "../../lib/mmcModel";
import { generateMMCPDF, MMCProbabilityRow } from "~/lib/mmcReport";

interface MMCResultsDisplayProps {
  params: MMCParams;
}

const MMCResultsDisplay: React.FC<MMCResultsDisplayProps> = ({ params }) => {
  const results = mmcModel(params.lambda, params.mu, params.servers);

  // Prepara los datos para la tabla PDF
  let acumulada = 0;
  const pdfRows: MMCProbabilityRow[] = results.pnTable.map((row) => {
    acumulada += row.pn;
    return {
      n: row.n,
      pn: row.pn,
      psn: acumulada,
    };
  });

  function handlePrint() {
    generateMMCPDF({ rows: pdfRows, params, results, print: true });
  }

  return (
    <div className="space-y-4">
      <div className="bg-slate-100 rounded-lg p-4 mb-4">
        <h3 className="font-bold text-lg mb-2">
          Resultados del Modelo Sin Límite (M/M/c)
        </h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <Card className="w-full">
            <CardContent>
              <div className="font-semibold">λ (Tasa de llegada)</div>
              <div className="text-2xl font-bold">{results.lambda}</div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardContent>
              <div className="font-semibold">μ (Tasa de servicio)</div>
              <div className="text-2xl font-bold">{results.mu}</div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardContent>
              <div className="font-semibold">c (Servidores)</div>
              <div className="text-2xl font-bold">{results.servers}</div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardContent>
              <div className="font-semibold">p (Utilización)</div>
              <div className="text-2xl font-bold">{results.p.toFixed(4)}</div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardContent>
              <div className="font-semibold">P₀ (Sistema vacío)</div>
              <div className="text-2xl font-bold">{results.p0.toFixed(4)}</div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardContent>
              <div className="font-semibold">P_w (Prob. espera)</div>
              <div className="text-2xl font-bold">{results.pw.toFixed(4)}</div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardContent>
              <div className="font-semibold">Lq (En cola)</div>
              <div className="text-2xl font-bold">{results.Lq.toFixed(4)}</div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardContent>
              <div className="font-semibold">Ls (En sistema)</div>
              <div className="text-2xl font-bold">{results.Ls.toFixed(4)}</div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardContent>
              <div className="font-semibold">Wq (Espera en cola)</div>
              <div className="text-2xl font-bold">{results.Wq.toFixed(4)}</div>
            </CardContent>
          </Card>
          <Card className="w-full">
            <CardContent>
              <div className="font-semibold">Ws (Tiempo en sistema)</div>
              <div className="text-2xl font-bold">{results.Ws.toFixed(4)}</div>
            </CardContent>
          </Card>
        </div>
        <div className="overflow-x-auto mt-8">
          <h4 className="font-bold text-base mb-2">
            Distribución de Probabilidad P(n) y P(≤n)
          </h4>
          <table className="min-w-full text-sm border rounded-lg overflow-hidden">
            <thead className="bg-slate-200">
              <tr>
                <th className="px-4 py-2 border text-center">
                  n (Clientes en sistema)
                </th>
                <th className="px-4 py-2 border text-center">
                  P(n) (Probabilidad de n clientes)
                </th>
                <th className="px-4 py-2 border text-center">
                  P(≤n) (Probabilidad acumulada)
                </th>
              </tr>
            </thead>
            <tbody>
              {results.pnTable.map((row) => (
                <tr key={row.n}>
                  <td className="px-4 py-2 border text-center font-bold">
                    {row.n}
                  </td>
                  <td className="px-4 py-2 border text-center font-bold">
                    {row.pn.toFixed(6)}
                  </td>
                  <td className="px-4 py-2 border text-center font-bold">
                    {row.psn.toFixed(6)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <div className="flex gap-4 mt-6 justify-center">
        <button
          type="button"
          className="bg-red-600 text-white px-6 py-2 rounded shadow font-semibold"
          onClick={() => generateMMCPDF({ rows: pdfRows, params, results })}
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
  );
};

export default MMCResultsDisplay;
