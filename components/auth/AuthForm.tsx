/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { authService } from "@/services/auth.service";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Card";

const loginSchema = z.object({
  email: z.string().email("Email inválido"),
  password: z.string().min(6, "A senha deve ter pelo menos 6 caracteres"),
});

const signUpSchema = loginSchema
  .extend({
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
  });

type LoginFormData = z.infer<typeof loginSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;

interface AuthFormProps {
  mode: "login" | "signup";
}

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData | SignUpFormData>({
    resolver: zodResolver(mode === "login" ? loginSchema : signUpSchema),
  });

  const onSubmit = async (data: LoginFormData | SignUpFormData) => {
    setIsLoading(true);
    setError(null);

    try {
      if (mode === "login") {
        await authService.signInWithEmail(data as LoginFormData);
      } else {
        await authService.signUp(data as SignUpFormData);
      }
      router.push("/home");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro");
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await authService.signInWithGoogle();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Ocorreu um erro");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md">
      <h2 className="text-2xl font-bold text-center mb-6">
        {mode === "login" ? "Login" : "Cadastro"}
      </h2>

      {error && (
        <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input
          {...register("email")}
          type="email"
          label="Email"
          placeholder="seu@email.com"
          error={errors.email?.message}
        />

        <Input
          {...register("password")}
          type="password"
          label="Senha"
          placeholder="••••••••"
          error={errors.password?.message}
        />

        {mode === "signup" && (
          <Input
            {...register("confirmPassword" as any)}
            type="password"
            label="Confirmar Senha"
            placeholder="••••••••"
            error={(errors as any).confirmPassword?.message}
          />
        )}

        <Button type="submit" fullWidth disabled={isLoading}>
          {isLoading
            ? "Carregando..."
            : mode === "login"
            ? "Entrar"
            : "Cadastrar"}
        </Button>
      </form>

      {mode === "login" && (
        <>
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">Ou</span>
            </div>
          </div>

          <Button
            onClick={handleGoogleSignIn}
            variant="secondary"
            fullWidth
            disabled={isLoading}
          >
            Entrar com Google
          </Button>
        </>
      )}

      <div className="mt-6 text-center">
        <p className="text-sm text-gray-600">
          {mode === "login" ? "Não tem uma conta?" : "Já tem uma conta?"}{" "}
          <a
            href={mode === "login" ? "/signup" : "/login"}
            className="text-blue-600 hover:underline"
          >
            {mode === "login" ? "Cadastre-se" : "Faça login"}
          </a>
        </p>
      </div>
    </Card>
  );
}
