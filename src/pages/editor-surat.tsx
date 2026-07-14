import * as React from "react";
import type { JSONContent } from "@tiptap/react";

import Layout from "@/components/Layout";
import { EditorTiptap } from "@/components/input/EditorTiptapDynamic";
import SettingsDatabase from "@/components/Settings/SettingsDatabase";
import { DATABASE_OPTIONS } from "@/configs/database-options";
import { getBranchCookie } from "@/utils/branchCookie";
import {
  editorJsonToPdfBlobUrl,
  downloadEditorPdf,
  printEditorPdf,
} from "@/utils/exportToPdf/editorPdf";
import { Button } from "@/components/ui/button";
import { Eye, RefreshCw, X, Download, Printer } from "lucide-react";

export default function TestEditorPage() {
  const [content, setContent] = React.useState<JSONContent | null>(null);
  const [branch, setBranch] = React.useState(DATABASE_OPTIONS[0].value);
  const [pdfUrl, setPdfUrl] = React.useState<string | null>(null);

  React.useEffect(function loadBranchFromCookie() {
    const cookieBranch = getBranchCookie();
    if (cookieBranch) setBranch(cookieBranch);
  }, []);

  const hasText = React.useCallback(function checkText(
    node: JSONContent | null,
  ): boolean {
    if (!node) return false;
    if (node.type === "text" && node.text && node.text.trim()) return true;
    return (node.content ?? []).some(checkText);
  }, []);

  const showActions = hasText(content);

  const handlePreview = React.useCallback(
    function generatePreview() {
      if (!content) return;
      editorJsonToPdfBlobUrl(content)
        .then(function applyUrl(url) {
          setPdfUrl(function replaceUrl(prev) {
            if (prev) URL.revokeObjectURL(prev);
            return url;
          });
        })
        .catch(function ignoreError() {
          /* abaikan error render sementara */
        });
    },
    [content],
  );

  return (
    <Layout title="Test Editor" branch={branch}>
      <div className="mb-4 flex items-center justify-between gap-4">
        <h1 className="text-2xl text-blue-500 font-bold">
          Form Penawaran - {branch}
        </h1>
        <SettingsDatabase
          value={branch}
          onChange={setBranch}
          options={DATABASE_OPTIONS}
        />
      </div>

      {showActions && (
        <div className="sticky top-20 z-40 mb-4 flex flex-wrap items-center justify-between gap-3 rounded-xl border border-input bg-background/90 p-2.5 shadow-sm backdrop-blur">
          <span className="pl-1 text-sm font-medium text-muted-foreground">
            Dokumen PDF
          </span>
          <div className="flex flex-wrap items-center gap-2">
            <Button
              type="button"
              size="sm"
              className="cursor-pointer gap-1.5"
              onClick={handlePreview}>
              {pdfUrl ? (
                <RefreshCw className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
              {pdfUrl ? "Perbarui" : "Preview"}
            </Button>
            {pdfUrl && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="cursor-pointer gap-1.5"
                onClick={function handleClosePreview() {
                  setPdfUrl(function clear(prev) {
                    if (prev) URL.revokeObjectURL(prev);
                    return null;
                  });
                }}>
                <X className="size-4" />
                Tutup
              </Button>
            )}
            <div className="mx-0.5 h-6 w-px bg-border" />
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="cursor-pointer gap-1.5"
              onClick={function handleDownload() {
                downloadEditorPdf(content, "penawaran.pdf");
              }}>
              <Download className="size-4" />
              Unduh
            </Button>
            <Button
              type="button"
              size="sm"
              className="cursor-pointer gap-1.5"
              onClick={function handlePrint() {
                printEditorPdf(content);
              }}>
              <Printer className="size-4" />
              Cetak
            </Button>
          </div>
        </div>
      )}

      <div
        className={
          pdfUrl ? "grid grid-cols-1 gap-6 lg:grid-cols-2" : "grid grid-cols-1"
        }>
        <div>
          <h2 className="mb-2 text-lg font-semibold">Editor</h2>
          <EditorTiptap
            value={content}
            onChange={setContent}
            toolbarOffset={showActions ? 148 : 96}
            branch={branch}
          />
        </div>
        {pdfUrl && (
          <div>
            <h2 className="mb-2 text-lg font-semibold">Preview PDF</h2>
            <iframe
              src={pdfUrl}
              title="Preview PDF"
              className="h-[80vh] w-full rounded-md border border-input"
            />
          </div>
        )}
      </div>

      <h2 className="mb-2 mt-6 text-lg font-semibold">JSON Output</h2>
      <pre className="overflow-auto rounded-md border border-input bg-muted/40 p-3 text-xs">
        {JSON.stringify(content, null, 2)}
      </pre>
    </Layout>
  );
}
