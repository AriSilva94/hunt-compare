import { createClient } from "@/lib/supabase/client";
import { WeaponDetails, WeaponItem } from "@/types/weapon.types";

export class WeaponService {
  private supabase = createClient();

  async getWeaponItems(): Promise<WeaponItem[]> {
    const { data, error } = await this.supabase
      .from("weapon_items")
      .select("id, name, slug, image")
      .order("name");

    if (error) {
      console.error("Erro ao buscar armas:", error);
      return [];
    }

    return data || [];
  }

  async getWeaponById(id: number): Promise<WeaponDetails | null> {
    const { data, error } = await this.supabase.rpc(
      "get_weapon_details_by_id",
      { weapon_id: id }
    );

    if (error) {
      console.error("Erro ao buscar arma:", error);
      return null;
    }

    return data?.[0] ?? null;
  }
}

export const weaponService = new WeaponService();
