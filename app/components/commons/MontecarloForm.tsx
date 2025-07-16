import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "../ui/select";

export interface MontecarloParams {
  numSimulations: number;
  numVariables: number;
  variables: number[];
  modelo: "poisson" | "exponencial" | "ambas";
}

interface MontecarloFormProps {
  onCalculate: (params: MontecarloParams) => void;
}

const MontecarloForm: React.FC<MontecarloFormProps> = ({ onCalculate }) => {
  const [numSimulations, setNumSimulations] = useState(1000);
  const [numVariables, setNumVariables] = useState(2);
  const [modelo, setModelo] = useState<"poisson" | "exponencial" | "ambas">(
    "poisson"
  );
  const [error, setError] = useState("");

  function isValid() {
    if (!numSimulations || !numVariables) return false;
    if (numSimulations <= 0 || numVariables <= 0) return false;
    return true;
  }

  function handleChangeNumSim(e: React.ChangeEvent<HTMLInputElement>) {
    setNumSimulations(Number(e.target.value));
  }
  function handleChangeNumVars(e: React.ChangeEvent<HTMLInputElement>) {
    setNumVariables(Number(e.target.value));
  }
  function handleChangeModelo(value: string) {
    setModelo(value as any);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid()) {
      setError("Todos los campos son requeridos y deben ser válidos.");
      return;
    }
    setError("");
    onCalculate({
      numSimulations,
      numVariables,
      variables: [], // No se usan valores manuales
      modelo,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
      <div className="flex gap-6 justify-center w-full">
        <Card className="w-80 flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Número de simulaciones</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              step="1"
              min="1"
              value={numSimulations}
              onChange={handleChangeNumSim}
            />
            <div className="text-sm mt-2">
              Cantidad de iteraciones de la simulación
            </div>
          </CardContent>
        </Card>
        <Card className="w-80 flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Cantidad de variables</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              step="1"
              min="1"
              value={numVariables}
              onChange={handleChangeNumVars}
            />
            <div className="text-sm mt-2">Ejemplo: 2 para x1, x2</div>
          </CardContent>
        </Card>
        <Card className="w-80 flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Tipo de modelo</CardTitle>
          </CardHeader>
          <CardContent>
            <Select
              value={modelo}
              onValueChange={(value) =>
                setModelo(value as "poisson" | "exponencial" | "ambas")
              }
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Selecciona la distribución" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="poisson">Poisson</SelectItem>
                <SelectItem value="exponencial">Exponencial</SelectItem>
                <SelectItem value="ambas">Ambas</SelectItem>
              </SelectContent>
            </Select>
            <div className="text-sm mt-2">Selecciona la distribución</div>
          </CardContent>
        </Card>
      </div>
      {error && <div className="text-red-600 font-semibold mt-4">{error}</div>}
      <Button
        type="submit"
        className="mt-6 w-[40rem]"
        disabled={!isValid()}
        variant="default"
      >
        Simular
      </Button>
    </form>
  );
};

export default MontecarloForm;
