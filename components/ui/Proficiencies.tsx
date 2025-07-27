"use client";

import Image from "next/image";
import { WeaponProficiency } from "@/types/weapon.types";

type GroupedProficiencies = {
  [level: number]: WeaponProficiency[];
};

interface ProficiencyTableProps {
  proficiencies: WeaponProficiency[] | null;
  selectedPerks: { [level: number]: number | null };
  setSelectedPerks: React.Dispatch<
    React.SetStateAction<{ [level: number]: number | null }>
  >;
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
}: ProficiencyTableProps) {
  if (!proficiencies || proficiencies.length === 0) return null;

  const grouped = groupByLevel(proficiencies);

  const handleSelect = (level: number, index: number) => {
    setSelectedPerks((prev) => ({
      ...prev,
      [level]: prev[level] === index ? null : index,
    }));
  };

  return (
    <div className="overflow-x-auto">
      <table className="table-auto border border-gray-300 w-full text-center">
        <thead>
          <tr className="bg-gray-200">
            {Object.keys(grouped).map((level) => (
              <th key={level} className="p-2">
                Nível {level}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr>
            {Object.entries(grouped).map(([level, perks]) => (
              <td key={level} className="p-2 align-middle">
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
                        onClick={() => handleSelect(+level, index)}
                        className={`cursor-pointer border p-2 rounded-md w-32 transition-all duration-200 ${
                          isSelected
                            ? "bg-blue-100 border-blue-400"
                            : "hover:bg-gray-100 opacity-70"
                        }`}
                      >
                        <div className="relative w-8 h-8 mx-auto mb-1">
                          {perk.icons &&
                            Array.isArray(perk.icons) &&
                            perk.icons[0] && (
                              <Image
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
                                src={perk.icons[1]}
                                alt="icon"
                                fill
                                className="object-contain absolute top-0 left-0"
                              />
                            )}
                        </div>
                        <p className="text-xs">{perk.description}</p>
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
