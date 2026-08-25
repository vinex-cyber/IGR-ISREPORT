// src/pages/form-so-harian/[prdcd]/index.tsx
import type { InferGetServerSidePropsType } from "next";
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

import { useReportPage } from "@/hooks/report/useReportPage";
import { formatPlu } from "@/utils/formatPlu";
import {
  formSoHarianColumns,
  FormSoHarianRows,
} from "@/configs/form-so-harian/so-harian";
import { buildReport } from "@/utils/reportBuilder";
import { formatNumber } from "@/utils/formatNumber";
import { exportToPdf } from "@/utils/exportToPdf";
import { FileText } from "lucide-react";
import InputProdukPlu from "@/components/input/InputProdukPlu";
import SettingsDatabase from "@/components/Settings/SettingsDatabase";
import { DATABASE_OPTIONS } from "@/configs/database-options";

import { getDefaultBranchServerSideProps } from "@/utils/server/getDefaultBranchServerSideProps";
import {
  CardContent,
  CardFieldset,
  CardTitleLegend,
} from "@/components/ui/card";
import { useState, useEffect } from "react";
import { getBranchCookie } from "@/utils/branchCookie";

export const getServerSideProps = getDefaultBranchServerSideProps;

type FormSoHarianPageProps = InferGetServerSidePropsType<
  typeof getServerSideProps
>;

export default function FormSoHarianDetail({
  defaultBranch,
}: FormSoHarianPageProps) {
  const router = useRouter();
  const [branch, setBranch] = useState(defaultBranch);

  useEffect(
    function syncBranchFromCookie() {
      if (!router.isReady) return;
      const cookieBranch = getBranchCookie();
      if (cookieBranch && cookieBranch !== defaultBranch) {
        setBranch(cookieBranch);
      }
    },
    [router.isReady, defaultBranch],
  );

  const config = buildReport<FormSoHarianRows>(formSoHarianColumns);
  const columns = formSoHarianColumns;

  const displayColumns = columns.filter(
    (col) =>
      col.field !== "acost" &&
      col.field !== "flag" &&
      col.field !== "lpp" &&
      col.field !== "plano_qty" &&
      col.field !== "omi_recid4" &&
      col.field !== "qty_rom",
  );

  const { filteredData, loading, error } = useReportPage<FormSoHarianRows>({
    endpoint: "form-so-harian",
    ...config,
    enabled: !!router.query.prdcd,
  });

  const methods = useForm<FilterFormSoHarianInput>({
    resolver: zodResolver(FilterFormSoHarianSchema),
    defaultValues: { prdcd: "" },
  });

  const onSubmit = (formData: FilterFormSoHarianInput) => {
    try {
      const formattedPlu = formatPlu(formData.prdcd || "", { validate: true });
      router.push(`/form-so-harian/${formattedPlu}`);
    } catch (err) {
      if (err instanceof Error) {
        alert(err.message);
      }
    }
  };

  const handleReset = () => {
    methods.reset({ prdcd: "" });
    router.push("/form-so-harian");
  };

  return (
    <Layout title="Form SO Harian" branch={branch}>
      <div className="flex justify-between">
        <h1 className="text-xl font-bold mb-4">
          Form SO Harian - {branch} :{" "}
          {router.query.prdcd ? `PLU ${router.query.prdcd}` : ""}
        </h1>

        <SettingsDatabase
          value={branch}
          onChange={setBranch}
          options={DATABASE_OPTIONS}
        />
      </div>

      <div className="flex gap-2 mb-2">
        {router.query.prdcd && (
          <Button
            variant="outline"
            onClick={() =>
              exportToPdf<FormSoHarianRows>({
                title: `Form SO Harian ${
                  filteredData?.slice(0, 1).map((row) => row.prdcd)[0] ??
                  router.query.prdcd
                } - ${
                  filteredData?.slice(0, 1).map((row) => row.desk)[0] ?? ""
                }`,
                columns: displayColumns,
                data: filteredData ?? [],
                mode: "download",
              })
            }>
            <FileText className="mr-2" />
            PDF
          </Button>
        )}

        {router.query.prdcd && (
          <Button
            variant="outline"
            onClick={handleReset}
            className="bg-red-400 hover:bg-red-500 text-white shadow-2xl">
            🔄 Reset / Clear
          </Button>
        )}
      </div>

      <Form {...methods}>
        <form
          onSubmit={methods.handleSubmit(onSubmit)}
          className="flex items-center gap-4">
          <CardFieldset className="relative rounded-lg border shadow">
            <CardTitleLegend className="mx-4 px-2 text-md font-semibold">
              Input PLU
            </CardTitleLegend>
            <CardContent>
              <InputProdukPlu name="prdcd" />
            </CardContent>
          </CardFieldset>

          <CardFieldset className="relative rounded-lg border shadow">
            <CardTitleLegend className="mx-6 px-2 text-md font-semibold">
              Process
            </CardTitleLegend>
            <CardContent>
              <Button
                type="submit"
                variant="outline"
                className="bg-blue-500 border-none text-white hover:bg-green-500 hover:cursor-pointer">
                {loading ? "Loading..." : "Cari"}
              </Button>
            </CardContent>
          </CardFieldset>
        </form>
      </Form>

      {error && <p className="text-red-500 mt-4">{error}</p>}

      {router.query.prdcd && !loading && (
        <div className="mt-6 bg-white dark:bg-slate-800" id="print-area">
          <ReportTable
            columns={displayColumns}
            textHeader="xxs"
            textBody="xxs"
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
                  <tr className="bg-blue-400 font-semibold dark:bg-gray-400 text-xxs">
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
                  <tr className="bg-blue-400 font-semibold dark:bg-gray-400 text-xxs">
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
                  <tr className="bg-blue-400 font-semibold dark:bg-gray-400 text-xxs">
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
