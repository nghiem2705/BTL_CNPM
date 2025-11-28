import { Mail, Phone } from "lucide-react";

export default function TutorCard({ tutor }) {
  return (
    <div className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition">
      <div className="flex items-center gap-3 mb-2">
        <img
          src={tutor.avatar}
          alt={tutor.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-bold text-sm">{tutor.name}</h3>
          <p className="text-xs text-gray-500">{tutor.subject}</p>
          <p className="text-yellow-500 text-xs">
            ⭐ {tutor.rating} · Số học viên: {tutor.students}
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-600 mb-2">{tutor.desc}</p>

      {/* Majors */}
      <div className="flex flex-wrap gap-2 text-xs mb-3">
        {tutor.majors.map((m, i) => (
          <span key={i} className="px-2 py-1 bg-gray-200 rounded">
            {m}
          </span>
        ))}
      </div>

      {/* Contact */}
      <div className="text-xs text-gray-600 space-y-1 mb-3">
        <p className="flex items-center gap-1">
          <Mail size={14} /> {tutor.email}
        </p>
        <p className="flex items-center gap-1">
          <Phone size={14} /> {tutor.phone}
        </p>
      </div>

      <button
        className={`w-full py-1.5 text-sm font-semibold rounded 
          ${tutor.registered
            ? "bg-gray-300 text-gray-600 cursor-default"
            : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
      >
        {tutor.registered ? "Đã đăng ký" : "Đăng ký"}
      </button>
    </div>
  );
}
