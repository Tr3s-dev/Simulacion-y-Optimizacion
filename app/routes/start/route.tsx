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

// Server Imports
import { requireAdmin, requireAuth, user } from "~/services/auth.server";

// Layout Metadata
export const meta: MetaFunction = () => {
  return [
    { title: "2G Producciones" },
    { name: "description", content: "Sistema de Gestión 2G Producciones" },
  ];
};

export async function loader({ request }: LoaderFunctionArgs) {
  // Require auth for redirect to login if user has no login.
  // Require admin for protect route to access only admin users.
  // await requireAuth({ request });
  // await requireAdmin({ request });

  // const u = await user({ request });
  const u = {
    user: {
      name: "User",
    },
    role: "Role",
  };

  // const sidebar = await getSidebar({ request });
  const sidebar = "[]";

  return {
    sidebar,
    user: {
      ...u.user,
      role: u.role,
    },
  };
}

export async function action({ request }: ActionFunctionArgs) {
  return null;
}

export default function Index() {
  const data = useLoaderData<any>();

  const { toast } = useToast();

  const barChartData: MonthsBarChart[] = [
    { month: "Ene", sales: 1500 },
    { month: "Feb", sales: 750 },
    { month: "Mar", sales: 1350 },
    { month: "Abr", sales: 1110 },
    { month: "May", sales: 1010 },
    { month: "Jun", sales: 1740 },
    { month: "Jul", sales: 1230 },
    { month: "Ago", sales: 1800 },
    { month: "Sep", sales: 1400 },
    { month: "Oct", sales: 1220 },
    { month: "Nov", sales: 1050 },
    { month: "Dic", sales: 1230 },
  ];

  const chartConfig = {
    sales: {
      label: "Ventas",
      color: "#2563eb",
    },
  } satisfies ChartConfig;

  const recentCustomerListData = [
    {
      img: "",
      name: "Customer",
      email: "customer@gmail.com",
      amount: "+$4999.00",
    },
  ];

  return (
    <AppLayout
      breadCrumbPath={[{ href: "/start", text: "Inicio" }]}
      sidebarOptions={data.sidebar}
      userData={data.user}
    >
      <div className="flex flex-col flex-1 space-y-2">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-3xl font-bold tracking-tight">Inicio</h2>
        </div>
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="overview">General</TabsTrigger>
            <TabsTrigger value="reports">Reportes</TabsTrigger>
          </TabsList>
          <Separator />
          <TabsContent value="overview" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    Ingreso Mensual
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 text-muted-foreground"
                  >
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {Intl.NumberFormat("es-VE", {
                      currency: "USD",
                      style: "currency",
                      currencyDisplay: "narrowSymbol",
                    }).format(20000)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {"+20% que el mes pasado"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    Nuevos Clientes
                  </CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 text-muted-foreground"
                  >
                    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+{10}</div>
                  <p className="text-xs text-muted-foreground">
                    {"+5% que el mes pasado"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-x-0">
                  <CardTitle className="text-sm font-medium">Eventos</CardTitle>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    className="w-4 h-4 text-muted-foreground"
                  >
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <path d="M2 10h20" />
                  </svg>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">+{"5"}</div>
                  <p className="text-xs text-muted-foreground">
                    {"+10% que el mes pasado"}
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-sm font-medium">
                    Pendientes
                  </CardTitle>
                  <div className="w-2 h-2 rounded-full bg-muted-foreground/60"></div>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{"5"}</div>
                  <p className="text-xs text-muted-foreground">
                    {"Eventos Pendientes"}
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-4">
                <BarChart
                  description={`Ventas Mensuales ${new Date().getFullYear()}`}
                  icon={<></>}
                  data={barChartData}
                  config={chartConfig}
                />
              </div>
              <div className="col-span-3">
                <RecentCustomerList
                  title="Ventas Recientes"
                  description={"Month Sales"}
                  data={recentCustomerListData}
                />
              </div>
            </div>
          </TabsContent>
          <TabsContent value={"reports"}>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-lg font-medium">Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Lorem Ipsum
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button>Generar</Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-lg font-medium">Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Lorem Ipsum
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button>Generar</Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-lg font-medium">Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Lorem Ipsum
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button>Generar</Button>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                  <CardTitle className="text-lg font-medium">Report</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-sm text-muted-foreground">
                    Lorem Ipsum
                  </div>
                  <div className="flex justify-end mt-4">
                    <Button>Generar</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </AppLayout>
  );
}
