"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex min-h-screen">
      {/* === Section gauche (bleue) === */}
      <div className="hidden lg:flex w-1/2 bg-blue-600 text-white items-center justify-center">
        <div className="max-w-md text-center p-10">
          {/* Logo */}
          <div className="flex justify-center items-center mb-8">
            <div className="flex items-center gap-2">
              <div className="bg-white rounded-md p-2">
                <Image
                  src="/logo.svg"
                  alt="Woorkroom Logo"
                  width={30}
                  height={30}
                />
              </div>
              <span className="text-2xl font-semibold">Woorkroom</span>
            </div>
          </div>

          {/* Texte principal */}
          <h1 className="text-3xl font-bold mb-3">Your place to work</h1>
          <p className="text-xl font-medium">Plan. Create. Control.</p>

          {/* Illustration */}
          <div className="mt-10">
            <Image
              src="/illustration-login.svg"
              alt="Login Illustration"
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
            Sign In to Woorkroom
          </h2>

          <form className="space-y-5">
            {/* Email */}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Email Address
              </label>
              <Input
                type="email"
                placeholder="youremail@gmail.com"
                className="border-gray-300"
              />
            </div>

            {/* Password */}
            <div>
              <label className="text-sm text-gray-600 mb-1 block">
                Password
              </label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  className="border-gray-300 pr-10"
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

            {/* Options */}
            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-gray-600">
                <input type="checkbox" className="accent-blue-600" />
                Remember me
              </label>
              <Link href="#" className="text-blue-600 hover:underline">
                Forgot Password?
              </Link>
            </div>

            {/* Bouton connexion */}
            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              Sign In →
            </Button>

            {/* Lien inscription */}
            <p className="text-center text-sm text-gray-600 mt-4">
              Don’t have an account?{" "}
              <Link href="/register" className="text-blue-600 hover:underline">
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
