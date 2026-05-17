// component/modal/GenericLookupModal.tsx
import Modal from "@/components/modal";
import SkeletonTable from "@/components/SkletonTable";
import { useLookupData } from "@/hooks/useLookupData";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { formatNumber } from "@/utils/formatNumber";

interface Column<T extends Record<string, unknown>> {
    field: keyof T;
    label: string;
    isNumeric?: boolean;
}

interface GenericLookupModalProps<T extends Record<string, unknown>> {
    show: boolean;
    onClose: () => void;

    endpoint: string;
    columns: Column<T>[];

    onSelect: (row: T) => void;

    title?: string;

    mode?: "client" | "server"; // 🔥 tambahan
    filterFn?: (item: T, keyword: string) => boolean; // 🔥 optional
}

export function GenericLookupModal<T extends Record<string, unknown>>({
    show,
    onClose,
    endpoint,
    columns,
    onSelect,
    title = "Pilih Data",
    mode = "server", // default tetap server
    filterFn,
}: GenericLookupModalProps<T>) {

    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    // 🔥 debounce search
    const [debouncedSearch, setDebouncedSearch] = useState(search);

    useEffect(() => {
        const t = setTimeout(() => setDebouncedSearch(search), 300);
        return () => clearTimeout(t);
    }, [search]);

    // 🔥 fetch (server / client sama-sama lewat sini)
    const { data, total, loading } = useLookupData<T>({
        endpoint,
        mode,
        page,
        pageSize,
        search: debouncedSearch,
    });

    // =========================
    // 🔥 CLIENT MODE FILTER
    // =========================
    const filteredData = useMemo(() => {
        if (mode === "server") return data;

        if (!filterFn) return data;

        return data.filter((item) =>
            filterFn(item, debouncedSearch.toLowerCase())
        );
    }, [data, debouncedSearch, filterFn, mode]);

    // =========================
    // 🔥 DATA SOURCE
    // =========================
    const rows =
        mode === "server"
            ? data
            : filteredData.slice((page - 1) * pageSize, page * pageSize);

    const totalRows = mode === "server" ? total : filteredData.length;

    const totalPages = Math.max(1, Math.ceil(totalRows / pageSize));

    useEffect(() => {
        if (show) {
            setSearch("");
            setPage(1);
        }
    }, [show]);

    const prevPage = () => setPage((prev) => Math.max(prev - 1, 1));
    const nextPage = () => setPage((prev) => Math.min(prev + 1, totalPages));

    return (
        <Modal show={show} onClose={onClose}>
            <div className="p-4 space-y-3">
                <h2 className="text-lg font-semibold">{title}</h2>

                {/* 🔍 SEARCH */}
                <input
                    type="text"
                    placeholder="Search..."
                    value={search}
                    onChange={(e) => {
                        setSearch(e.target.value);
                        setPage(1);
                    }}
                    className="w-full border px-3 py-2 rounded text-sm"
                />

                {/* 📊 TABLE */}
                {loading ? (
                    <SkeletonTable rows={10} columns={columns.length} />
                ) : (
                    <>
                        <div className="max-h-[60vh] w-full overflow-y-auto border">
                            <table className="min-w-max w-full text-sm">
                                <thead className="bg-gray-100 sticky top-0 z-10">
                                    <tr>
                                        {columns.map((col) => (
                                            <th key={String(col.field)} className="border px-2 py-1">
                                                {col.label}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>

                                <tbody>
                                    {rows.length === 0 ? (
                                        <tr>
                                            <td colSpan={columns.length} className="text-center py-4">
                                                Data tidak ditemukan
                                            </td>
                                        </tr>
                                    ) : (
                                        rows.map((row, i) => (
                                            <tr
                                                key={i}
                                                className="cursor-pointer hover:bg-blue-50"
                                                onClick={() => {
                                                    onSelect(row);
                                                    onClose();
                                                }}
                                            >
                                                {columns.map((col) => {
                                                    const value = row[col.field];

                                                    return (
                                                        <td
                                                            key={String(col.field)}
                                                            className={`border px-2 py-1 ${col.isNumeric ? "text-right" : ""
                                                                }`}
                                                        >
                                                            {col.isNumeric
                                                                ? formatNumber(Number(value ?? 0))
                                                                : String(value ?? "")}
                                                        </td>
                                                    );
                                                })}
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* 🔢 PAGINATION */}
                        <div className="flex justify-between items-center pt-2">
                            <div className="flex gap-2 items-center">
                                <span className="text-xs text-gray-500">
                                    Page {page} / {totalPages}
                                </span>

                                <select
                                    value={pageSize}
                                    onChange={(e) => {
                                        setPageSize(Number(e.target.value));
                                        setPage(1);
                                    }}
                                    className="border rounded px-2 py-1 text-sm"
                                >
                                    {[5, 10, 20, 50].map((size) => (
                                        <option key={size} value={size}>
                                            {size} rows
                                        </option>
                                    ))}
                                </select>
                            </div>

                            <div className="flex gap-2">
                                <Button type="button" disabled={page === 1} onClick={prevPage}>
                                    Prev
                                </Button>
                                <Button type="button" disabled={page === totalPages} onClick={nextPage}>
                                    Next
                                </Button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </Modal>
    );
}
// //component/modal/GenericLookupModal.tsx
// import Modal from "@/components/modal";
// import SkeletonTable from "@/components/SkletonTable";
// import { useQueryData } from "@/hooks/useQueryData";
// import { useEffect, useMemo, useState } from "react";
// import { Button } from "@/components/ui/button";
// import { formatNumber } from "@/utils/formatNumber";

// interface Column<T> {
//     field: keyof T;
//     label: string;
//     isNumeric?: boolean;
//     group?: string;
// }

// interface GenericLookupModalProps<T> {
//     show: boolean;
//     onClose: () => void;

//     endpoint: string;
//     columns: Column<T>[];

//     // 🔥 mapping select
//     onSelect: (row: T) => void;

//     // 🔥 custom search filter
//     filterFn: (item: T, keyword: string) => boolean;

//     title?: string;
// }

// export function GenericLookupModal<T>({
//     show,
//     onClose,
//     endpoint,
//     columns,
//     onSelect,
//     filterFn,
//     title = "Pilih Data",
// }: GenericLookupModalProps<T>) {
//     const { data, isLoading } = useQueryData<T[]>({
//         endpoint,
//     });

//     const [search, setSearch] = useState("");
//     const [page, setPage] = useState(1);
//     const [pageSize, setPageSize] = useState(10);

//     // 🔥 reset saat buka
//     useEffect(() => {
//         if (show) {
//             setSearch("");
//             setPage(1);
//         }
//     }, [show]);

//     // 🔥 FILTER
//     const filteredData = useMemo(() => {
//         if (!data) return [];
//         const keyword = search.toLowerCase();

//         return data.filter((item) => filterFn(item, keyword));
//     }, [data, search, filterFn]);

//     // 🔥 PAGINATION
//     const totalPages = Math.ceil(filteredData.length / pageSize);

//     const paginatedData = useMemo(() => {
//         const start = (page - 1) * pageSize;
//         return filteredData.slice(start, start + pageSize);
//     }, [filteredData, page, pageSize]);

//     const prevPage = () => setPage((prev) => Math.max(prev - 1, 1));
//     const nextPage = () => setPage((prev) => Math.min(prev + 1, totalPages));

//     const onChangeInput = (e: React.ChangeEvent<HTMLInputElement>) => {
//         setSearch(e.target.value);
//         setPage(1);
//     }

//     const keyDownInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
//         if (e.key === "Enter") e.preventDefault();
//     }


//     return (
//         <Modal show={show} onClose={onClose}>
//             <div className="p-4 space-y-3">
//                 <h2 className="text-lg font-semibold">{title}</h2>

//                 {/* 🔍 SEARCH */}
//                 <input
//                     type="text"
//                     placeholder="Search..."
//                     value={search}
//                     onChange={onChangeInput}
//                     onKeyDown={keyDownInput}
//                     className="w-full border px-3 py-2 rounded text-sm"
//                 />

//                 {/* 📊 TABLE */}
//                 {isLoading ? (
//                     <SkeletonTable rows={10} columns={columns.length} />
//                 ) : (
//                     <>
//                         <div className="max-h-[60vh] w-full overflow-y-auto border">
//                             <table className="min-w-max w-full text-sm">
//                                 <thead className="bg-gray-100 sticky top-0 z-10">
//                                     <tr>
//                                         {columns.map((col) => (
//                                             <th key={String(col.field)} className="border px-2 py-1">
//                                                 {col.label}
//                                             </th>
//                                         ))}
//                                     </tr>
//                                 </thead>

//                                 <tbody>
//                                     {paginatedData.map((row, i) => (
//                                         <tr
//                                             key={i}
//                                             className="cursor-pointer hover:bg-blue-50"
//                                             onClick={() => {
//                                                 onSelect(row);
//                                                 onClose();
//                                             }}
//                                         >
//                                             {columns.map((col) => (
//                                                 <td
//                                                     key={String(col.field)}
//                                                     className={`border px-2 py-1 ${col.isNumeric ? "text-right" : ""
//                                                         }`}
//                                                 >
//                                                     {col.isNumeric
//                                                         ? formatNumber(Number(row[col.field] ?? 0))
//                                                         : String(row[col.field] ?? "")}
//                                                 </td>
//                                             ))}
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>

//                         {/* 🔢 PAGINATION */}
//                         <div className="flex justify-between items-center pt-2">
//                             <div className="flex gap-2 items-center">
//                                 <span className="text-xs text-gray-500">
//                                     Page {page} / {totalPages || 1}
//                                 </span>

//                                 <select
//                                     value={pageSize}
//                                     onChange={(e) => {
//                                         setPageSize(Number(e.target.value));
//                                         setPage(1);
//                                     }}
//                                     className="border rounded px-2 py-1 text-sm"
//                                 >
//                                     {[5, 10, 20, 50].map((size) => (
//                                         <option key={size} value={size}>
//                                             {size} rows
//                                         </option>
//                                     ))}
//                                 </select>
//                             </div>

//                             <div className="flex gap-2">
//                                 <Button
//                                     type="button"
//                                     className="hover:cursor-pointer"
//                                     disabled={page === 1}
//                                     onClick={prevPage}
//                                 >
//                                     Prev
//                                 </Button>
//                                 <Button
//                                     type="button"
//                                     className="hover:cursor-pointer"
//                                     disabled={page === totalPages}
//                                     onClick={nextPage}
//                                 >
//                                     Next
//                                 </Button>
//                             </div>
//                         </div>
//                     </>
//                 )}
//             </div>
//         </Modal>
//     );
// }