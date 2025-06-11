// Remix Core Imports
import { Link, useLoaderData } from "@remix-run/react";
import { useFetcher } from "@remix-run/react";
import { useNavigate } from "@remix-run/react";

// App Components Imports
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarGroupContent,
} from "../ui/sidebar";
import { Separator } from "../ui/separator";
import CollapsibleMenuItem from "../commons/CollapsibleMenuItem";

// Icons Imports
import {
  Calendar,
  Home,
  LogOutIcon,
  UserCircleIcon,
  Boxes,
  Info,
  Settings,
  CalendarCheck,
  CalendarClock,
  Clipboard,
  ClipboardList,
  ClipboardCheck,
  DollarSignIcon,
  HelpCircleIcon,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Skeleton } from "~/components/ui/skeleton";

const icons = [
  <Calendar />,
  <Home />,
  <Boxes />,
  <Info />,
  <Settings />,
  <CalendarCheck />,
  <CalendarClock />,
  <DollarSignIcon />,
  <HelpCircleIcon />,
  <ClipboardList />,
  <ClipboardCheck />,
  <Clipboard />,
  <Info />,
];

export default function AppSidebar({
  sidebarOptions,
  userData,
}: {
  sidebarOptions: any;
  userData: any;
}) {
  const navigate = useNavigate();
  const fetcher = useFetcher();
  const [loading, setLoading] = useState<any>(false);

  const handleLogout = () => {
    fetcher.submit(null, {
      method: "DELETE",
      action: "/api/logout",
    });
  };

  return loading ? (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton disabled className="flex h-12 gap-3 text-nowrap">
              <UserCircleIcon />
              <Skeleton className="w-full h-6" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <Separator />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton disabled className="text-nowrap">
                  <Skeleton className={"w-4 h-4 rounded-full"} />
                  <Skeleton className="w-full h-4" />
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton disabled className="text-nowrap">
                  <Skeleton className={"w-4 h-4 rounded-full"} />
                  <Skeleton className="w-full h-4" />
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton disabled className="text-nowrap">
                  <Skeleton className={"w-4 h-4 rounded-full"} />
                  <Skeleton className="w-full h-4" />
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton disabled className="text-nowrap">
                  <Skeleton className={"w-4 h-4 rounded-full"} />
                  <Skeleton className="w-full h-4" />
                </SidebarMenuButton>
              </SidebarMenuItem>
              <SidebarMenuItem>
                <SidebarMenuButton disabled className="text-nowrap">
                  <Skeleton className={"w-4 h-4 rounded-full"} />
                  <Skeleton className="w-full h-4" />
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  ) : (
    <Sidebar collapsible="icon" variant="inset">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton className="flex h-12 gap-3 text-nowrap">
              <UserCircleIcon />
              <div className="flex flex-col">
                <span className="text-sm font-bold">{userData.name}</span>
                <span className="text-xs font-light text-gray-400">
                  {userData.role}
                </span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
        <Separator />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {JSON.parse(sidebarOptions).map((option: any) => {
                if (option.type === 1) {
                  return (
                    <SidebarMenuItem>
                      <Link to={option.route}>
                        <SidebarMenuButton className="text-nowrap">
                          {icons[option.icon]} <span>{option.label}</span>
                        </SidebarMenuButton>
                      </Link>
                    </SidebarMenuItem>
                  );
                } else if (option.type === 2) {
                  return (
                    <CollapsibleMenuItem
                      triggerText={option.label}
                      triggerIcon={icons[option.icon]}
                      elements={option.options.map((opt: any) => ({
                        icon: icons[opt.icon],
                        text: opt.label,
                        href: opt.route,
                      }))}
                    />
                  );
                }
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      <SidebarFooter>
        <Separator />
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              type="submit"
              className="flex items-center justify-start font-bold text-nowrap"
              onClick={() => {
                navigate("/");
              }}
            >
              <LogOutIcon className="rotate-180" />
              Salir
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
