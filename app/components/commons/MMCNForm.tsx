import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

export interface MMCNParams {
  lambda: number;
  mu: number;
  servers: number;
  N: number;
}

interface MMCNFormProps {
  onCalculate: (params: MMCNParams) => void;
}

const MMCNForm: React.FC<MMCNFormProps> = ({ onCalculate }) => {
  const [lambda, setLambda] = useState("");
  const [mu, setMu] = useState("");
  const [servers, setServers] = useState("");
  const [N, setN] = useState("");
  const [error, setError] = useState("");

  function isValid() {
    if (!lambda || !mu || !servers || !N) return false;
    const lambdaNum = parseFloat(lambda);
    const muNum = parseFloat(mu);
    const serversNum = parseInt(servers);
    const NNum = parseInt(N);
    if (isNaN(lambdaNum) || isNaN(muNum) || isNaN(serversNum) || isNaN(NNum))
      return false;
    if (lambdaNum <= 0 || muNum <= 0 || serversNum <= 0 || NNum <= 0)
      return false;
    if (muNum <= lambdaNum / serversNum) return false;
    return true;
  }

  function handleChangeLambda(e: React.ChangeEvent<HTMLInputElement>) {
    setLambda(e.target.value);
    validate(e.target.value, mu, servers, N);
  }

  function handleChangeMu(e: React.ChangeEvent<HTMLInputElement>) {
    setMu(e.target.value);
    validate(lambda, e.target.value, servers, N);
  }

  function handleChangeServers(e: React.ChangeEvent<HTMLInputElement>) {
    setServers(e.target.value);
    validate(lambda, mu, e.target.value, N);
  }

  function handleChangeN(e: React.ChangeEvent<HTMLInputElement>) {
    setN(e.target.value);
    validate(lambda, mu, servers, e.target.value);
  }

  function validate(
    lambdaVal: string,
    muVal: string,
    serversVal: string,
    NVal: string
  ) {
    if (!lambdaVal || !muVal || !serversVal || !NVal) {
      setError("Todos los campos son requeridos.");
      return;
    }
    const lambdaNum = parseFloat(lambdaVal);
    const muNum = parseFloat(muVal);
    const serversNum = parseInt(serversVal);
    const NNum = parseInt(NVal);
    if (isNaN(lambdaNum) || isNaN(muNum) || isNaN(serversNum) || isNaN(NNum)) {
      setError("Ingrese valores numéricos válidos.");
      return;
    }
    if (lambdaNum <= 0 || muNum <= 0 || serversNum <= 0 || NNum <= 0) {
      setError("Los valores deben ser mayores que cero.");
      return;
    }
    if (muNum <= lambdaNum / serversNum) {
      setError(
        "La tasa de servicio por servidor debe ser mayor que la tasa de llegada por servidor."
      );
      return;
    }
    setError("");
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!isValid()) return;
    onCalculate({
      lambda: parseFloat(lambda),
      mu: parseFloat(mu),
      servers: parseInt(servers),
      N: parseInt(N),
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-center w-full">
      <div className="flex gap-6 justify-center w-full">
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
            <div className="text-sm mt-2">
              Número promedio de llegadas por unidad de tiempo
            </div>
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
            <div className="text-sm mt-2">
              Número promedio de servicios por unidad de tiempo
            </div>
          </CardContent>
        </Card>
        <Card className="w-80 flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Número de Servidores (c)</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              step="1"
              min="1"
              placeholder="Ej: 2"
              value={servers}
              onChange={handleChangeServers}
            />
            <div className="text-sm mt-2">
              Cantidad de servidores en el sistema
            </div>
          </CardContent>
        </Card>
        <Card className="w-80 flex flex-col justify-between">
          <CardHeader>
            <CardTitle>Capacidad Máxima del Sistema (N)</CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="number"
              step="1"
              min="1"
              placeholder="Ej: 10"
              value={N}
              onChange={handleChangeN}
            />
            <div className="text-sm mt-2">
              Número máximo de clientes en el sistema
            </div>
          </CardContent>
        </Card>
      </div>
      {error && <div className="text-red-600 font-semibold mt-4">{error}</div>}
      <Button
        type="submit"
        className="mt-6 bg-blue-600 hover:bg-blue-800 w-[60rem]"
        disabled={!isValid()}
        variant="default"
      >
        Calcular
      </Button>
    </form>
  );
};

export default MMCNForm;
