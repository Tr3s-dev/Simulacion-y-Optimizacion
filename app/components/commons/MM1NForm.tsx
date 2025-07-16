import React, { useState } from "react";
import { Input } from "~/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";

interface MM1NFormProps {
  onCalculate: (params: MM1NParams) => void;
}

export interface MM1NParams {
  lambda: number;
  mu: number;
  N: number;
}

export default function MM1NForm({ onCalculate }: MM1NFormProps) {
  const [lambda, setLambda] = useState<number | undefined>(undefined);
  const [mu, setMu] = useState<number | undefined>(undefined);
  const [N, setN] = useState<number | undefined>(undefined);
  const [error, setError] = useState<string>("");

  const isValid = () => {
    if (lambda === undefined || mu === undefined || N === undefined)
      return false;
    if (lambda <= 0 || mu <= 0 || N <= 0) return false;
    if (mu <= lambda) return false;
    return true;
  };

  function validate(lambdaVal?: number, muVal?: number, NVal?: number) {
    if (lambdaVal === undefined || muVal === undefined || NVal === undefined) {
      setError("Todos los campos son requeridos.");
      return;
    }
    if (lambdaVal <= 0 || muVal <= 0 || NVal <= 0) {
      setError("Los valores deben ser mayores que cero.");
      return;
    }
    if (muVal <= lambdaVal) {
      setError("La tasa de servicio debe ser mayor que la tasa de llegada.");
      return;
    }
    setError("");
  }

  const handleChangeLambda = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? undefined : Number(e.target.value);
    setLambda(value);
    validate(value, mu, N);
  };

  const handleChangeMu = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? undefined : Number(e.target.value);
    setMu(value);
    validate(lambda, value, N);
  };

  const handleChangeN = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value === "" ? undefined : Number(e.target.value);
    setN(value);
    validate(lambda, mu, value);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid()) return;
    onCalculate({ lambda: lambda!, mu: mu!, N: N! });
  };

  return (
    <form className="flex flex-col items-center w-full" onSubmit={handleSubmit}>
      <div className="flex gap-6 justify-center w-full">
        <Card className="w-80 flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Tasa de Llegada (λ)</CardTitle>
            <CardDescription>
              Número promedio de llegadas por unidad de tiempo
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 flex items-center h-16">
            <Input
              type="number"
              step="0.0001"
              min="0"
              value={lambda === undefined ? "" : lambda}
              onChange={handleChangeLambda}
              className="mt-1"
              placeholder="Ej: 4.5"
              required
            />
          </CardContent>
        </Card>
        <Card className="w-80 flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Tasa de Servicio (μ)</CardTitle>
            <CardDescription>
              Número promedio de servicios por unidad de tiempo
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 flex items-center h-16">
            <Input
              type="number"
              step="0.0001"
              min="0"
              value={mu === undefined ? "" : mu}
              onChange={handleChangeMu}
              className="mt-1"
              placeholder="Ej: 5.0"
              required
            />
          </CardContent>
        </Card>
        <Card className="w-80 flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Capacidad Máxima del Sistema (N)</CardTitle>
            <CardDescription>
              Número máximo de clientes en el sistema (incluyendo el que está
              siendo atendido)
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0 flex items-center h-16">
            <Input
              type="number"
              step="1"
              min="1"
              value={N === undefined ? "" : N}
              onChange={handleChangeN}
              className="mt-1"
              placeholder="Ej: 10"
              required
            />
          </CardContent>
        </Card>
      </div>
      {error && <div className="text-red-600 font-semibold mt-4">{error}</div>}
      <Button
        type="submit"
        className="mt-6 w-[60rem] bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded shadow font-semibold"
        disabled={!isValid()}
        variant="default"
      >
        Calcular
      </Button>
    </form>
  );
}
