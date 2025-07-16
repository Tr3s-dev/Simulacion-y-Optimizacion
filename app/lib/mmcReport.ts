import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { MMCParams } from "~/components/commons/MMCForm";
import mmcModel from "~/lib/mmcModel";

export interface MMCProbabilityRow {
  n: number;
  pn: number;
  psn: number;
}

export function generateMMCPDF({
  rows,
  params,
  results,
  print = false,
}: {
  rows: MMCProbabilityRow[];
  params: MMCParams;
  results: ReturnType<typeof mmcModel>;
  print?: boolean;
}) {
  const doc = new jsPDF();
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.text("Reporte Modelo M/M/c (Sin límite de cola)", 14, 18);

  // Cuadro de valores de entrada y resultados
  autoTable(doc, {
    startY: 28,
    head: [["Valores de entrada", "Resultados del modelo"]],
    body: [
      [
        `Tasa de llegada: ${params.lambda}\nTasa de servicio: ${params.mu}\nServidores: ${params.servers}`,
        `Factor de utilización: ${results.p.toFixed(
          4
        )}\nProbabilidad sistema vacío: ${results.p0.toFixed(
          4
        )}\nProbabilidad de espera: ${results.pw.toFixed(
          4
        )}\nClientes en sistema: ${results.Ls.toFixed(
          4
        )}\nClientes en cola: ${results.Lq.toFixed(
          4
        )}\nTiempo en sistema: ${results.Ws.toFixed(
          4
        )}\nTiempo en cola: ${results.Wq.toFixed(4)}`,
      ],
    ],
    theme: "grid",
    styles: {
      fontSize: 14,
      font: "helvetica",
      cellPadding: 4,
      overflow: "linebreak",
    },
    headStyles: {
      fillColor: [41, 128, 185],
      halign: "center",
      font: "helvetica",
      fontSize: 14,
    },
    columnStyles: {
      0: {
        halign: "left",
        fontStyle: "normal",
        font: "helvetica",
        fontSize: 14,
        cellWidth: 80,
      },
      1: {
        halign: "left",
        fontStyle: "normal",
        font: "helvetica",
        fontSize: 14,
        cellWidth: 80,
      },
    },
  });

  // Tabla de distribución de probabilidad
  const lastY = (doc as any).lastAutoTable
    ? (doc as any).lastAutoTable.finalY + 10
    : 140;
  autoTable(doc, {
    startY: lastY,
    head: [
      ["n", "P(n) Probabilidad de n clientes", "P(≤n) Probabilidad acumulada"],
    ],
    body: rows.map((row) => [row.n, row.pn.toFixed(6), row.psn.toFixed(6)]),
    theme: "grid",
    styles: { fontSize: 14, font: "helvetica", cellPadding: 4 },
    headStyles: { fillColor: [41, 128, 185], font: "helvetica", fontSize: 14 },
    columnStyles: {
      0: { font: "helvetica", fontSize: 14, cellWidth: 20 },
      1: { font: "helvetica", fontSize: 14, cellWidth: 70 },
      2: { font: "helvetica", fontSize: 14, cellWidth: 70 },
    },
    tableWidth: "wrap",
  });
  if (print) {
    window.open(doc.output("bloburl"), "_blank");
  } else {
    doc.save("MMC_Distribucion.pdf");
  }
  return doc;
}
