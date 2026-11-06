interface CustomizationFields {
  is_custom: "yes" | "no";
  print_method: string;
  print_sides: number;
  logo_count: number;
}

function asRecord(value: unknown): Record<string, unknown> | null {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }

  return null;
}

export function getCustomizationFields(
  customization: unknown,
): CustomizationFields {
  const empty: CustomizationFields = {
    is_custom: "no",
    print_method: "",
    print_sides: 0,
    logo_count: 0,
  };

  // Mendukung customization yang dikirim sebagai JSON string.
  let parsed: unknown = customization;

  if (typeof parsed === "string") {
    try {
      parsed = JSON.parse(parsed);
    } catch {
      return empty;
    }
  }

  const data = asRecord(parsed);

  if (!data) return empty;

  const zones = asRecord(data.zones);

  if (!zones) return empty;

  const printingMethods = new Set<string>();

  let printSides = 0;
  let logoCount = 0;

  for (const rawZone of Object.values(zones)) {
    const zone = asRecord(rawZone);

    if (!zone) continue;

    const logos = Array.isArray(zone.logos) ? zone.logos : [];

    // Zona tanpa logo tidak dihitung sebagai custom.
    if (logos.length === 0) continue;

    printSides += 1;

    // Sesuai kontrak:
    // logo_count berasal dari zone.logoCount,
    // bukan penjumlahan logos[].logoCount.
    const count = Number(zone.logoCount);

    if (Number.isSafeInteger(count) && count >= 0) {
      logoCount += count;
    }

    for (const rawLogo of logos) {
      const logo = asRecord(rawLogo);

      if (!logo) continue;

      const printingMethod = logo.printingMethod;

      if (typeof printingMethod === "string" && printingMethod.trim()) {
        printingMethods.add(printingMethod.trim());
      }
    }
  }

  if (printSides === 0) return empty;

  return {
    is_custom: "yes",
    print_method: [...printingMethods].sort().join("|"),
    print_sides: printSides,
    logo_count: logoCount,
  };
}
