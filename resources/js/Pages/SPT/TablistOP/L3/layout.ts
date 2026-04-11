import {
    A1_CATEGORIES_DAGANG,
    A1_CATEGORIES_INDUSTRI,
    A1_CATEGORIES_JASA,
    A2_LEFT_CATEGORIES,
    A2_RIGHT_CATEGORIES,
    type MasterAccount,
    type SectorType,
    buildA1AccountsByCategory,
    buildAccountsByCategories,
} from "./types";

type LayoutConfig = {
    a1Categories: readonly string[];
    a2: {
        leftCategories: readonly string[];
        rightCategories: readonly string[];
    };
    a1CodesByCategory?: Record<string, Array<string | number>>;
    a2Codes?: {
        left?: Array<string | number>;
        right?: Array<string | number>;
    };
};

export const L3_ACCOUNT_LAYOUT: Record<SectorType, LayoutConfig> = {
    dagang: {
        a1Categories: A1_CATEGORIES_DAGANG,
        a2: {
            leftCategories: A2_LEFT_CATEGORIES,
            rightCategories: A2_RIGHT_CATEGORIES,
        },
        a1CodesByCategory: {
            Penjualan: [4002, 4003, 4004],
            "Dikurangi :": [4011, 4012, 4020, 5040, 5050],
            "Harga Pokok Penjualan (HPP)": [5001, 5008, 5009, 5020, 4300],
            "Beban Usaha": [
                5311,
                5313,
                5314,
                5315,
                5316,
                5317,
                5318,
                5320,
                5321,
                5322,
                5399,
                5400,
            ],
            "Laba (Rugi) Sebelum Pajak": [4800],
        },
        a2Codes: {
            left: [
                1101,
                1122,
                1123,
                1124,
                1125,
                1131,
                1200,
                1401,
                1421,
                1422,
                1423,
                1499,
                1501,
                1523,
                1524,
                1529,
                1530,
                1541,
                1599,
                1600,
                1611,
                1698,
                1700,
            ],
            right: [
                2102,
                2103,
                2111,
                2191,
                2192,
                2195,
                2201,
                2202,
                2203,
                2228,
                2301,
                2303,
                2304,
                2321,
                2998,
                2999,
                3102,
                3120,
                3200,
                3298,
                3299,
                3300,
            ],
        },
    },
    jasa: {
        a1Categories: A1_CATEGORIES_JASA,
        a2: {
            leftCategories: A2_LEFT_CATEGORIES,
            rightCategories: A2_RIGHT_CATEGORIES,
        },
        a1CodesByCategory: {
            Pendapatan: [5020, 4021, 4300],
            "Beban Usaha": [
                5313,
                5314,
                5315,
                5316,
                5317,
                5318,
                5320,
                5321,
                5322,
                5399,
                5400,
            ],
            "Laba (Rugi) Sebelum Pajak": [4800],
        },
        a2Codes: {
            left: [
                1101,
                1122,
                1123,
                1124,
                1125,
                1131,
                1200,
                1401,
                1421,
                1422,
                1423,
                1499,
                1501,
                1523,
                1524,
                1529,
                1530,
                1541,
                1599,
                1600,
                1611,
                1698,
                1700,
            ],
            right: [
                2102,
                2103,
                2111,
                2191,
                2192,
                2195,
                2201,
                2202,
                2203,
                2228,
                2301,
                2303,
                2304,
                2321,
                2998,
                2999,
                3102,
                3120,
                3200,
                3298,
                3299,
                3300,
            ],
        },
    },
    industri: {
        a1Categories: A1_CATEGORIES_INDUSTRI,
        a2: {
            leftCategories: A2_LEFT_CATEGORIES,
            rightCategories: A2_RIGHT_CATEGORIES,
        },
        a1CodesByCategory: {
            Penjualan: [4002, 4003, 4004],
            "Dikurangi :": [4011, 4012, 4020, 5040, 5050],
            "Biaya Overhead Pabrik": [
                5051,
                5052,
                5058,
                5059,
                5070,
                5080,
                5090,
                5099,
                5100,
                5969,
                5008,
                5009,
                5020,
                4030,
            ],
            "Beban Usaha": [
                5313,
                5314,
                5315,
                5316,
                5317,
                5318,
                5320,
                5321,
                5322,
                5399,
                5400,
            ],
            "Laba (Rugi) Sebelum Pajak": [4800],
        },
        a2Codes: {
            left: [
                1101,
                1122,
                1123,
                1124,
                1125,
                1131,
                1200,
                1401,
                1421,
                1422,
                1423,
                1499,
                1501,
                1523,
                1524,
                1529,
                1530,
                1541,
                1599,
                1600,
                1611,
                1698,
                1700,
            ],
            right: [
                2102,
                2103,
                2111,
                2191,
                2192,
                2195,
                2201,
                2202,
                2203,
                2228,
                2301,
                2303,
                2304,
                2321,
                2998,
                2999,
                3102,
                3120,
                3200,
                3298,
                3299,
                3300,
            ],
        },
    },
};

const mapCodesToAccounts = (
    masterAccounts: MasterAccount[],
    codes: Array<string | number>,
) => {
    if (!codes.length) return [] as MasterAccount[];

    const accountByCode = new Map<string, MasterAccount>();
    for (const account of masterAccounts) {
        accountByCode.set(String(account.code), account);
    }

    return codes
        .map((code) => accountByCode.get(String(code)))
        .filter((account): account is MasterAccount => Boolean(account));
};

const hasAnyCodeLayout = (layout: Record<string, Array<string | number>>) => {
    return Object.values(layout).some((codes) => (codes?.length ?? 0) > 0);
};

export function resolveL3A1AccountsByType(
    type: SectorType,
    masterAccounts: MasterAccount[],
    sorter?: (accounts: MasterAccount[], category: string) => MasterAccount[],
) {
    const config = L3_ACCOUNT_LAYOUT[type];
    const codeLayout = config.a1CodesByCategory ?? {};

    if (!hasAnyCodeLayout(codeLayout)) {
        return buildA1AccountsByCategory(
            masterAccounts,
            config.a1Categories,
            sorter,
        );
    }

    const byCategory: Record<string, MasterAccount[]> = {};
    for (const category of config.a1Categories) {
        const codes = codeLayout[category] ?? [];
        byCategory[category] = mapCodesToAccounts(masterAccounts, codes);
    }

    return byCategory;
}

export function resolveL3A2AccountsByType(
    type: SectorType,
    side: "left" | "right",
    masterAccounts: MasterAccount[],
) {
    const config = L3_ACCOUNT_LAYOUT[type];
    const codes = config.a2Codes?.[side] ?? [];

    if (codes.length > 0) {
        return mapCodesToAccounts(masterAccounts, codes);
    }

    const categories =
        side === "left"
            ? config.a2.leftCategories
            : config.a2.rightCategories;

    return buildAccountsByCategories(masterAccounts, categories);
}
