import { useEffect, useState } from "react";
import TabsFilter from "./components/TabsFilter";
import SearchBar from "./components/SearchBar";
import SummaryBox from "./components/SummaryBox";
import TutorGrid from "./components/TutorGrid";
//* Mock data
import { studentTutorApi } from '../../../api/StudentGetTutor';
import { useNavigate, useParams } from 'react-router-dom';

export default function Tutors() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");
  const { uID } = useParams()
  const [tutors, setTutors] = useState([]);

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
    fetchRecommendedTutors(uID, activeTab, search);
  }, [uID, activeTab, search]); // Re-fetch khi filter thay đổi

  // show tutor card
  return (
    <div className="p-6">
      {/* Header row */}
      <div className="flex justify-between items-center mb-4">
        <TabsFilter active={activeTab} onChange={setActiveTab} />
        <SummaryBox count={tutors.length} />
      </div>

      <SearchBar value={search} onChange={setSearch} />

      <TutorGrid tutors={tutors} />
    </div>
  );
}