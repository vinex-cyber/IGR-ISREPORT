import { useEffect, useMemo } from "react";
import {
    useWatch,
    useFormContext,
    Control,
    FieldValues,
    FieldPath,
    PathValue,
} from "react-hook-form";

interface Option {
    label: string;
    value: string;
}

interface GroupedOption {
    groupLabel: string;
    options: Option[];
}

interface UseDependentSelectProps<
    T,
    FormType extends FieldValues
> {
    control: Control<FormType>;

    // 🔥 pakai FieldPath
    name: FieldPath<FormType>;
    parentName?: FieldPath<FormType>;

    data?: T[];

    filterFn?: (item: T, parentValue: unknown) => boolean;

    getOption: (item: T) => Option;
    getGroupKey?: (item: T) => string;

    includeAllOption?: boolean;
    allLabel?: string;

    sortGroups?: boolean;
    sortOptions?: boolean;
}

export function useDependentSelect<
    T,
    FormType extends FieldValues
>({
    control,
    name,
    parentName,
    data,
    filterFn,
    getOption,
    getGroupKey,
    includeAllOption = true,
    allLabel = "All",
    sortGroups = false,
    sortOptions = false,
}: UseDependentSelectProps<T, FormType>) {
    const { setValue } = useFormContext<FormType>();

    // 🔥 watch parent (sudah type-safe)
    const parentValue = useWatch({
        control,
        name: parentName ?? name, // 🔥 fallback aman
    });

    // 🔥 reset child saat parent berubah
    useEffect(function resetChildOnParentChange() {
        if (parentName) {
            setValue(
                name,
                "" as PathValue<FormType, typeof name>
            );
        }
    }, [parentValue, parentName, name, setValue]);

    // 🔥 filter data
    const filteredData = useMemo(() => {
        if (!data) return [];

        if (!parentName || !filterFn) return data;

        if (!parentValue) return data;

        return data.filter((item) => filterFn(item, parentValue));
    }, [data, parentValue, parentName, filterFn]);

    // 🔥 grouping
    const grouped = useMemo(() => {
        if (!getGroupKey) return null;

        const map = filteredData.reduce<Record<string, GroupedOption>>(
            (acc, item) => {
                const key = getGroupKey(item);

                if (!acc[key]) {
                    acc[key] = {
                        groupLabel: key,
                        options: [],
                    };
                }

                acc[key].options.push(getOption(item));
                return acc;
            },
            {}
        );

        let result = Object.values(map);

        if (sortOptions) {
            result = result.map((group) => ({
                ...group,
                options: [...group.options].sort((a, b) =>
                    a.label.localeCompare(b.label)
                ),
            }));
        }

        if (sortGroups) {
            result = result.sort((a, b) =>
                a.groupLabel.localeCompare(b.groupLabel)
            );
        }

        return result;
    }, [filteredData, getGroupKey, getOption, sortGroups, sortOptions]);

    // 🔥 final options
    const options = useMemo(() => {
        const base = grouped ?? filteredData.map(getOption);

        if (!includeAllOption) return base;

        return [{ label: allLabel, value: "__ALL__" }, ...base];
    }, [grouped, filteredData, getOption, includeAllOption, allLabel]);

    return {
        options,
        parentValue,
    };
}