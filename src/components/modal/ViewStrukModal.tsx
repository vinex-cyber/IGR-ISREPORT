// src/components/modal/evaluasi-sales/ViewStrukModal.tsx

import { useEffect, useState } from "react";
import axios from "axios";
import { Loader2, Printer, ReceiptText } from "lucide-react";

import Modal from "@/components/modal";
import { Button } from "@/components/ui/button";

interface StrukFileModalProps {
  show: boolean;
  tanggal: string;
  station: string;
  struk: string;
  kasir: string;
  onClose: () => void;
  branch: string;
}

interface StrukFileSuccessResponse {
  success: true;
  data: {
    content: string;
    filename: string;
    folder: string;
    station: string;
  };
}

interface StrukFileErrorResponse {
  success: false;
  message: string;
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

const StrukViewModal = ({
  show,
  tanggal,
  station,
  kasir,
  struk,
  branch,
  onClose,
}: StrukFileModalProps) => {
  const [content, setContent] = useState("");
  const [filename, setFilename] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(function fetchStrukData() {
    if (!show || !tanggal || !station || !kasir || !struk || !branch) {
      return;
    }

    const controller = new AbortController();

    const fetchStrukFile = async () => {
      setIsLoading(true);
      setError(null);
      setContent("");
      setFilename("");

      try {
        const response = await axios.get<StrukFileSuccessResponse>(
          "/api/struk",
          {
            params: {
              tanggal,
              station,
              kasir,
              struk,
            },
            signal: controller.signal,
          },
        );

        if (controller.signal.aborted) {
          return;
        }

        setContent(response.data.data.content);

        setFilename(response.data.data.filename);
      } catch (requestError) {
        if (
          axios.isAxiosError(requestError) &&
          requestError.code === "ERR_CANCELED"
        ) {
          return;
        }

        if (axios.isAxiosError<StrukFileErrorResponse>(requestError)) {
          setError(
            requestError.response?.data?.message ??
              "Gagal mengambil file struk",
          );

          return;
        }

        setError("Gagal mengambil file struk");
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    };

    void fetchStrukFile();

    return function abortFetch() {
      controller.abort();
    };
  }, [show, tanggal, station, kasir, struk, branch]);

  const handlePrint = () => {
    if (!content) {
      return;
    }

    const iframe = document.createElement("iframe");

    iframe.style.position = "fixed";
    iframe.style.right = "0";
    iframe.style.bottom = "0";
    iframe.style.width = "0";
    iframe.style.height = "0";
    iframe.style.border = "0";
    iframe.style.visibility = "hidden";

    document.body.appendChild(iframe);

    const iframeWindow = iframe.contentWindow;

    const iframeDocument = iframeWindow?.document;

    if (!iframeWindow || !iframeDocument) {
      iframe.remove();
      return;
    }

    const safeContent = escapeHtml(content);

    const safeTitle = escapeHtml(filename || `${struk}.TXT`);

    iframeDocument.open();

    iframeDocument.write(`
      <!DOCTYPE html>
      <html lang="id">
        <head>
          <meta charset="UTF-8" />
          <title>${safeTitle}</title>

          <style>
            @page {
              size: 80mm auto;
              margin: 0;
            }

            * {
              box-sizing: border-box;
            }

            html,
            body {
              width: 80mm;
              margin: 0;
              padding: 0;
              background: #ffffff;
            }

            body {
              font-family:
                "Courier New",
                Courier,
                monospace;

              color: #000000;
            }

            .receipt {
              width: 76mm;
              margin: 0 auto;
              padding: 2mm;
            }

            pre {
              width: max-content;
              min-width: 100%;

              margin: 0;
              padding: 0;

              white-space: pre;

              font-family:
                "Courier New",
                Courier,
                monospace;

              font-size: 10px;
              font-weight: 500;
              line-height: 1.3;
              letter-spacing: 0;

              text-align: left;
              color: #000000;
              background: transparent;
            }

            @media print {
              html,
              body {
                width: 80mm;
              }

              .receipt {
                width: 76mm;
                margin: 0 auto;
                padding: 1mm 2mm;
              }

              pre {
                font-size: 18px;
                font-weight: 500;
                line-height: 1.3;
              }
            }
          </style>
        </head>

        <body>
          <div class="receipt">
            <pre>${safeContent}</pre>
          </div>
        </body>
      </html>
    `);

    iframeDocument.close();

    const printStruk = () => {
      iframeWindow.focus();
      iframeWindow.print();

      window.setTimeout(() => {
        iframe.remove();
      }, 1500);
    };

    window.setTimeout(printStruk, 300);
  };

  return (
    <Modal show={show} onClose={onClose} zIndex={100}>
      <div className="flex max-h-[82vh] w-[90vw] max-w-2xl flex-col overflow-hidden">
        {/* Header */}
        <div className="flex shrink-0 items-center border-b bg-white px-4 py-3 pr-14 dark:bg-slate-900">
          <div className="flex min-w-0 items-center gap-3">
            <div className="shrink-0 rounded-md bg-blue-100 p-2 text-blue-600 dark:bg-blue-950 dark:text-blue-400">
              <ReceiptText size={20} />
            </div>

            <div className="min-w-0">
              <h2 className="font-semibold">Detail Struk - {branch}</h2>

              <p className="truncate text-xs text-muted-foreground">
                {filename || `${struk}.TXT`}
              </p>
            </div>
          </div>
        </div>

        {/* Informasi struk */}
        <div className="shrink-0 border-b bg-gray-50 px-4 py-2 text-xs dark:bg-slate-950">
          <div className="flex flex-wrap gap-x-6 gap-y-1">
            <span>
              <strong>Tanggal:</strong> {tanggal}
            </span>

            <span>
              <strong>Station:</strong> {station}
            </span>

            <span>
              <strong>Struk:</strong> {struk}
            </span>

            <span>
              <strong>Kasir:</strong> {kasir}
            </span>
          </div>
        </div>

        {/* Isi struk */}
        <div className="min-h-[300px] flex-1 overflow-auto bg-white px-4 py-3 dark:bg-slate-950">
          {isLoading && (
            <div className="flex min-h-[300px] items-center justify-center gap-2">
              <Loader2 className="animate-spin" size={20} />

              <span className="text-sm">Memuat struk...</span>
            </div>
          )}

          {!isLoading && error && (
            <div className="flex min-h-[300px] items-center justify-center">
              <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-center text-sm text-red-600">
                {error}
              </div>
            </div>
          )}

          {!isLoading && !error && content && (
            <div className="flex min-w-max justify-center">
              <div className="w-[120mm] rounded bg-gray-100 p-2 shadow dark:bg-slate-800 dark:text-black">
                <pre className="flex items-center justify-center whitespace-pre rounded bg-gray-200 p-2">
                  {content}
                </pre>
              </div>
            </div>
          )}

          {!isLoading && !error && !content && (
            <div className="flex min-h-[300px] items-center justify-center text-sm text-muted-foreground">
              Konten struk kosong
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex shrink-0 justify-end gap-2 border-t bg-white px-4 py-3 dark:bg-slate-900">
          <Button type="button" variant="outline" onClick={onClose}>
            Tutup
          </Button>

          <Button
            type="button"
            onClick={handlePrint}
            disabled={isLoading || Boolean(error) || !content}
            className="gap-2 bg-green-600 text-white hover:bg-green-700">
            <Printer size={16} />
            Print Struk
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default StrukViewModal;
