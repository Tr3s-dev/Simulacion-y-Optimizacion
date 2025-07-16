import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export interface MontecarloParams {
  numSimulations: number;
  lambda: number;
  mu: number;
}

interface MontecarloFormProps {
  onCalculate: (params: MontecarloParams) => void;
}

const MontecarloForm: React.FC<MontecarloFormProps> = ({ onCalculate }) => {
  const [numSimulations, setNumSimulations] = useState("");
  const [lambda, setLambda] = useState("");
  const [mu, setMu] = useState("");
  const [error, setError] = useState("");

  function isValid() {
    if (!numSimulations || !lambda || !mu) return false;
    const nSim = parseInt(numSimulations);
    const lambdaNum = parseFloat(lambda);
    const muNum = parseFloat(mu);
    if (isNaN(nSim) || isNaN(lambdaNum) || isNaN(muNum)) return false;
    if (nSim <= 0 || lambdaNum <= 0 || muNum <= 0) return false;
    return true;
  }

  function handleChangeNumSim(e: React.ChangeEvent<HTMLInputElement>) {
    setNumSimulations(e.target.value);
  }
  function handleChangeLambda(e: React.ChangeEvent<HTMLInputElement>) {
    setLambda(e.target.value);
  }
  function handleChangeMu(e: React.ChangeEvent<HTMLInputElement>) {
    setMu(e.target.value);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid()) {
      setError("Todos los campos son requeridos y deben ser válidos.");
      return;
    }
    setError("");
    onCalculate({
      numSimulations: parseInt(numSimulations),
      lambda: parseFloat(lambda),
      mu: parseFloat(mu),
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
              placeholder="Ej: 1000"
              value={numSimulations}
              onChange={handleChangeNumSim}
            />
            <div className="text-sm mt-2">Cantidad de iteraciones de la simulación</div>
          </CardContent>
        </Card>
        <Card className="w-80 flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Tasa de Llegada (λ)</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              step="any"
              placeholder="Ej: 5.2"
              value={lambda}
              onChange={handleChangeLambda}
            />
            <div className="text-sm mt-2">Número promedio de llegadas por unidad de tiempo</div>
          </CardContent>
        </Card>
        <Card className="w-80 flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Tasa de Servicio (μ)</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              step="any"
              placeholder="Ej: 6.0"
              value={mu}
              onChange={handleChangeMu}
            />
            <div className="text-sm mt-2">Número promedio de servicios por unidad de tiempo</div>
          </CardContent>
        </Card>
      </div>
      {error && (
        <div className="text-red-600 font-semibold mt-4">{error}</div>
      )}
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
