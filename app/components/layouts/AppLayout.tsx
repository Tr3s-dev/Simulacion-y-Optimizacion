// Remix Core Imports
import { MetaFunction, Link } from "@remix-run/react";

// App Components Imports
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import AppSidebar from "../commons/AppSidebar";
import { Separator } from "../ui/separator";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { Toaster } from "../ui/toaster";

// Layout Metadata
export const meta: MetaFunction = () => {
  return [
    { title: "2G Producciones" },
    { name: "description", content: "Sistema de Gestión 2G Producciones" },
  ];
};

export default function AppLayout({
  breadCrumbPath,
  children,
  sidebarOptions,
  userData,
}: {
  breadCrumbPath: { text: string; href: string }[];
  children: React.ReactNode;
  sidebarOptions: any;
  userData: any;
}) {
  return (
    <SidebarProvider>
      <AppSidebar sidebarOptions={sidebarOptions} userData={userData} />
      <div className="bg-[#fafafa] w-full h-screen p-0 lg:p-3">
        <main
          style={{ boxShadow: "inset 0 0 10px rgba(220,220,220,1)" }}
          className="grid grid-cols-1 grid-rows-[auto_1fr_auto] w-full h-full overflow-y-auto p-5 gap-4 bg-background rounded-xl bg-center"
        >
          <div className="flex items-center justify-between bg-background w-full h-6 gap-3">
            <div className="flex items-center justify-start h-full gap-3">
              <SidebarTrigger />
              <Separator orientation="vertical" />
              <Breadcrumb className={"hidden lg:inline"}>
                <BreadcrumbList>
                  {breadCrumbPath.map((path, index) => {
                    return (
                      <BreadcrumbItem key={index}>
                        {index > 0 ? <BreadcrumbSeparator /> : null}
                        <BreadcrumbLink href={path.href}>
                          {path.text}
                        </BreadcrumbLink>
                      </BreadcrumbItem>
                    );
                  })}
                </BreadcrumbList>
              </Breadcrumb>
            </div>
            <div className="flex h-full font-bold gap-2">
              <img
                src="/favicon.ico"
                alt="2G Admin"
                className="h-full rounded-sm"
              />
              System Name
            </div>
          </div>
          <div>{children}</div>
          <Separator />
          <div className="flex justify-between w-full">
            <span className="text-xs text-muted-foreground">
              &copy; Company - {new Date().getFullYear()}
            </span>
            <span className="text-xs text-muted-foreground hover:underline">
              <Link target="new" to={"https://www.company.com"}>
                www.company.com
              </Link>
            </span>
          </div>
          <Toaster />
        </main>
      </div>
    </SidebarProvider>
  );
}
