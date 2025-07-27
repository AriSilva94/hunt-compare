export interface WeaponItem {
  id: string;
  name: string;
  slug: string;
}

export interface WeaponProficiency {
  level: number;
  description: string;
  icons: string | string[] | null;
}

export interface WeaponDetails {
  id: string;
  name: string;
  slug: string;
  weapon: string;
  url: string | null;
  image: string | null;
  description_raw: string | null;
  vocation: string | null;
  imbuement_slots: number | null;
  classification: string | null;
  max_tier: number | null;
  weight: number | null;
  proficiencies: WeaponProficiency[] | null;
}
