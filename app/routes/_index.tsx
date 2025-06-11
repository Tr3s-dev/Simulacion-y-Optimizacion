// React Core Imports
import { useState } from "react";
import { useNavigate } from "@remix-run/react";

// Remix Core Imports
import type {
  MetaFunction,
  ActionFunctionArgs,
  LoaderFunctionArgs,
} from "@remix-run/node";
import { Form, redirect, useActionData } from "@remix-run/react";
import { Eye, EyeOff } from "lucide-react";

// App Components Imports
import LoginLayout from "~/components/layouts/LoginLayout";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { login, requireGuest } from "~/services/auth.server";

// Page Metadata
export const meta: MetaFunction = () => {
  return [
    { title: "2G Producciones - Acceso" },
    { name: "description", content: "Sistema de Gestión 2G Producciones" },
  ];
};

export async function loader({ request, params }: LoaderFunctionArgs) {
  // Require guest for redirect to start page when user has login.
  // await requireGuest({ request });

  return null;
}

export async function action({ request }: ActionFunctionArgs) {
  // Require guest for redirect to start page when user has login.
  // await requireGuest({ request });

  // Set form data to send to api.
  let formData = await request.formData();
  let email = formData.get("email");
  let password = formData.get("password");

  // Get errors or redirector in error case.
  // let { errors, redirector } = await login({ request, email, password });

  return redirect("/start");

  // Return corresponding.
  // return errors || redirector;
}

// Main component.
export default function Index() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  let errors = useActionData<any | null>();

  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };
  return (
    <LoginLayout>
      <div className="w-screen h-screen overflow-hidden grid grid-cols-1 lg:grid-cols-12">
        <div
          style={{
            boxShadow: "inset -100px 0 50px -50px rgba(255,255,255,1)",
          }}
          className={`overflow-hidden bg-[url('/login-image.jpg')] bg-center bg-cover bg-gray-400 col-span-7`}
        >
          <div className="flex items-center justify-start w-full h-48 ps-10">
            <img
              src="/company-logo.png"
              className="h-full"
              alt="Company Logo"
            />
          </div>
        </div>
        <div className="h-full flex flex-col justify-between items-center bg-white col-span-5">
          <div className="h-1/3 w-full flex justify-center">
            <img
              src="/system-logo.png"
              className="contrast-200 blur-[1px] h-full"
              alt="System Logo"
            />
          </div>
          <Form
            method="POST"
            autoComplete="off"
            className="h-1/3 w-full flex justify-center"
          >
            <div className="h-full flex flex-col items-center justify-center space-y-4 min-w-[320px] max-w-[320px]">
              <div className="flex flex-col items-center w-full space-y-1">
                <span className="text-2xl font-bold">Iniciar Sesión</span>
                <span className="w-full text-sm text-center text-muted-foreground">
                  Usa tus crecenciales para acceder
                </span>
              </div>
              <div className="flex flex-col w-full space-y-4">
                <div>
                  <Label htmlFor="email">Correo Electrónico</Label>
                  <Input
                    id="email"
                    type="email"
                    name="email"
                    placeholder="correo@electronico.com"
                    className="mt-2"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="password">Contraseña</Label>
                  <div className="flex items-center justify-end mt-2">
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder=""
                      className="w-full"
                      required
                    />
                    <Button
                      className="absolute"
                      type="button"
                      variant="link"
                      onClick={handleShowPassword}
                    >
                      {showPassword ? <Eye /> : <EyeOff />}
                    </Button>
                  </div>
                </div>
                <Button
                  type="submit"
                  onClick={() => {
                    navigate("/start");
                  }}
                >
                  Acceder
                </Button>
                <div className="flex items-center justify-center w-full text-center">
                  <div className="flex items-center justify-center w-full text-sm text-center text-muted-foreground">
                    {errors ? (
                      <span className="text-muted-foreground">{errors}</span>
                    ) : (
                      <span className="text-black/0 select-none">a</span>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </Form>
          <div className="h-1/3 w-full"></div>
        </div>
      </div>
    </LoginLayout>
  );
}
