import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/router";

import Layout from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { ReportTable } from "@/components/table/ReportTable";

import {
  FilterFormSoHarianInput,
  FilterFormSoHarianSchema,
} from "@/schema/filterFormSoHarian";

import { useReportPage } from "@/hooks/useReportPage";
import {
  formSoHarianColumns,
  FormSoHarianRows,
} from "@/configs/form-so-harian/so-harian";
import { buildReport } from "@/utils/reportBuilder";
import { formatNumber } from "@/utils/formatNumber";
import { exportToPdf } from "@/utils/exportToPdf";
import { RiFilePdf2Fill } from "react-icons/ri";
import InputProdukPlu from "@/components/input/InputProdukPlu";
import SettingsDatabase from "@/components/Settings/Settings";
import { DATABASE_OPTIONS } from "@/configs/database-options";
import { getDefaultBranch } from "@/utils/getDefaultBranch";

export default function FormSoHarian() {
  const router = useRouter();

  // 🔥 CONFIG TABLE (reuse system kamu)
  const config = buildReport<FormSoHarianRows>(formSoHarianColumns);
  const columns = formSoHarianColumns; // 🔥 langsung pakai config.columns jika tidak ada custom logic
  const displayColumns = columns.filter(
    (col) =>
      col.field !== "acost" &&
      col.field !== "flag" &&
      col.field !== "lpp" &&
      col.field !== "plano_qty" &&
      col.field !== "omi_recid4" &&
      col.field !== "qty_rom",
  );

  const { query, filteredData, loading, error } =
    useReportPage<FormSoHarianRows>({
      endpoint: "form-so-harian",
      ...config,
      enabled: !!router.query.prdcd, // hanya fetch jika ada query.plu
    });

  // 🔥 FORM
  const methods = useForm<FilterFormSoHarianInput>({
    resolver: zodResolver(FilterFormSoHarianSchema),
    defaultValues: {
      prdcd: "",
      branch: getDefaultBranch(),
    },
  });

  // 🔥 FORMAT PLU
  const formatPluGrup = (value: string) => {
    const items = value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const invalid = items.find((item) => !/^\d+$/.test(item));

    if (invalid) {
      throw new Error(
        `PLU tidak valid: ${invalid} (hanya angka diperbolehkan)`,
      );
    }

    return items
      .map((item) => {
        let formatted = item.padStart(7, "0");
        formatted = formatted.slice(0, 6) + "0";
        return formatted;
      })
      .join(",");
  };

  // 🔥 SUBMIT → push ke URL (trigger fetch otomatis)
  const onSubmit = (formData: FilterFormSoHarianInput) => {
    try {
      const formattedPlu = formatPluGrup(formData.prdcd || "");
      router.push({
        pathname: "/form-so-harian",
        query: { prdcd: formattedPlu, branch: formData.branch },
      });
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      }
    }
  };

  // 🔥 FUNGSI RESET
  const handleReset = () => {
    // Reset form values
    methods.reset({ prdcd: "" });
    methods.reset({ branch: "IGRCPG" });
    // Hapus query params dari URL
    router.push("/form-so-harian", undefined, { shallow: true });
  };

  const selectedBranch = methods.watch("branch");

  return (
    <Layout title="Form SO Harian" branch={selectedBranch}>
      <h1 className="text-2xl font-bold mb-4">
        Form SO Harian - {selectedBranch} :{" "}
        {query.prdcd ? `PLU ${query.prdcd}` : ""}
      </h1>

      <div className="flex gap-2 mb-2">
        {query.prdcd && (
          <Button
            variant="outline"
            onClick={() =>
              exportToPdf<FormSoHarianRows>({
                title: `Form SO Harian ${filteredData?.slice(0, 1).map((row) => row.prdcd)[0] ?? query.prdcd} - ${filteredData?.slice(0, 1).map((row) => row.desk)[0] ?? ""}`,
                columns: displayColumns,
                data: filteredData ?? [],
                mode: "download",
              })
            }>
            <RiFilePdf2Fill className="mr-2" /> PDF
          </Button>
        )}

        {/* 🔥 TOMBOL RESET */}
        {query.prdcd && (
          <Button
            variant="outline"
            onClick={handleReset}
            className="bg-red-400 hover:bg-red-500 text-white shadow-2xl">
            🔄 Reset / Clear
          </Button>
        )}
      </div>

      {/* 🔥 FORM */}
      <Form {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)} className="flex gap-4">
          <InputProdukPlu name="prdcd" />

          <Button
            type="submit"
            variant="outline"
            className="bg-blue-500 border-none text-white hover:bg-green-500 hover:cursor-pointer">
            {loading ? "Loading..." : "Submit"}
          </Button>

          <SettingsDatabase
            control={methods.control}
            options={DATABASE_OPTIONS}
            name="branch"
          />
        </form>
      </Form>

      {/* 🔥 ERROR */}
      {error && <p className="text-red-500 mt-4">{error}</p>}

      {/* 🔥 RESULT */}
      {query.prdcd && !loading && (
        <div className="mt-6" id="print-area">
          <ReportTable
            columns={displayColumns}
            data={filteredData ?? []}
            customFooter={(data) => {
              const lpp =
                data.slice(0, 1).map((row) => Number(row.lpp ?? 0))[0] ?? 0;
              const plano_qty =
                data.slice(0, 1).map((row) => Number(row.plano_qty ?? 0))[0] ??
                0;
              const omi_recid4 =
                data.slice(0, 1).map((row) => Number(row.omi_recid4 ?? 0))[0] ??
                0;
              const qty_rom =
                data.slice(0, 1).map((row) => Number(row.qty_rom ?? 0))[0] ?? 0;
              const sumPlano = plano_qty + omi_recid4 + qty_rom;
              const selisih = sumPlano - lpp;
              const keterangan = () => {
                if (sumPlano > lpp) {
                  return "Plano > dari LPP";
                } else if (sumPlano < lpp) {
                  return "Plano < LPP";
                } else {
                  return "Plano = LPP";
                }
              };
              const acost = data[0]?.acost ?? 0;
              const flag = data[0]?.flag ?? "-";

              return (
                <>
                  <tr className="bg-blue-400 font-semibold">
                    <td className="border px-2 py-2">Acost</td>
                    <td colSpan={2} className="border px-2 py-2">
                      : {formatNumber(Number(acost))}
                    </td>
                    <td colSpan={2}>Plano Qty : {formatNumber(plano_qty)}</td>
                    <td>Omi Recid4 : {formatNumber(omi_recid4)}</td>
                    <td>Omi Retur : {formatNumber(qty_rom)}</td>
                    <td colSpan={1} className="border px-2 py-2 text-right">
                      {"Total Plano (a) :"}
                    </td>
                    <td className="border px-2 py-2 text-right">
                      {formatNumber(sumPlano)}
                    </td>
                  </tr>

                  <tr className="bg-blue-400 font-semibold">
                    <td className="border px-2 py-2">Flag</td>
                    <td colSpan={4} className="border px-2 py-2">
                      : {flag}
                    </td>
                    <td colSpan={3} className="border px-2 py-2 text-right">
                      {"LPP (b) :"}
                    </td>
                    <td className="border px-2 py-2 text-right">
                      {formatNumber(lpp)}
                    </td>
                  </tr>

                  <tr className="bg-blue-400 font-semibold">
                    <td className="border px-2 py-2">Keterangan</td>
                    <td colSpan={4} className="border px-2 py-2">
                      : {keterangan()}
                    </td>
                    <td colSpan={3} className="border px-2 py-2 text-right">
                      {"Selisih (a-b) :"}
                    </td>
                    <td className="border px-2 py-2 text-right">
                      {formatNumber(selisih)}
                    </td>
                  </tr>
                </>
              );
            }}
            showRowNumber
          />
        </div>
      )}
    </Layout>
  );
}
