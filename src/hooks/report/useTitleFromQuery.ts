// hooks/useTitleFromQuery.ts
import { useRouter } from "next/router";

export const useTitleFromQuery = () => {
    const { query } = useRouter();
    const selected = query.selectedReport?.toString() ?? "-";
    return selected
        .replaceAll(/-/g, " ")
        .replace(/\b\w/g, (c) => c.toUpperCase());
};
