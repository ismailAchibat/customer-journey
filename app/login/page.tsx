"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useUserStore } from "@/hooks/use-user-store";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setUser, setOrganizationId } = useUserStore();
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      console.log("Login response data:", data);

      if (!response.ok) {
        throw new Error(data.message || "Failed to login");
      }

      setUser(data.user);
      setOrganizationId(data.user.organisationId);
      router.push("/dashboard");
    } catch (err) {
      const error = err as Error;
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* === Section gauche (bleue) === */}
      <div className="hidden lg:flex w-1/2 bg-[#5A8DEE] text-white items-center justify-center">
        <div className="max-w-md text-center p-10">
          {/* Logo */}
          <div className="flex justify-center items-center mb-8">
            <div className="flex items-center gap-2">
              <div className="bg-white rounded-md p-2">
                <Image
                  src="/logo.svg"
                  alt="Logo Woorkroom"
                  width={30}
                  height={30}
                />
              </div>
              <span className="text-2xl font-semibold">Woorkroom</span>
            </div>
          </div>

          {/* Texte principal */}
          <h1 className="text-3xl font-bold mb-3">Votre espace de travail</h1>
          <p className="text-xl font-medium">Planifiez. Créez. Contrôlez.</p>

          {/* Illustration */}
          <div className="mt-10">
            <Image
              src="/illustration-login.png"
              alt="Illustration de connexion"
              width={400}
              height={300}
              priority
            />
          </div>
        </div>
      </div>

      {/* === Section droite (formulaire) === */}
      <div className="flex w-full lg:w-1/2 bg-white items-center justify-center">
        <div className="w-full max-w-md px-8 py-12">
          <h2 className="text-2xl font-semibold text-gray-900 text-center mb-8">
            Connexion à Woorkroom
          </h2>

          <form className="space-y-5" onSubmit={handleSubmit}>
            {/* Email */}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Adresse e-mail
              </label>
              <Input
                name="email"
                type="email"
                placeholder="votreemail@gmail.com"
                className="border-gray-300"
                required
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Mot de passe
              </label>
              <div className="relative">
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="border-gray-300 pr-10"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-2.5 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <EyeOff className="h-5 w-5" />
                  ) : (
                    <Eye className="h-5 w-5" />
                  )}
                </button>
              </div>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}

            {/* Options */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="accent-blue-600" />
                Se souvenir de moi
              </label>
              <Link href="#" className="text-blue-600 hover:underline">
                Mot de passe oublié ?
              </Link>
            </div>

            {/* Bouton connexion */}
            <Button
              type="submit"
              className="w-full bg-[#5A8DEE] hover:bg-[#4E73DF] text-white"
              disabled={loading}
            >
              {loading ? "Connexion..." : "Se connecter →"}
            </Button>

            {/* Lien inscription */}
            <p className="text-center text-sm text-gray-600 mt-4">
              Vous n’avez pas encore de compte ?{" "}
              <Link href="/register" className="text-blue-600 hover:underline">
                Inscrivez-vous
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
