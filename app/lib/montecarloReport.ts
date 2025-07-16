import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  MontecarloResultRow,
  MontecarloResults,
  MontecarloParams,
} from "./montecarloSim";

export function generateMontecarloPDF({
  rows,
  params,
  results,
  print = false,
}: {
  rows: MontecarloResultRow[];
  params: MontecarloParams;
  results: MontecarloResults;
  print?: boolean;
}) {
  const doc = new jsPDF();
  doc.setFont("helvetica", "normal");
  doc.setFontSize(14);
  doc.text("Reporte Simulación Montecarlo", 14, 18);

  autoTable(doc, {
    startY: 28,
    head: [["Valores de entrada", "Resultados de la simulación"]],
    body: [
      [
        `Número de simulaciones: ${params.numSimulations}\nTasa de llegada: ${params.lambda}\nTasa de servicio: ${params.mu}`,
        `Promedio tiempo en sistema: ${results.promedioTiempoEnSistema.toFixed(
          4
        )}\nPromedio llegadas: ${results.promedioLlegadas.toFixed(
          4
        )}\nPromedio servicios: ${results.promedioServicios.toFixed(4)}`,
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

  const lastY = (doc as any).lastAutoTable
    ? (doc as any).lastAutoTable.finalY + 10
    : 140;
  autoTable(doc, {
    startY: lastY,
    head: [["Iteración", "Llegada", "Servicio", "Tiempo en sistema"]],
    body: rows.map((row) => [
      row.iteracion,
      row.llegada.toFixed(4),
      row.servicio.toFixed(4),
      row.tiempoEnSistema.toFixed(4),
    ]),
    theme: "grid",
    styles: { fontSize: 12, font: "helvetica", cellPadding: 3 },
    headStyles: { fillColor: [41, 128, 185], font: "helvetica", fontSize: 12 },
    columnStyles: {
      0: { font: "helvetica", fontSize: 12, cellWidth: 20 },
      1: { font: "helvetica", fontSize: 12, cellWidth: 40 },
      2: { font: "helvetica", fontSize: 12, cellWidth: 40 },
      3: { font: "helvetica", fontSize: 12, cellWidth: 40 },
    },
    tableWidth: "wrap",
  });
  if (print) {
    window.open(doc.output("bloburl"), "_blank");
  } else {
    doc.save("Montecarlo_Simulacion.pdf");
  }
  return doc;
}
