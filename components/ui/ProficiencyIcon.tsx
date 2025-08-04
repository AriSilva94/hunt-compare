"use client";

import { useState } from "react";
import Image from "next/image";

interface ProficiencyIconProps {
  icons: string[]; // Array com [border, icon] como vem da API
  isSelected: boolean;
  description: string;
}

export function ProficiencyIcon({
  icons,
  isSelected,
  description,
}: ProficiencyIconProps) {
  const [borderError, setBorderError] = useState(false);
  const [iconError, setIconError] = useState(false);

  // icons[0] = border, icons[1] = icon principal
  const borderUrl = icons[0];
  const iconUrl = icons[1];

  return (
    <div className="flex flex-col items-center gap-2 min-w-0">
      <div className="relative w-12 h-12 flex-shrink-0">
        {/* Borda (background) */}
        {borderUrl && !borderError && (
          <Image
            unoptimized
            src={borderUrl}
            alt="Borda da proficiência"
            width={48}
            height={48}
            className={`pixelated w-12 h-12 object-contain ${
              !isSelected ? "filter grayscale opacity-50" : ""
            }`}
            onError={() => setBorderError(true)}
          />
        )}

        {/* Ícone principal (foreground) */}
        {iconUrl && !iconError && (
          <Image
            unoptimized
            src={iconUrl}
            alt={description}
            width={48}
            height={48}
            className={`absolute top-0 left-0 pixelated w-12 h-12 object-contain ${
              !isSelected ? "filter grayscale opacity-50" : ""
            }`}
            onError={() => setIconError(true)}
          />
        )}

        {/* Fallback se não conseguir carregar */}
        {((!borderUrl && !iconUrl) || (borderError && iconError)) && (
          <div className="w-12 h-12 bg-gray-200 border border-gray-300 rounded flex items-center justify-center">
            <span className="text-xs text-gray-500">?</span>
          </div>
        )}
      </div>

      {/* Descrição completa sem truncate */}
      <div className="text-center max-w-24">
        <p className="text-xs text-gray-700 leading-tight break-words">
          {description}
        </p>
      </div>
    </div>
  );
}
