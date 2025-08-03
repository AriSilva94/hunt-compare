"use client";

import dynamic from "next/dynamic";
import { ComponentProps } from "react";
import { WeaponComparison } from "./WeaponComparison";

const DynamicWeaponComparison = dynamic(
  () => import("./WeaponComparison").then((mod) => ({ default: mod.WeaponComparison })),
  {
    loading: () => (
      <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center animate-pulse">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mb-2"></div>
          <p className="text-gray-600 text-sm">Carregando comparação de armas...</p>
        </div>
      </div>
    ),
    ssr: false,
  }
);

export function LazyWeaponComparison(props: ComponentProps<typeof WeaponComparison>) {
  return <DynamicWeaponComparison {...props} />;
}