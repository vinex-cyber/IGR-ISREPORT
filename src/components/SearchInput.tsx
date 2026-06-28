import { Input } from "@/components/ui/input";
import { TfiSearch } from "react-icons/tfi";

/**
 * Komponen SearchInput
 * @param {string} value - Nilai yang akan di tampilkan di input
 * @param {function} onChange - Fungsi yang akan di panggil ketika nilai berubah
 * @param {string} placeholder - Teks placeholder yang akan di tampilkan di input
 * @param {string} className - Nama class yang akan di tambahkan ke input
 * @returns {JSX.Element} - Komponen SearchInput
 * */

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = "Cari...",
  className = "",
}) => {
  return (
    <div className="relative w-full max-w-sm">
      {/* Wrapper flex untuk icon agar center tanpa top-1/2 */}
      <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
        <TfiSearch className="text-gray-400 text-sm" />
      </div>
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className={`pl-10 rounded-md text-sm h-8 border-black bg-zinc-100 dark:border-zinc-600 dark:bg-zinc-800 ${className}`}
      />
    </div>
  );
};

export default SearchInput;
