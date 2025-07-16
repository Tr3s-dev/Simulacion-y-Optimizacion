import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export interface MM1Params {
  lambda: number;
  mu: number;
}

interface MM1FormProps {
  onCalculate: (params: MM1Params) => void;
}

const MM1Form: React.FC<MM1FormProps> = ({ onCalculate }) => {
  const [lambda, setLambda] = useState("");
  const [mu, setMu] = useState("");
  const [error, setError] = useState<string>("");

  const isValid = () => {
    if (!lambda || !mu) return false;
    const lambdaNum = parseFloat(lambda);
    const muNum = parseFloat(mu);
    if (isNaN(lambdaNum) || isNaN(muNum)) return false;
    if (lambdaNum <= 0 || muNum <= 0) return false;
    if (muNum <= lambdaNum) return false;
    return true;
  };

  function handleChangeLambda(e: React.ChangeEvent<HTMLInputElement>) {
    setLambda(e.target.value);
    validate(e.target.value, mu);
  }

  function handleChangeMu(e: React.ChangeEvent<HTMLInputElement>) {
    setMu(e.target.value);
    validate(lambda, e.target.value);
  }

  function validate(lambdaVal: string, muVal: string) {
    if (!lambdaVal || !muVal) {
      setError("Todos los campos son requeridos.");
      return;
    }
    const lambdaNum = parseFloat(lambdaVal);
    const muNum = parseFloat(muVal);
    if (isNaN(lambdaNum) || isNaN(muNum)) {
      setError("Ingrese valores numéricos válidos.");
      return;
    }
    if (lambdaNum <= 0 || muNum <= 0) {
      setError("Los valores deben ser mayores que cero.");
      return;
    }
    if (muNum <= lambdaNum) {
      setError("La tasa de servicio debe ser mayor que la tasa de llegada.");
      return;
    }
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid()) return;
    onCalculate({ lambda: parseFloat(lambda), mu: parseFloat(mu) });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
      <div className="flex gap-6 justify-center w-full">
        <Card className="w-80 flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Tasa de Llegada (lambda)</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              step="any"
              placeholder="Ej: 5.2"
              value={lambda}
              onChange={handleChangeLambda}
            />
            <div className="text-sm mt-2">
              Número promedio de llegadas por unidad de tiempo
            </div>
          </CardContent>
        </Card>
        <Card className="w-80 flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Tasa de Servicio (mu)</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              step="any"
              placeholder="Ej: 6.0"
              value={mu}
              onChange={handleChangeMu}
            />
            <div className="text-sm mt-2">
              Número promedio de servicios por unidad de tiempo
            </div>
          </CardContent>
        </Card>
      </div>
      {error && <div className="text-red-600 font-semibold mt-4">{error}</div>}
      <Button
        type="submit"
        className="mt-6 w-[40rem] bg-blue-600 hover:bg-blue-800 text-white px-4 py-2 rounded shadow font-semibold"
        disabled={!isValid()}
        variant="default"
      >
        Calcular
      </Button>
    </form>
  );
};

export default MM1Form;
