import { useEffect, useState } from "react";

export const useRefreshRouter = (
    loading: boolean,
    refetch: () => Promise<void>
) => {
    const [isRefreshing, setIsRefreshing] = useState(false);

    const handleRefresh = async () => {
        setIsRefreshing(true);
        await refetch(); // ✅ langsung fetch ulang
    };

    useEffect(function syncRefreshingState() {
        if (!loading) {
            setIsRefreshing(false);
        }
    }, [loading]);

    return { isRefreshing, handleRefresh };
};