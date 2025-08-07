import { Typography } from "@/components/ui/Typography";

export function LoginHeader() {
  return (
    <div className="text-center mb-8">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full mb-6">
        <span className="text-white text-2xl font-bold">🎮</span>
      </div>
      <Typography variant="h1" className="mb-2">
        Bem-vindo de volta!
      </Typography>
      <Typography variant="p">
        Entre na sua conta para continuar analisando suas hunts do Tibia
      </Typography>
    </div>
  );
}