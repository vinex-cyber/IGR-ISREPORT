// src/utils/getBranchTheme.ts

export type BranchPrefix = "IGR" | "ICM" | "SPI" | "OTHER";

export function getBranchPrefix(branch?: string): BranchPrefix {
  const prefix = branch?.trim().toUpperCase().slice(0, 3);

  switch (prefix) {
    case "IGR":
      return "IGR";

    case "ICM":
      return "ICM";

    case "SPI":
      return "SPI";

    default:
      return "OTHER";
  }
}

export function getBranchPageBackground(branch?: string): string {
  const prefix = getBranchPrefix(branch);

  switch (prefix) {
    case "IGR":
    case "ICM":
      return "bg-blue-100";

    case "SPI":
      return "bg-green-100";

    default:
      return "bg-slate-100";
  }
}

export function getBranchNavbarBackground(branch?: string): string {
  const prefix = getBranchPrefix(branch);

  switch (prefix) {
    case "IGR":
    case "ICM":
      return "bg-blue-500/90";

    case "SPI":
      return "bg-green-500/90";

    default:
      return "bg-slate-500/90";
  }
}

/**
 * Menentukan logo berdasarkan 3 karakter awal branch.
 *
 * IGRCPG   → /images/logo_igr.png
 * ICMCPG   → /images/logo_icm.png
 * SPICPG1I → /images/logo_spi.png
 */
export function getBranchLogo(branch?: string): string {
  const prefix = getBranchPrefix(branch);

  switch (prefix) {
    case "IGR":
      return "/images/logo_igr.png";

    case "ICM":
      return "/images/logo_icm.png";

    case "SPI":
      return "/images/logo_spi.png";

    default:
      return "/images/logo.png";
  }
}
