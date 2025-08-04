"use client";

import Image from "next/image";
import { WeaponProficiency } from "@/types/weapon.types";

type GroupedProficiencies = {
  [level: number]: WeaponProficiency[];
};

interface ProficiencyTableProps {
  proficiencies: WeaponProficiency[] | null;
  selectedPerks: { [level: number]: number | null };
  setSelectedPerks?: React.Dispatch<
    React.SetStateAction<{ [level: number]: number | null }>
  >;
  onPerkChange?: (level: number, selectedProficiency: number | null) => void;
  isDisabled?: boolean;
}

const groupByLevel = (data: WeaponProficiency[]): GroupedProficiencies => {
  return data.reduce((acc, curr) => {
    if (!acc[curr.level]) acc[curr.level] = [];
    acc[curr.level].push(curr);
    return acc;
  }, {} as GroupedProficiencies);
};

export default function ProficiencyTable({
  proficiencies,
  selectedPerks,
  setSelectedPerks,
  onPerkChange,
  isDisabled = false,
}: ProficiencyTableProps) {
  if (!proficiencies || proficiencies.length === 0) return null;

  const grouped = groupByLevel(proficiencies);

  const handleSelect = (level: number, index: number) => {
    const newValue = selectedPerks[level] === index ? null : index;

    // Se existe onPerkChange, usar ele, senão usar setSelectedPerks
    if (onPerkChange) {
      onPerkChange(level, newValue);
    } else if (setSelectedPerks) {
      setSelectedPerks((prev) => ({
        ...prev,
        [level]: newValue,
      }));
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="table-auto border border-gray-300 dark:border-gray-600 w-full text-center">
        <thead>
          <tr className="bg-gray-200 dark:bg-gray-700">
            {Object.keys(grouped).map((level) => (
              <th key={level} className="p-2 text-gray-900 dark:text-gray-100">
                Nível {level}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {Object.entries(grouped).map(([level, perks]) => (
              <td key={level} className="p-2 align-middle bg-white dark:bg-gray-800">
                <div
                  className={`flex flex-col ${
                    perks.length > 1 ? "justify-around gap-3" : "items-center"
                  }`}
                >
                  {perks.map((perk, index) => {
                    const isSelected = selectedPerks[+level] === index;

                    return (
                      <div
                        key={index}
                        onClick={() =>
                          !isDisabled && handleSelect(+level, index)
                        }
                        className={`${
                          isDisabled ? "cursor-default" : "cursor-pointer"
                        } border border-gray-300 dark:border-gray-600 p-2 rounded-md w-32 transition-all duration-200 ${
                          isSelected
                            ? "bg-blue-100 dark:bg-blue-900 border-blue-400 dark:border-blue-500"
                            : "hover:bg-gray-100 dark:hover:bg-gray-700 opacity-70 bg-gray-50 dark:bg-gray-800"
                        }`}
                      >
                        <div className="relative w-8 h-8 mx-auto mb-1">
                          {perk.icons &&
                            Array.isArray(perk.icons) &&
                            perk.icons[0] && (
                              <Image
                                unoptimized
                                src={perk.icons[0]}
                                alt="border"
                                fill
                                className="object-contain"
                              />
                            )}
                          {perk.icons &&
                            Array.isArray(perk.icons) &&
                            perk.icons[1] && (
                              <Image
                                unoptimized
                                src={perk.icons[1]}
                                alt="icon"
                                fill
                                className="object-contain absolute top-0 left-0"
                              />
                            )}
                        </div>
                        <p className="text-xs text-gray-900 dark:text-gray-100">{perk.description}</p>
                      </div>
                    );
                  })}
                </div>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
}
