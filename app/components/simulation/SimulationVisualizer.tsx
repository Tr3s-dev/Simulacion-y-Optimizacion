import React, { useEffect, useRef, useState } from "react";
import { User, TicketIcon } from "lucide-react";
import { SimulationParams, SimulationReportType } from "./BankSimulation";

interface SimulationVisualizerProps {
  params: SimulationParams | null;
  running: boolean;
  onStop: () => void;
  onUnstable: () => void;
  onFinish: (report: SimulationReportType) => void;
}

interface Cliente {
  estado: "enCola" | "atendiendo" | "atendido";
  id: number;
  taquilla?: number;
  tiempoRestante?: number;
}

interface Taquilla {
  clienteId: number | null;
  tiempoRestante: number;
}

interface Evento {
  tiempo: number;
  acciones: string[];
}

export default function SimulationVisualizer({
  params,
  running,
  onStop,
  onUnstable,
  onFinish,
}: SimulationVisualizerProps) {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [taquillas, setTaquillas] = useState<Taquilla[]>([]);
  const [eventos, setEventos] = useState<Evento[]>([]);
  const [tiempo, setTiempo] = useState(0);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (!params || !running) {
      setClientes([]);
      setTaquillas([]);
      setEventos([]);
      setTiempo(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
      return;
    }
    setClientes(
      Array.from({ length: params.numClientes }, (_, i) => ({
        estado: "enCola",
        id: i,
        tiempoRestante: 0,
      }))
    );
    setTaquillas(
      Array.from({ length: params.numTaquillas }, () => ({
        clienteId: null,
        tiempoRestante: 0,
      }))
    );
    setEventos([]);
    setTiempo(0);

    if (intervalRef.current) clearInterval(intervalRef.current);
    let tiempoLocal = 0;
    intervalRef.current = setInterval(() => {
      tiempoLocal = parseFloat((tiempoLocal + 0.1).toFixed(1));
      setTaquillas((prevTaquillas) => {
        let nextTaquillas = [...prevTaquillas];
        setClientes((prevClientes) => {
          let nextClientes = [...prevClientes];
          let nuevosEventos: Evento[] = [];
          let acciones: string[] = [];
          // Atender clientes en taquillas
          for (let t = 0; t < nextTaquillas.length; t++) {
            if (nextTaquillas[t].clienteId !== null) {
              nextTaquillas[t].tiempoRestante -= 0.1;
              if (nextTaquillas[t].tiempoRestante <= 0) {
                const idx = nextClientes.findIndex(
                  (c) =>
                    c.estado === "atendiendo" &&
                    c.taquilla === t &&
                    c.id === nextTaquillas[t].clienteId
                );
                if (idx !== -1) {
                  acciones.push(
                    `Cliente ${
                      nextClientes[idx].id + 1
                    } ha salido de taquilla ${t + 1}`
                  );
                  nextClientes[idx] = {
                    ...nextClientes[idx],
                    estado: "atendido",
                    taquilla: undefined,
                  };
                }
                nextTaquillas[t].clienteId = null;
                nextTaquillas[t].tiempoRestante = 0;
              }
            }
          }
          // Pasar todos los clientes posibles a taquillas libres en este ciclo, priorizando taquilla 1, luego 2, luego 3...
          let colaClientes = nextClientes.filter((c) => c.estado === "enCola");
          let clienteIndex = 0;
          for (let t = 0; t < nextTaquillas.length; t++) {
            if (
              nextTaquillas[t].clienteId === null &&
              clienteIndex < colaClientes.length
            ) {
              const cliente = colaClientes[clienteIndex];
              const tiempoAtencion = Math.floor(Math.random() * 5) + 1;
              nextTaquillas[t].clienteId = cliente.id;
              nextTaquillas[t].tiempoRestante = tiempoAtencion;
              acciones.push(
                `Cliente ${cliente.id + 1} ha entrado a taquilla ${t + 1}`
              );
              const idx = nextClientes.findIndex((c) => c.id === cliente.id);
              nextClientes[idx] = {
                ...nextClientes[idx],
                estado: "atendiendo",
                taquilla: t,
                tiempoRestante: tiempoAtencion,
              };
              clienteIndex++;
            }
          }
          // Registrar eventos con el tiempo global correcto
          if (acciones.length > 0) {
            nuevosEventos.push({
              tiempo: tiempoLocal,
              acciones,
            });
          }
          setEventos((prev) => [...prev, ...nuevosEventos]);
          // Si todos atendidos y todas las taquillas libres, finalizar
          if (
            nextClientes.every((c) => c.estado === "atendido") &&
            nextTaquillas.every((tq) => tq.clienteId === null)
          ) {
            if (intervalRef.current) clearInterval(intervalRef.current);
            const eventosFinales = [...eventos, ...nuevosEventos];
            setEventos(eventosFinales);
            onFinish({
              eventos: eventosFinales,
              tiempoTotal: tiempoLocal,
            });
          }
          return nextClientes;
        });
        return nextTaquillas;
      });
      setTiempo(tiempoLocal);
    }, 100); // Actualización cada 100ms
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [params, running]);

  // Visualización
  return (
    <div className="relative w-full h-96 bg-gray-100 rounded-lg p-4 flex flex-col justify-end">
      {/* Cola de clientes */}
      <div className="flex flex-wrap gap-2 justify-center items-end mb-8">
        {clientes
          .filter((c) => c.estado === "enCola")
          .map((c) => (
            <div key={c.id} className="flex flex-col items-center">
              <User size={32} className="text-blue-600 animate-bounce" />
              <span className="text-xs font-bold text-blue-700">
                Cliente {c.id + 1}
              </span>
            </div>
          ))}
      </div>
      {/* Taquillas */}
      <div className="flex gap-8 justify-center items-center">
        {taquillas.map((taquilla, i) => {
          const clienteEnTaquilla = clientes.find(
            (c) =>
              c.estado === "atendiendo" &&
              c.taquilla === i &&
              c.id === taquilla.clienteId
          );
          return (
            <div key={i} className="flex flex-col items-center">
              <TicketIcon size={40} className="text-green-600" />
              <span className="text-xs">Taquilla {i + 1}</span>
              {clienteEnTaquilla && (
                <div className="flex flex-col items-center mt-2">
                  <User size={32} className="text-blue-600 animate-pulse" />
                  <span className="text-xs font-bold text-blue-700">
                    Cliente {clienteEnTaquilla.id + 1}
                  </span>
                  <span className="text-xs text-gray-500">
                    Tiempo restante: {taquilla.tiempoRestante.toFixed(1)}s
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
      {running && (
        <button
          onClick={() => {
            if (intervalRef.current) clearInterval(intervalRef.current);
            const eventosFinales = [...eventos];
            setEventos(eventosFinales);
            onFinish({
              eventos: eventosFinales,
              tiempoTotal: parseFloat(tiempo.toFixed(1)),
            });
          }}
          className="absolute top-4 right-4 bg-red-500 text-white px-4 py-2 rounded"
        >
          Detener simulación
        </button>
      )}
      <div className="absolute left-4 bottom-4 bg-white rounded px-3 py-1 shadow text-xs font-bold">
        Tiempo: {tiempo.toFixed(1)} s
      </div>
    </div>
  );
}
