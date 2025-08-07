import { Card } from "@/components/ui/Card";
import { Typography } from "@/components/ui/Typography";
import WeaponDropdown from "@/components/ui/WeaponDropdown";
import ProficiencyTable from "@/components/ui/Proficiencies";
import { WeaponDetails, WeaponItem } from "@/types/weapon.types";

interface PublicWeaponSectionProps {
  weapons: WeaponItem[];
  weaponDetail: WeaponDetails | null;
  selectedPerks: { [level: number]: number | null };
}

export function PublicWeaponSection({ 
  weapons, 
  weaponDetail, 
  selectedPerks 
}: PublicWeaponSectionProps) {
  if (!weaponDetail) return null;

  return (
    <Card>
      <div className="flex flex-wrap items-center justify-around gap-4">
        <WeaponDropdown
          weapons={weapons}
          defaultSelectedId={
            weaponDetail?.id ? Number(weaponDetail.id) : undefined
          }
        />
        <div className="flex flex-col w-80">
          <Typography variant="h3" className="my-1">
            {weaponDetail?.name}
          </Typography>
          <div className="my-1 max-w-md text-green-700 dark:text-green-400 font-bold text-xs">
            {weaponDetail?.description_raw ? (
              weaponDetail.description_raw
                .replace(
                  /(Max\. Tier: \d+)\s+(It weighs)/,
                  "$1.|||BREAK|||$2"
                )
                .split(
                  /(?<!\b(?:Max|Mr|Ms|St|Dr))\. (?=[A-Z])|\|\|\|BREAK\|\|\|/g
                )
                .filter((s) => !!s?.trim())
                .map((sentence, index, arr) => {
                  const trimmed = sentence.trim();
                  const isWeigh = /weighs?/i.test(trimmed);
                  const needsDot =
                    index !== arr.length - 1 &&
                    !isWeigh &&
                    !trimmed.endsWith(".");
                  return (
                    <div key={index}>
                      {trimmed}
                      {needsDot ? "." : ""}
                    </div>
                  );
                })
            ) : (
              <></>
            )}
          </div>
        </div>
        <div className="mt-4">
          <ProficiencyTable
            proficiencies={weaponDetail?.proficiencies ?? null}
            selectedPerks={selectedPerks}
            isDisabled={true}
          />
        </div>
      </div>
    </Card>
  );
}