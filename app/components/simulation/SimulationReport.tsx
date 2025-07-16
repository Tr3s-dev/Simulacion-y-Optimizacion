import React from "react";
import { Button } from "../ui/button";
import jsPDF from "jspdf";
import { getQueueModel } from "../../lib/simulation/bankModels";
import { calculateMM1 } from "../commons/MM1ResultsDisplay";
import { calculateMM1N } from "../commons/MM1NResultsDisplay";
import mmcModel from "../../lib/mmcModel";

interface Evento {
  tiempo: number;
  acciones: string[]; // Frases en lenguaje natural
}

interface SimulationReportProps {
  report: {
    eventos: Evento[];
    tiempoTotal: number;
    params?: {
      numTaquillas: number;
      numClientes: number;
      llegada: number;
      servicio: number;
    };
  };
}

function getModelSummary(params: any) {
  if (!params) return null;
  const modelo = getQueueModel(params);
  if (modelo === "MM1") {
    const mm1 = calculateMM1({ lambda: params.llegada, mu: params.servicio });
    return {
      modelo,
      rho: mm1.rho,
      L: mm1.L,
      Lq: mm1.Lq,
      W: mm1.W,
      Wq: mm1.Wq,
    };
  } else if (modelo === "MMC") {
    const mmc = mmcModel(params.llegada, params.servicio, params.numTaquillas);
    return {
      modelo,
      servers: mmc.servers,
      p: mmc.p,
      Lq: mmc.Lq,
      Ls: mmc.Ls,
      Wq: mmc.Wq,
      Ws: mmc.Ws,
    };
  }
  return null;
}

export default function SimulationReport({ report }: SimulationReportProps) {
  const summary = getModelSummary(report.params);
  const handleDownloadPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text("Reporte de Simulación", 10, 20);
    doc.setFontSize(12);
    doc.text(`Tiempo total: ${report.tiempoTotal.toFixed(1)} s`, 10, 30);
    if (summary) {
      doc.text(`Modelo: ${summary.modelo}`, 10, 38);
      if (summary.modelo === "MM1") {
        doc.text(
          `ρ (Utilización): ${
            summary.rho !== undefined ? summary.rho.toFixed(4) : "-"
          }`,
          10,
          46
        );
        doc.text(
          `L (Clientes en sistema): ${
            summary.L !== undefined ? summary.L.toFixed(4) : "-"
          }`,
          10,
          54
        );
        doc.text(
          `Lq (Clientes en cola): ${
            summary.Lq !== undefined ? summary.Lq.toFixed(4) : "-"
          }`,
          10,
          62
        );
        doc.text(
          `W (Tiempo en sistema): ${
            summary.W !== undefined ? summary.W.toFixed(4) : "-"
          } s`,
          10,
          70
        );
        doc.text(
          `Wq (Tiempo en cola): ${
            summary.Wq !== undefined ? summary.Wq.toFixed(4) : "-"
          } s`,
          10,
          78
        );
      } else if (summary.modelo === "MMC") {
        doc.text(
          `c (Servidores): ${
            summary.servers !== undefined ? summary.servers : "-"
          }`,
          10,
          46
        );
        doc.text(
          `p (Utilización): ${
            summary.p !== undefined ? summary.p.toFixed(4) : "-"
          }`,
          10,
          54
        );
        doc.text(
          `Lq (Clientes en cola): ${
            summary.Lq !== undefined ? summary.Lq.toFixed(4) : "-"
          }`,
          10,
          62
        );
        doc.text(
          `Ls (Clientes en sistema): ${
            summary.Ls !== undefined ? summary.Ls.toFixed(4) : "-"
          }`,
          10,
          70
        );
        doc.text(
          `Wq (Tiempo en cola): ${
            summary.Wq !== undefined ? summary.Wq.toFixed(4) : "-"
          } s`,
          10,
          78
        );
        doc.text(
          `Ws (Tiempo en sistema): ${
            summary.Ws !== undefined ? summary.Ws.toFixed(4) : "-"
          } s`,
          10,
          86
        );
      }
      doc.text("Eventos:", 10, 96);
      let y = 104;
      report.eventos.forEach((ev) => {
        ev.acciones.forEach((accion) => {
          doc.text(`t=${ev.tiempo.toFixed(1)}s | ${accion}`, 10, y);
          y += 8;
        });
      });
    }
    doc.save("reporte_simulacion.pdf");
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mt-4">
      <h3 className="text-xl font-bold mb-2">Reporte de Simulación</h3>
      <div className="mb-2">
        Tiempo total:{" "}
        <span className="font-bold">{report.tiempoTotal.toFixed(1)} s</span>
      </div>
      {summary && (
        <div className="mb-4">
          <div>
            <span className="font-bold">Modelo:</span> {summary.modelo}
          </div>
          {summary.modelo === "MM1" && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                ρ (Utilización):{" "}
                <span className="font-bold">
                  {summary.rho !== undefined ? summary.rho.toFixed(4) : "-"}
                </span>
              </div>
              <div>
                L (Clientes en sistema):{" "}
                <span className="font-bold">
                  {summary.L !== undefined ? summary.L.toFixed(4) : "-"}
                </span>
              </div>
              <div>
                Lq (Clientes en cola):{" "}
                <span className="font-bold">
                  {summary.Lq !== undefined ? summary.Lq.toFixed(4) : "-"}
                </span>
              </div>
              <div>
                W (Tiempo en sistema):{" "}
                <span className="font-bold">
                  {summary.W !== undefined ? summary.W.toFixed(4) : "-"} s
                </span>
              </div>
              <div>
                Wq (Tiempo en cola):{" "}
                <span className="font-bold">
                  {summary.Wq !== undefined ? summary.Wq.toFixed(4) : "-"} s
                </span>
              </div>
            </div>
          )}
          {summary.modelo === "MMC" && (
            <div className="grid grid-cols-2 gap-2">
              <div>
                c (Servidores):{" "}
                <span className="font-bold">
                  {summary.servers !== undefined ? summary.servers : "-"}
                </span>
              </div>
              <div>
                p (Utilización):{" "}
                <span className="font-bold">
                  {summary.p !== undefined ? summary.p.toFixed(4) : "-"}
                </span>
              </div>
              <div>
                Lq (Clientes en cola):{" "}
                <span className="font-bold">
                  {summary.Lq !== undefined ? summary.Lq.toFixed(4) : "-"}
                </span>
              </div>
              <div>
                Ls (Clientes en sistema):{" "}
                <span className="font-bold">
                  {summary.Ls !== undefined ? summary.Ls.toFixed(4) : "-"}
                </span>
              </div>
              <div>
                Wq (Tiempo en cola):{" "}
                <span className="font-bold">
                  {summary.Wq !== undefined ? summary.Wq.toFixed(4) : "-"} s
                </span>
              </div>
              <div>
                Ws (Tiempo en sistema):{" "}
                <span className="font-bold">
                  {summary.Ws !== undefined ? summary.Ws.toFixed(4) : "-"} s
                </span>
              </div>
            </div>
          )}
        </div>
      )}
      <div className="mb-2 font-bold">Eventos:</div>
      <table className="w-full mb-4 border">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-2 text-left">Tiempo</th>
            <th className="p-2 text-left">Acción</th>
          </tr>
        </thead>
        <tbody>
          {report.eventos.map((ev, idx) =>
            ev.acciones.map((accion, i) => (
              <tr key={`${idx}-${i}`}>
                <td className="p-2">{ev.tiempo.toFixed(1)}s</td>
                <td className="p-2">{accion}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
      <Button onClick={handleDownloadPDF}>Descargar PDF</Button>
    </div>
  );
}
