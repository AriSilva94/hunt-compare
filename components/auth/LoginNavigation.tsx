import { Typography } from "@/components/ui/Typography";
import Link from "next/link";

const navigationLinks = [
  { href: "/", label: "← Voltar ao início" },
  { href: "/registros-publicos", label: "Ver registros públicos" },
] as const;

export function LoginNavigation() {
  return (
    <div className="mt-8 text-center">
      <div className="flex items-center justify-center gap-4">
        {navigationLinks.map((link, index) => (
          <>
            {index > 0 && (
              <Typography key={`separator-${index}`} variant="small">
                •
              </Typography>
            )}
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
            >
              <Typography variant="small">{link.label}</Typography>
            </Link>
          </>
        ))}
      </div>
    </div>
  );
}