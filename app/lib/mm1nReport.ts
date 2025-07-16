import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { MM1NResults } from "~/components/commons/MM1NResultsDisplay";

export interface MM1NProbabilityRow {
  n: number;
  Pn: number;
  Psn: number;
}

export function generateMM1NPDF({
  rows,
  results,
  print = false,
}: {
  rows: MM1NProbabilityRow[];
  results: MM1NResults;
  print?: boolean;
}) {
  const doc = new jsPDF();
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.text("Reporte Modelo M/M/1/N", 14, 18);

  // Cuadro de valores de entrada y resultados
  autoTable(doc, {
    startY: 28,
    head: [["Valores de entrada", "Resultados del modelo"]],
    body: [
      [
        `Tasa de llegada: ${results.lambda}\nTasa de servicio: ${results.mu}\nCapacidad máxima: ${results.N}`,
        `Factor de utilización: ${results.rho}\nProbabilidad sistema vacío: ${results.P0}\nProbabilidad sistema lleno: ${results.Pn}\nTasa efectiva: ${results.lambda_e}\nClientes en sistema: ${results.Ls}\nClientes en cola: ${results.Lq}\nTiempo en sistema: ${results.Ws}\nTiempo en cola: ${results.Wq}`,
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
    doc.save("MM1N_Distribucion.pdf");
  }
  return doc;
}
