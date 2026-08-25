import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react";
import clsx from "clsx";

interface ButtonRefreshProps {
    disabled?: boolean;
    onClick?: () => void;
    className?: string;
    size?: "default" | "sm" | "lg" | "icon" | null;
    isRefreshing?: boolean;
}

const ButtonRefresh = ({ disabled, onClick, className, size, isRefreshing }: ButtonRefreshProps) => {
    return (
        <Button
            onClick={onClick}
            disabled={disabled}
            size={size ?? "sm"}
            className={clsx(
                "hover:cursor-pointer text-white",
                isRefreshing
                    ? "bg-gray-400 hover:bg-gray-500 dark:bg-gray-400 dark:hover:bg-gray-600 border-none"
                    : className ?? "mb-4 bg-blue-400 hover:bg-blue-500 dark:bg-blue-400 dark:hover:bg-blue-500 border-none"
            )}
        >
            <span className="flex items-center gap-2">
                {isRefreshing ? (
                    <span className="animate-spin">
                        <RefreshCw />
                    </span>
                ) : (
                    <RefreshCw />
                )}
                {/* <span className="hidden sm:inline">
                    {isRefreshing ? "Refreshing..." : "Refresh"}
                </span> */}
            </span>
        </Button>
    );
};

export default ButtonRefresh;
