import { LucideUser } from "lucide-react";

export default function SummaryBox({ count }) {
  return (
    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-md border shadow-sm text-sm">
      <LucideUser size={18} className="text-gray-600" />
      <span>Tổng số giảng viên: {count}</span>
    </div>
  );
}
