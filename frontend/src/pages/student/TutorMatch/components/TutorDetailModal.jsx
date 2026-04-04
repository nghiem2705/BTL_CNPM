import React from 'react';
import { X, Mail, Phone, MapPin, Activity, BookOpen, Star, Lightbulb, User, CheckCircle2 } from 'lucide-react';
import { studentTutorApi } from '../../../../api/StudentGetTutor';

export default function TutorDetailModal({ tutor, uID, onClose }) {
  if (!tutor) return null;

  const features = tutor.description?.features || {};
  const { hard_filters = {}, hard_skills = {}, vibe = {} } = features;
  const specific_skills = hard_skills.specific_skills || {};

  const handleFollow = async (e) => {
    e.stopPropagation();
    if (window.confirm(`Bạn có chắc chắn theo học Tutor: "${tutor.name}"?`)) {
      try {
        await studentTutorApi.followTutor(uID, tutor.id);
        alert("Theo học thành công!");
        window.location.reload();
      } catch (error) {
        alert("Lỗi khi thực thi! Vui lòng thử lại.");
      }
    }
  };

  const handleUnfollow = async (e) => {
    e.stopPropagation();
    if (window.confirm(`Bạn có chắc chắn muốn hủy theo Tutor: "${tutor.name}"?`)) {
      try {
        await studentTutorApi.unfollowTutor(uID, tutor.id);
        window.location.reload();
        alert("Hủy đăng ký thành công!");
      } catch (error) {
        alert("Lỗi khi thực thi! Vui lòng thử lại.");
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-3xl max-h-[90vh] overflow-y-auto relative animate-fade-in-up">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 bg-gray-100 p-2 rounded-full hover:bg-red-100 hover:text-red-500 transition"
        >
          <X size={20} />
        </button>

        {/* Header Section */}
        <div className="flex flex-col md:flex-row gap-6 mb-8 mt-2 items-center md:items-start text-center md:text-left">
          <img
            src={"/avatar/icon.png"}
            alt={tutor.name}
            className="w-24 h-24 rounded-full object-cover shadow-md border-4 border-white"
          />
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-[#102A43] mb-1">{tutor.name}</h2>
            <div className="flex flex-wrap gap-2 justify-center md:justify-start items-center mb-3">
              <span className="text-sm font-semibold bg-[#006D77] text-white px-3 py-1 rounded-full">
                {hard_skills.domain || "Không chỉ định ngành"}
              </span>
              <p className="text-yellow-500 text-sm font-bold flex items-center gap-1">
                <Star size={16} fill="currentColor" /> {tutor.rate} Đánh giá
              </p>
              {tutor.matched && tutor.matched !== -1 && (
                <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full font-bold flex items-center gap-1">
                  <CheckCircle2 size={16} /> Độ phù hợp: {(tutor.matched * 100).toFixed(0)}%
                </span>
              )}
            </div>

            <p className="text-gray-600 text-sm italic mb-4 max-w-xl">
              {tutor.description?.text || "Chưa có giới thiệu về bản thân."}
            </p>

            <div className="flex flex-wrap gap-4 text-sm text-gray-500 justify-center md:justify-start">
              <span className="flex items-center gap-1"><Mail size={16} /> {tutor.mail}</span>
              <span className="flex items-center gap-1"><Phone size={16} /> {tutor.phone}</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-3 mb-8 border-b pb-8">
          {tutor.registered ? (
            <>
              <button
                onClick={handleUnfollow}
                className="flex-1 py-3 font-semibold rounded-lg bg-red-500 text-white hover:bg-red-600 transition"
              >
                Hủy đăng ký
              </button>
              <button
                className="flex-1 py-3 font-semibold rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
              >
                Đánh giá (Sắp ra mắt)
              </button>
            </>
          ) : (
            <button
              onClick={handleFollow}
              className="w-full py-3 font-semibold rounded-lg bg-[#006D77] text-white hover:bg-[#00565e] transition"
            >
              Đăng ký theo học
            </button>
          )}
        </div>

        {/* Detailed Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* HARD SKILLS */}
          <div className="bg-blue-50/50 p-5 rounded-xl border border-blue-100">
            <h3 className="font-bold text-[#102A43] flex items-center gap-2 mb-4">
              <BookOpen size={18} className="text-[#006D77]" /> Kỹ năng chuyên môn
            </h3>

            <div className="space-y-4 text-sm">
              <div>
                <span className="font-semibold text-gray-700 block mb-1">Phương pháp giảng dạy:</span>
                <div className="flex gap-2 flex-wrap">
                  {(hard_skills.method || []).map((v, i) => (
                    <span key={i} className="px-2 py-1 bg-white border border-gray-200 rounded text-gray-600">{v}</span>
                  ))}
                  {(!hard_skills.method || hard_skills.method.length === 0) && <span className="text-gray-400">Không có</span>}
                </div>
              </div>

              {specific_skills.domain_skills && specific_skills.domain_skills.length > 0 && (
                <div>
                  <span className="font-semibold text-gray-700 block mb-1">Kỹ năng cốt lõi:</span>
                  <ul className="list-disc list-inside text-gray-600 space-y-1 ml-2">
                    {specific_skills.domain_skills.map((skill, i) => (
                      <li key={i}>{skill}</li>
                    ))}
                  </ul>
                </div>
              )}

              {specific_skills.soft_skills && specific_skills.soft_skills.length > 0 && (
                <div>
                  <span className="font-semibold text-gray-700 block mb-1">Kỹ năng mềm hỗ trợ:</span>
                  <div className="flex gap-2 flex-wrap">
                    {specific_skills.soft_skills.map((skill, i) => (
                      <span key={i} className="px-2 py-1 bg-orange-100 text-orange-700 border border-orange-200 rounded">{skill}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* HARD FILTERS */}
          <div className="bg-gray-50 p-5 rounded-xl border border-gray-100">
            <h3 className="font-bold text-[#102A43] flex items-center gap-2 mb-4">
              <MapPin size={18} className="text-[#006D77]" /> Điều kiện lớp học
            </h3>
            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <span className="font-semibold block mb-1">Hình thức học:</span>
                <span className="inline-block px-3 py-1 bg-white border rounded text-blue-700 font-medium">{hard_filters.format || 'Không rõ'}</span>
              </p>
              <p>
                <span className="font-semibold block mb-1">Sĩ số lớp:</span>
                <span className="inline-block px-3 py-1 bg-white border rounded text-gray-600">{hard_filters.class_size || 'Không rõ'}</span>
              </p>
              <div>
                <span className="font-semibold block mb-1">Thời gian rảnh:</span>
                <div className="flex gap-2 flex-wrap mt-1">
                  {(hard_filters.availability || []).map((v, i) => (
                    <span key={i} className="px-2 py-1 bg-green-50 text-green-700 border border-green-200 rounded">{v}</span>
                  ))}
                  {(!hard_filters.availability || hard_filters.availability.length === 0) && <span className="text-gray-400">Không có</span>}
                </div>
              </div>
            </div>
          </div>

          {/* VIBE */}
          <div className="md:col-span-2 bg-purple-50/50 p-5 rounded-xl border border-purple-100">
            <h3 className="font-bold text-[#102A43] flex items-center gap-2 mb-4">
              <Activity size={18} className="text-[#006D77]" /> Định hướng & Phong cách dạy
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-semibold text-gray-700 block mb-2">Đường hướng phát triển hướng tới:</span>
                <div className="flex gap-2 flex-wrap">
                  {(vibe.development_path || []).map((path, i) => (
                    <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 border border-purple-200 rounded">{path}</span>
                  ))}
                  {(!vibe.development_path || vibe.development_path.length === 0) && <span className="text-gray-400">Không có</span>}
                </div>
              </div>
              <div>
                <span className="font-semibold text-gray-700 block mb-2">Phong cách dạy:</span>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-200 rounded-full h-2.5">
                    <div className="bg-[#006D77] h-2.5 rounded-full" style={{ width: `${(vibe.energy_scale || 1) * 20}%` }}></div>
                  </div>
                  <span className="font-bold text-[#006D77]">{vibe.energy_scale || 1}/5</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Trầm tính (1)</span>
                  <span>Sôi nổi (5)</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
