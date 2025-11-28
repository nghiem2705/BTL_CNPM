import { Search } from "lucide-react";

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative my-4">
      <input
        type="text"
        placeholder="Tìm kiếm tên giảng viên, môn học..."
        className="w-full border border-gray-300 bg-gray-100 rounded-md pl-10 py-2 text-sm focus:outline-blue-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
      <Search className="absolute left-3 top-2.5 text-gray-400" size={18} />
    </div>
  );
}
