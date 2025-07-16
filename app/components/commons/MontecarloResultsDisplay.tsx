import React from "react";

interface MontecarloResultsDisplayProps {
  numSimulations: number;
  numVariables: number;
  modelo: "poisson" | "exponencial" | "ambas";
  resultados: {
    poisson?: number[][];
    exponencial?: number[][];
  };
}

const MontecarloResultsDisplay: React.FC<MontecarloResultsDisplayProps> = ({
  numSimulations,
  numVariables,
  modelo,
  resultados,
}) => {
  function renderTable(distrib: "poisson" | "exponencial") {
    const rows = resultados[distrib];
    if (!rows) return null;
    return (
      <div className="mb-8">
        <h3 className="font-bold text-lg mb-2">
          Distribución {distrib.charAt(0).toUpperCase() + distrib.slice(1)}
        </h3>
        <table className="min-w-full text-sm border rounded-lg overflow-hidden">
          <thead className="bg-slate-200">
            <tr>
              <th className="px-4 py-2 border text-center">Simulación</th>
              {Array.from({ length: numVariables }).map((_, i) => (
                <th key={i} className="px-4 py-2 border text-center">
                  x{i + 1}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row: number[], idx: number) => (
              <tr key={idx}>
                <td className="px-4 py-2 border text-center font-bold">
                  {idx + 1}
                </td>
                {row.map((val: number, j: number) => (
                  <td key={j} className="px-4 py-2 border text-center">
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {modelo === "poisson" && renderTable("poisson")}
      {modelo === "exponencial" && renderTable("exponencial")}
      {modelo === "ambas" && (
        <>
          {renderTable("poisson")}
          {renderTable("exponencial")}
        </>
      )}
    </div>
  );
};

export default MontecarloResultsDisplay;
