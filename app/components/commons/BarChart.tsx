import {
  Bar,
  BarChart as ReBarChart,
  CartesianGrid,
  LabelList,
  XAxis,
} from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "../ui/chart";
import { BarCharTypes } from "~/types/BarChart";

export default function BarChart({
  description,
  icon,
  data,
  config,
}: BarCharTypes) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">{description}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={config} className="min-h-[200px] w-full">
          <ReBarChart accessibilityLayer data={data}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <Bar dataKey="sales" fill="#87CEEB" radius={4}>
              <LabelList
                position="outside"
                offset={12}
                className="fill-white hidden lg:inline text-[10px]"
                fontSize={12}
                formatter={(value: any) =>
                  Intl.NumberFormat("es-VE", {
                    currency: "USD",
                    style: "currency",
                    currencyDisplay: "narrowSymbol",
                  }).format(parseInt(value))
                }
              />
            </Bar>
          </ReBarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
