"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { WeaponItem } from "@/types/weapon.types";

interface WeaponDropdownProps {
  weapons: WeaponItem[];
  onSelect?: (item: WeaponItem) => void;
  defaultSelectedId?: number;
}

export default function WeaponDropdown({
  weapons,
  onSelect,
  defaultSelectedId,
}: WeaponDropdownProps) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<WeaponItem | null>(null);
  const [search, setSearch] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [open]);

  useEffect(() => {
    if (defaultSelectedId && !selected) {
      const found = weapons.find(
        (w) => String(w.id) === String(defaultSelectedId)
      );
      if (found) {
        setSelected(found);
      }
    }
  }, [defaultSelectedId, weapons, selected]);

  const handleSelect = (item: WeaponItem) => {
    setSelected(item);
    setOpen(false);
    setSearch("");
    if (onSelect) onSelect(item);
  };

  const filteredItems = weapons.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
        setSearch("");
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative w-80" ref={dropdownRef}>
      {/* Botão principal */}
      <button
        onClick={() => setOpen(!open)}
        className={`${
          defaultSelectedId !== undefined ? "cursor-default" : "cursor-pointer"
        } w-full flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-2 shadow hover:border-gray-400`}
        disabled={defaultSelectedId !== undefined}
      >
        <div className="flex items-center gap-3">
          {selected ? (
            <>
              <Image
                unoptimized
                src={`https://pdscifxfuisrczpvofat.supabase.co/storage/v1/object/public/weapon-proficiency/${selected.slug}.gif`}
                alt={selected.name}
                width={32}
                height={32}
                className="rounded"
              />
              <span className="text-sm font-medium">{selected.name}</span>
            </>
          ) : (
            <span className="text-sm text-gray-500">Selecione uma arma...</span>
          )}
        </div>
        <span className="text-gray-500">▼</span>
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute mt-2 w-full bg-white border border-gray-300 rounded-lg shadow z-10">
          <input
            ref={inputRef}
            type="text"
            placeholder="Selecione uma arma..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-4 py-2 text-sm border-b border-gray-200 focus:outline-none"
          />

          <ul className="max-h-64 overflow-y-auto">
            {filteredItems.length > 0 ? (
              filteredItems.map((item) => (
                <li
                  key={item.id}
                  onClick={() => handleSelect(item)}
                  className="flex items-start gap-3 px-4 py-2 cursor-pointer hover:bg-gray-100"
                >
                  <Image
                    unoptimized
                    src={`https://pdscifxfuisrczpvofat.supabase.co/storage/v1/object/public/weapon-proficiency/${item.slug}.gif`}
                    alt={item.name}
                    width={28}
                    height={28}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-medium text-sm">{item.name}</div>
                    <div className="text-xs text-gray-400">ID: {item.id}</div>
                  </div>
                </li>
              ))
            ) : (
              <li className="px-4 py-2 text-sm text-gray-400">
                Nenhum resultado encontrado.
              </li>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
