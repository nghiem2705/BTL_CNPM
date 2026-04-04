import { Mail, Phone } from "lucide-react";
import { studentTutorApi } from '../../../../api/StudentGetTutor';
import { useNavigate, useParams } from 'react-router-dom';

export default function TutorCard({ tutor, onClick }) {

  // const navigate = useNavigate();
  const { uID } = useParams()
  const handleFollow = async (e, student_id, tutor_id, name) => {
    e.stopPropagation();

    if (window.confirm(`Bạn có chắc chắn theo học Tutor: "${name}"?`)) {
      try {
        // console.log(id);
        await studentTutorApi.followTutor(student_id, tutor_id);
        alert("Theo học thành công!");
        window.location.reload();
      } catch (error) {
        alert("Lỗi khi thực thi! Vui lòng thử lại.");
      }
    }
  };

  const handleUnfollow = async (e, student_id, tutor_id, name) => {
    e.stopPropagation();

    if (window.confirm(`Bạn có chắc chắn muốn hủy theo Tutor: "${name}"?`)) {
      try {
        // console.log(id);
        await studentTutorApi.unfollowTutor(student_id, tutor_id);
        window.location.reload();
        alert("Hủy đăng ký thành công!");
      } catch (error) {
        alert("Lỗi khi thực thi! Vui lòng thử lại.");
      }
    }
  };

  return (
    <div onClick={onClick} className="border rounded-xl p-4 bg-white shadow-sm hover:shadow-md transition flex flex-col h-full cursor-pointer">

      {/* Avatar + Info */}
      <div className="flex items-center gap-3 mb-2">
        <img
          src={"/avatar/icon.png"}
          alt={tutor.name}
          className="w-12 h-12 rounded-full object-cover"
        />
        <div>
          <h3 className="font-bold text-sm">{tutor.name}</h3>
          <p className="text-xs text-gray-500 font-medium">
            {tutor.description?.features?.hard_skills?.domain || ''}
          </p>
          <div className="flex gap-2 items-center mt-1">
            <p className="text-yellow-500 text-xs font-bold">⭐ {tutor.rate}</p>
            {tutor.matched && tutor.matched !== -1 && (
              <span className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5 rounded-full font-bold">
                Độ phù hợp: {(tutor.matched * 100).toFixed(0)}%
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Description */}
      <p className="text-xs text-gray-600 mb-2 truncate">
        {tutor.description?.text}
      </p>

      {/* Strength / Format / Method */}
      <div className="flex flex-wrap gap-1 mb-3">
        {tutor.description?.features?.hard_filters?.format && (
          <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-[10px] rounded border border-blue-200">
            {tutor.description.features.hard_filters.format}
          </span>
        )}
        {tutor.description?.features?.hard_skills?.method?.map((m, i) => (
          <span key={i} className="px-2 py-0.5 bg-gray-100 text-gray-600 text-[10px] rounded border border-gray-200">
            {m}
          </span>
        ))}
      </div>

      {/* Contact */}
      <div className="text-xs text-gray-600 space-y-1 mb-3">
        <p className="flex items-center gap-1">
          <Mail size={14} /> {tutor.mail}
        </p>
        <p className="flex items-center gap-1">
          <Phone size={14} /> {tutor.phone}
        </p>
      </div>

      {/* BUTTON — Luôn ở đáy */}
      <div className="mt-auto pt-2">
        {tutor.registered ? (
          <div className="flex gap-2">
            <button
              onClick={(e) => handleUnfollow(e, uID, tutor.id, tutor.name)}
              className="w-full py-1.5 text-sm font-semibold rounded bg-red-500 text-white hover:bg-red-700"
            >
              Hủy đăng ký
            </button>

            <button
              className="w-full py-1.5 text-sm font-semibold rounded bg-green-600 text-white hover:bg-green-700"
            >
              Đánh giá
            </button>
          </div>
        ) : (
          <button
            onClick={(e) => handleFollow(e, uID, tutor.id, tutor.name)}
            className="w-full py-1.5 text-sm font-semibold rounded bg-blue-600 text-white hover:bg-blue-700"
          >
            Đăng ký
          </button>
        )}
      </div>
    </div>
  );
}