// src/components/ui/BaseModal.tsx
import { ReactNode, useEffect } from "react";
import { createPortal } from "react-dom";
import { useModalSlide, ModalSlideConfig } from "@/hooks/animation/useModalSlide";
import { X } from "lucide-react";

interface BaseModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  loading?: boolean;
  empty?: boolean;
  emptyMessage?: string;
  maxWidth?: string;
  headerRight?: ReactNode;
  contentClassName?: string;
  slideOptions?: ModalSlideConfig;
  children: ReactNode;
}

export default function BaseModal({
  isOpen,
  onClose,
  title,
  subtitle,
  loading = false,
  empty = false,
  emptyMessage = "Tidak ada data",
  maxWidth = "max-w-3xl",
  headerRight,
  contentClassName = "",
  slideOptions,
  children,
}: BaseModalProps) {
  const { overlayRef, contentRef, handleClose } = useModalSlide({
    isOpen,
    ...slideOptions,
  });

  useEffect(
    function closeOnEscape() {
      function handleKeyDown(e: KeyboardEvent) {
        if (e.key === "Escape") handleClose(onClose);
      }
      document.addEventListener("keydown", handleKeyDown);
      return function removeEventListener() {
        document.removeEventListener("keydown", handleKeyDown);
      };
    },
    [onClose, handleClose],
  );

  useEffect(
    function lockBodyScroll() {
      if (isOpen) {
        document.body.style.overflow = "hidden";
      }
      return function unlockBodyScroll() {
        document.body.style.overflow = "";
      };
    },
    [isOpen],
  );

  if (!isOpen) return null;

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[100] flex items-end justify-end bg-black/60 opacity-0 sm:items-center sm:justify-center"
      onClick={() => handleClose(onClose)}>
      <div
        ref={contentRef}
        className={`flex h-full w-full ${maxWidth} flex-col bg-white shadow-2xl opacity-0 sm:h-auto sm:rounded-lg`}
        onClick={(e) => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between border-b bg-gradient-to-r from-blue-500 to-blue-600 p-4 text-white sm:rounded-t-lg">
          <div>
            <h2 className="text-lg font-bold">{title}</h2>
            {subtitle && (
              <p className="text-xs opacity-90">{subtitle}</p>
            )}
          </div>
          <div className="flex items-center gap-2">
            {headerRight}
            <button
              className="rounded-lg bg-white/20 p-2 transition-colors hover:bg-white/30"
              onClick={() => handleClose(onClose)}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className={`flex-1 overflow-auto p-4 ${contentClassName}`}>
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-gray-400">Memuat data...</p>
            </div>
          ) : empty ? (
            <div className="flex items-center justify-center py-12">
              <p className="text-sm text-gray-400">{emptyMessage}</p>
            </div>
          ) : (
            children
          )}
        </div>
      </div>
    </div>,
    document.body,
  );
}
