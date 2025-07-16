import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export interface MMCNProbabilityRow {
  n: number;
  Pn: number;
  Psn: number;
}

export interface MMCNResults {
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
}

export function generateMMCNPDF({
  rows,
  results,
  print = false,
}: {
  rows: MMCNProbabilityRow[];
  results: MMCNResults;
  print?: boolean;
}) {
  const doc = new jsPDF();
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.text("Reporte Modelo M/M/c/N (Con límite de cola)", 14, 18);

  // Cuadro de valores de entrada y resultados
  autoTable(doc, {
    startY: 28,
    head: [["Valores de entrada", "Resultados del modelo"]],
    body: [
      [
        `Tasa de llegada: ${results.lambda.toFixed(
          4
        )}\nTasa de servicio: ${results.mu.toFixed(4)}\nServidores: ${
          results.servers
        }\nCapacidad máxima: ${results.N}`,
        `Factor de utilización: ${results.rho.toFixed(
          4
        )}\nProbabilidad sistema vacío: ${results.P0.toFixed(
          4
        )}\nProbabilidad sistema lleno: ${results.Pn.toFixed(
          4
        )}\nTasa efectiva: ${results.lambda_e.toFixed(
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
    body: rows.map((row) => [row.n, row.Pn.toFixed(6), row.Psn.toFixed(6)]),
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
    doc.save("MMCN_Distribucion.pdf");
  }
  return doc;
}
