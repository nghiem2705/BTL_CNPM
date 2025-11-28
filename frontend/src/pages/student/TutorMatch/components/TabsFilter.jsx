export default function TabsFilter({ active, onChange }) {
  const tabs = [
    { key: "all", label: "Tất cả" },
    { key: "registered", label: "Đã đăng ký" },
    { key: "unregistered", label: "Chưa đăng ký" }
  ];

  return (
    <div className="flex gap-2">
      {tabs.map(tab => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-4 py-1.5 rounded text-xs font-bold transition-all
            ${active === tab.key
              ? "bg-blue-100 text-blue-800"
              : "text-gray-600 hover:bg-gray-200"
            }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}
