import { useEffect, useState } from "react";
import { weaponService } from "@/services/weapon.service";
import { WeaponDetails, WeaponItem } from "@/types/weapon.types";

export function useWeapons() {
  const [weapons, setWeapons] = useState<WeaponItem[]>([]);
  const [weaponDetail, setWeaponDetail] = useState<WeaponDetails | null>(null);
  const [selectedPerks, setSelectedPerks] = useState<{
    [level: number]: number | null;
  }>({});

  useEffect(() => {
    async function fetchWeapons() {
      try {
        const weaponsList = await weaponService.getWeaponItems();
        setWeapons(weaponsList);
      } catch (error) {
        console.error("Erro ao buscar armas:", error);
      }
    }

    fetchWeapons();
  }, []);

  const handleWeaponSelect = async (item: WeaponItem) => {
    try {
      const weapon = await weaponService.getWeaponById(Number(item.id));
      setWeaponDetail(weapon);
      setSelectedPerks({});
    } catch (error) {
      console.error("Erro ao buscar detalhes da arma:", error);
    }
  };

  return {
    weapons,
    weaponDetail,
    selectedPerks,
    setSelectedPerks,
    handleWeaponSelect,
  };
}