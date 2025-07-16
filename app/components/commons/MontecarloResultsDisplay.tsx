import React from "react";
import { Button } from "../ui/button";
import { MontecarloResultRow, MontecarloResults, MontecarloParams } from "../../lib/montecarloSim";
import { generateMontecarloPDF } from "../../lib/montecarloReport";

interface MontecarloResultsDisplayProps {
  params: MontecarloParams;
  results: MontecarloResults;
}

const MontecarloResultsDisplay: React.FC<MontecarloResultsDisplayProps> = ({ params, results }) => {
  function handlePrint() {
    generateMontecarloPDF({ rows: results.rows, params, results, print: true });
  }

  return (
    <div className="space-y-4">
      <div className="bg-slate-100 rounded-lg p-4 mb-4">
        <h3 className="font-bold text-lg mb-2">Resultados Simulación Montecarlo</h3>
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="bg-white rounded-lg p-4 shadow text-center">
            <div className="font-bold text-sm mb-1">Promedio tiempo en sistema</div>
            <div className="text-2xl font-mono">{results.promedioTiempoEnSistema.toFixed(4)}</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow text-center">
            <div className="font-bold text-sm mb-1">Promedio llegadas</div>
            <div className="text-2xl font-mono">{results.promedioLlegadas.toFixed(4)}</div>
          </div>
          <div className="bg-white rounded-lg p-4 shadow text-center">
            <div className="font-bold text-sm mb-1">Promedio servicios</div>
            <div className="text-2xl font-mono">{results.promedioServicios.toFixed(4)}</div>
          </div>
        </div>
        <div className="overflow-x-auto mt-8">
          <h4 className="font-bold text-base mb-2">Tabla de Simulación</h4>
          <table className="min-w-full text-sm border rounded-lg overflow-hidden">
            <thead className="bg-slate-200">
              <tr>
                <th className="px-4 py-2 border text-center">Iteración</th>
                <th className="px-4 py-2 border text-center">Llegada</th>
                <th className="px-4 py-2 border text-center">Servicio</th>
                <th className="px-4 py-2 border text-center">Tiempo en sistema</th>
              </tr>
            </thead>
            <tbody>
              {results.rows.map((row) => (
                <tr key={row.iteracion}>
                  <td className="px-4 py-2 border text-center font-bold">{row.iteracion}</td>
                  <td className="px-4 py-2 border text-center font-bold">{row.llegada.toFixed(4)}</td>
                  <td className="px-4 py-2 border text-center font-bold">{row.servicio.toFixed(4)}</td>
                  <td className="px-4 py-2 border text-center font-bold">{row.tiempoEnSistema.toFixed(4)}</td>
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
          onClick={() => generateMontecarloPDF({ rows: results.rows, params, results })}
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
          Analizar con IA
        </button>
        <button
          type="button"
          className="bg-teal-600 text-white px-6 py-2 rounded shadow font-semibold"
          onClick={() => {}}
        >
          Analizar contexto con IA
        </button>
      </div>
    </div>
  );
};

export default MontecarloResultsDisplay;
