// Remix Core Imports
import { MetaFunction } from "@remix-run/react";

// Layout Metadata
export const meta: MetaFunction = () => {
  return [
    { title: "2G Producciones - Acceso" },
    { name: "description", content: "Sistema de Gestión 2G Producciones" },
  ];
};

export default function LoginLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-center w-screen h-screen bg-neutral-900">
      {children}
    </div>
  );
}
