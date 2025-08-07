import { AuthForm } from "@/components/auth/AuthForm";
import { LoginHeader } from "@/components/auth/LoginHeader";
import { LoginNavigation } from "@/components/auth/LoginNavigation";
import { FeatureList } from "@/components/auth/FeatureList";
import { LoginPageLayout } from "@/components/auth/LoginPageLayout";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Login",
  description: "Entre na sua conta Hunt Compare para gerenciar seus registros de hunt do Tibia e acompanhar suas estatísticas de jogo.",
  path: "/login"
});

export default function LoginPage() {
  return (
    <LoginPageLayout>
      <LoginHeader />
      <AuthForm />
      <LoginNavigation />
      <FeatureList />
    </LoginPageLayout>
  );
}
