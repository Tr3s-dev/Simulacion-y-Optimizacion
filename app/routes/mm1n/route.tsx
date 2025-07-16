// React Core Imports
import { useEffect, useState } from "react";

// Remix Core Imports
import { MetaFunction, useLoaderData } from "@remix-run/react";
import { ActionFunctionArgs, LoaderFunctionArgs } from "@remix-run/node";

// App Components Imports
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import AppLayout from "~/components/layouts/AppLayout";
import { Separator } from "~/components/ui/separator";
import { Button } from "~/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import BarChart from "~/components/commons/BarChart";
import { MonthsBarChart } from "~/types/BarChart";
import { ChartConfig } from "~/components/ui/chart";
import RecentCustomerList from "~/components/commons/RecentCustomerList";
import { useToast } from "~/hooks/use-toast";
import { Sidebar } from "lucide-react";
import { user } from "~/services/auth.server";
import MM1NForm, { MM1NParams } from "~/components/commons/MM1NForm";
import MM1NResultsDisplay, {
  calculateMM1N,
  MM1NResults,
} from "~/components/commons/MM1NResultsDisplay";
import MM1Form, { MM1Params } from "~/components/commons/MM1Form";
import MM1ResultsDisplay, {
  calculateMM1,
  MM1Results,
} from "~/components/commons/MM1ResultsDisplay";
import MMCForm, { MMCParams } from "~/components/commons/MMCForm";
import MMCNForm, { MMCNParams } from "~/components/commons/MMCNForm";
import MMCResultsDisplay from "~/components/commons/MMCResultsDisplay";
import MMCNResultsDisplay from "~/components/commons/MMCNResultsDisplay";
import { calculateMMCN } from "~/lib/mmcnModel";

// Server Imports

// Layout Metadata
export const meta: MetaFunction = () => {
  return [
    { title: "2G Producciones" },
    { name: "description", content: "Sistema de Gestión 2G Producciones" },
  ];
};

export default function Index() {
  const data = {
    sidebar: [
      {
        type: 1,
        label: "Modelo de un servidor",
        route: "/",
        icon: 1,
      },
      {
        type: 1,
        label: "Modelo de varios servidores",
        route: "/mm1n",
        icon: 2,
      },
      {
        type: 1,
        label: "Simulación de montecarlo",
        route: "/montecarlo",
        icon: 3,
      },
      {
        type: 1,
        label: "Simulación",
        route: "/simulation",
        icon: 4,
      },
    ],
  };

  const [mmcnResults, setMMCNResults] = useState<any | null>(null);
  const [mmcResults, setMMCResults] = useState<MMCParams | null>(null);

  function handleCalculateMMCN(params: MMCNParams) {
    const results = calculateMMCN(params);
    setMMCNResults(results);
  }

  function handleCalculateMMC(params: MMCParams) {
    setMMCResults(params);
    // Aquí iría la función de cálculo real para M/M/c
  }

  return (
    <AppLayout
      breadCrumbPath={[{ href: "/mm1n", text: "Modelo de varios servidores" }]}
      sidebarOptions={data.sidebar}
    >
      <div className="flex flex-col flex-1 space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">
            Modelo de varios servidores (M/M/c/N)
          </h2>
        </div>
        <Tabs defaultValue="with_limits" className="space-y-4">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="with_limits">Con limite de cola</TabsTrigger>
            <TabsTrigger value="without_limits">Sin limite de cola</TabsTrigger>
          </TabsList>
          <Separator />
          <TabsContent value="with_limits" className="space-y-4">
            <MMCNForm onCalculate={handleCalculateMMCN} />
            {mmcnResults && <MMCNResultsDisplay results={mmcnResults} />}
          </TabsContent>
          <TabsContent value="without_limits" className="space-y-4">
            <MMCForm onCalculate={handleCalculateMMC} />
            {mmcResults && <MMCResultsDisplay params={mmcResults} />}
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
