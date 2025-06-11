// Types Import
import { RecentCustomerListProps } from "~/types/RecentCustomerList";

// Components Imports
import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription,
} from "../ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "../ui/avatar";

export default function RecentCustomerList({
  title,
  description,
  data,
}: RecentCustomerListProps) {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col flex-1 gap-5">
        {data.map((item: any) => {
          return (
            <div className="flex w-full gap-3">
              <div>
                <Avatar>
                  <AvatarImage src={item.img} />
                  <AvatarFallback>{item.name.at(0)}</AvatarFallback>
                </Avatar>
              </div>
              <div className="grow">
                <p className="text-sm font-bold">{item.name}</p>
                <p className="text-xs text-muted-foreground">{item.email}</p>
              </div>
              <div className="flex justify-end text-lg font-bold grow">
                {Intl.NumberFormat("es-VE", {
                  currency: "USD",
                  style: "currency",
                  currencyDisplay: "narrowSymbol",
                }).format(parseInt(item.amount))}
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
