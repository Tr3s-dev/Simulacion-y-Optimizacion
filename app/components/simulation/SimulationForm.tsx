import React, { useState } from "react";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Button } from "../ui/button";

interface SimulationFormProps {
  onStart: (params: {
    numTaquillas: number;
    numClientes: number;
    llegada: number;
    servicio: number;
  }) => void;
  running: boolean;
}

export default function SimulationForm({
  onStart,
  running,
}: SimulationFormProps) {
  const [numTaquillas, setNumTaquillas] = useState(3);
  const [numClientes, setNumClientes] = useState(20);
  const [llegada, setLlegada] = useState(2);
  const [servicio, setServicio] = useState(3);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onStart({ numTaquillas, numClientes, llegada, servicio });
  };

  return (
    <form className="flex gap-4 items-end" onSubmit={handleSubmit}>
      <div className="flex flex-col gap-1">
        <Label htmlFor="taquillas">Taquillas</Label>
        <Input
          id="taquillas"
          type="number"
          min={1}
          value={numTaquillas}
          onChange={(e) => setNumTaquillas(Number(e.target.value))}
          disabled={running}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="clientes">Clientes</Label>
        <Input
          id="clientes"
          type="number"
          min={1}
          value={numClientes}
          onChange={(e) => setNumClientes(Number(e.target.value))}
          disabled={running}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="llegada">Tasa llegada (λ)</Label>
        <Input
          id="llegada"
          type="number"
          min={0.1}
          step={0.1}
          value={llegada}
          onChange={(e) => setLlegada(Number(e.target.value))}
          disabled={running}
        />
      </div>
      <div className="flex flex-col gap-1">
        <Label htmlFor="servicio">Tasa servicio (μ)</Label>
        <Input
          id="servicio"
          type="number"
          min={0.1}
          step={0.1}
          value={servicio}
          onChange={(e) => setServicio(Number(e.target.value))}
          disabled={running}
        />
      </div>
      <Button
        type="submit"
        disabled={running}
        className="bg-blue-500 text-white"
      >
        Iniciar simulación
      </Button>
    </form>
  );
}
