import React, { useState } from "react";
import SimulationForm from "~/components/simulation/SimulationForm";
import SimulationVisualizer from "~/components/simulation/SimulationVisualizer";
import SimulationReport from "~/components/simulation/SimulationReport";

// Tipos para los parámetros y reporte
export interface SimulationParams {
  numTaquillas: number;
  numClientes: number;
  llegada: number;
  servicio: number;
}
export interface SimulationReportType {
  eventos: any[];
  tiempoTotal: number;
  params?: SimulationParams;
}

export default function BankSimulation() {
  const [params, setParams] = useState<SimulationParams | null>(null);
  const [simulationState, setSimulationState] = useState<any>(null);
  const [report, setReport] = useState<SimulationReportType | null>(null);
  const [unstable, setUnstable] = useState(false);
  const [running, setRunning] = useState(false);

  const handleStart = (formParams: SimulationParams) => {
    setParams(formParams);
    setRunning(true);
    setUnstable(false);
    // ...start simulation logic...
  };

  const handleStop = () => {
    setRunning(false);
    // ...stop simulation logic...
  };

  const handleUnstable = () => {
    setUnstable(true);
    setRunning(false);
  };

  const handleFinish = (finalReport: SimulationReportType) => {
    setReport({
      ...finalReport,
      params: params || undefined,
    });
    setRunning(false);
  };

  return (
    <div className="flex flex-col gap-4">
      <SimulationForm onStart={handleStart} running={running} />
      {unstable && (
        <div className="text-red-500 font-bold">
          El sistema es inestable. La simulación se ha detenido.
        </div>
      )}
      <SimulationVisualizer
        params={params}
        running={running}
        onStop={handleStop}
        onUnstable={handleUnstable}
        onFinish={handleFinish}
      />
      {report && <SimulationReport report={report} />}
    </div>
  );
}
