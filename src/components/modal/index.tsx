// src/components/Modal.tsx

import {
  type PointerEvent,
  type ReactNode,
  useEffect,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { IoCloseCircleSharp } from "react-icons/io5";

interface ModalProps {
  show: boolean;
  onClose: () => void;
  children: ReactNode;

  /**
   * Urutan lapisan modal.
   *
   * Modal utama: 50
   * Modal di atas modal utama: 60
   */
  zIndex?: number;

  /**
   * Menutup modal ketika backdrop diklik.
   *
   * @default true
   */
  closeOnBackdrop?: boolean;

  /**
   * Menutup modal ketika tombol Escape ditekan.
   *
   * @default true
   */
  closeOnEscape?: boolean;
}

/**
 * Menyimpan jumlah modal yang sedang terbuka.
 * Digunakan agar body scroll tidak terbuka ketika
 * masih ada modal lain yang aktif.
 */
let openedModalCount = 0;
let previousBodyOverflow = "";

/**
 * Menyimpan urutan modal.
 * Escape hanya akan menutup modal paling atas.
 */
const modalStack: symbol[] = [];

export default function Modal({
  show,
  onClose,
  children,
  zIndex = 50,
  closeOnBackdrop = true,
  closeOnEscape = true,
}: ModalProps) {
  const [mounted, setMounted] = useState(false);

  const modalIdRef = useRef(Symbol("modal"));

  useEffect(function setMountedState() {
    setMounted(true);
  }, []);

  // Lock body scroll dan mencatat urutan modal.
  useEffect(function lockBodyScroll() {
    if (!show) {
      return;
    }

    const modalId = modalIdRef.current;

    modalStack.push(modalId);

    if (openedModalCount === 0) {
      previousBodyOverflow = document.body.style.overflow;

      document.body.style.overflow = "hidden";
    }

    openedModalCount += 1;

    return function unlockBodyScroll() {
      const modalIndex = modalStack.lastIndexOf(modalId);

      if (modalIndex !== -1) {
        modalStack.splice(modalIndex, 1);
      }

      openedModalCount = Math.max(0, openedModalCount - 1);

      if (openedModalCount === 0) {
        document.body.style.overflow = previousBodyOverflow;
      }
    };
  }, [show]);

  // Escape hanya menutup modal paling atas.
  useEffect(function closeOnEscape() {
    if (!show || !closeOnEscape) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      const currentModalId = modalIdRef.current;

      const topModalId = modalStack[modalStack.length - 1];

      if (event.key === "Escape" && topModalId === currentModalId) {
        event.preventDefault();
        event.stopPropagation();

        onClose();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return function removeEscapeListener() {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [show, closeOnEscape, onClose]);

  const handleBackdropPointerDown = (event: PointerEvent<HTMLDivElement>) => {
    if (!closeOnBackdrop) {
      return;
    }

    /*
     * Modal hanya ditutup jika yang diklik benar-benar
     * elemen backdrop.
     *
     * Klik pada DropdownMenu Portal tidak akan memenuhi
     * kondisi ini karena event.target bukan backdrop.
     */
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  if (!mounted || !show) {
    return null;
  }

  return createPortal(
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 flex items-center justify-center bg-black/70 p-4"
      style={{ zIndex }}
      onPointerDown={handleBackdropPointerDown}>
      <div
        className="relative max-h-[90vh] w-fit max-w-[95vw] overflow-auto rounded bg-white p-6 shadow-lg dark:bg-zinc-900"
        onPointerDown={(event) => {
          event.stopPropagation();
        }}>
        <button
          type="button"
          onClick={onClose}
          className="absolute right-2 top-2 z-10 cursor-pointer text-gray-500 hover:text-gray-800"
          aria-label="Close Modal">
          <IoCloseCircleSharp
            size={30}
            className="h-10 w-10 text-red-500 hover:text-red-800"
          />
        </button>

        {children}
      </div>
    </div>,
    document.body,
  );
}
