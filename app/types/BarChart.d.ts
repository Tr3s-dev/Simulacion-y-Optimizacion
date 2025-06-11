// BarChart props type definition
import { ReactNode } from "react";
import { ChartConfig } from "~/components/ui/chart";

export interface MonthsBarChart {
  month: string;
  sales: number;
}

export interface MonthsBarChartConfig {
  sales: {
    label: string;
    color: string;
  };
}

export interface BarCharTypes {
  description: string;
  icon: ReactNode;
  data: MonthsBarChart[];
  config: ChartConfig;
}
