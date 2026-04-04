import { useEffect, useState } from "react";
import TabsFilter from "./components/TabsFilter";
import SearchBar from "./components/SearchBar";
import SummaryBox from "./components/SummaryBox";
import TutorGrid from "./components/TutorGrid";
import TutorDetailModal from "./components/TutorDetailModal";
import { ChevronLeft, ChevronRight } from "lucide-react";
//* Mock data
import { studentTutorApi } from '../../../api/StudentGetTutor';
import { useNavigate, useParams } from 'react-router-dom';

export default function Tutors() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const { uID } = useParams()
  const [tutors, setTutors] = useState([]);
  const [selectedTutor, setSelectedTutor] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  // fetch data - Gọi lại API khi filter thay đổi
  useEffect(() => {
    const fetchRecommendedTutors = async (student_id, filterStatus, keyword) => {
      try {
        const data = await studentTutorApi.getRecommendedTutor(student_id, filterStatus, keyword);
        console.log(data)
        setTutors(data);
      } catch (error) {
        console.error("Lỗi tải danh sách:", error);
      }
    };
    // Reset page to 1 when filters change
    setCurrentPage(1);
    fetchRecommendedTutors(uID, activeTab, search);
  }, [uID, activeTab, search]); // Re-fetch khi filter thay đổi

  // Calculate current page data
  const totalPages = Math.ceil(tutors.length / itemsPerPage);
  const currentTutors = tutors.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // show tutor card
  return (
    <div className="p-6">
      {/* Header row */}
      <div className="flex justify-between items-center mb-4">
        <TabsFilter active={activeTab} onChange={setActiveTab} />
        <SummaryBox count={tutors.length} />
      </div>

      <SearchBar value={search} onChange={setSearch} />

      <TutorGrid tutors={currentTutors} onTutorClick={setSelectedTutor} />

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center mt-10 gap-4">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Trang trước"
          >
            <ChevronLeft size={20} />
          </button>

          <div className="flex items-center gap-2">
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`w-8 h-8 flex items-center justify-center rounded-full text-sm font-semibold transition-all ${currentPage === page
                    ? 'bg-[#006D77] text-white'
                    : 'text-gray-600 hover:bg-gray-100'
                  }`}
              >
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-full text-gray-500 hover:bg-gray-100 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
            title="Trang sau"
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}

      <TutorDetailModal
        tutor={selectedTutor}
        uID={uID}
        onClose={() => setSelectedTutor(null)}
      />
    </div>
  );
}