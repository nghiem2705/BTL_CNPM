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

  // fetch data
  useEffect(() => {
    const fetchRecommendedTutors = async (student_id) => {
      try {
        const data = await studentTutorApi.getRecommendedTutor(student_id); 
        // const mapped_data = data.map(obj => Object.values(obj)[0]);
        console.log(data)
        setTutors(data);
      } catch (error) {
        console.error("Lỗi tải danh sách:", error);
      }
    }; 
    fetchRecommendedTutors(uID);
  }, [uID]);

  // ??
  const filtered = tutors.filter(t => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.major.toLowerCase().includes(search.toLowerCase());

    if (activeTab === "registered") return t.registered && matchesSearch;
    if (activeTab === "unregistered") return !t.registered && matchesSearch;

    return matchesSearch// all
  });

  // show tutor card
  return (
    <div className="p-6">
      {/* Header row */}
      <div className="flex justify-between items-center mb-4">
        <TabsFilter active={activeTab} onChange={setActiveTab} />
        <SummaryBox count={filtered.length} />
      </div>

      <SearchBar value={search} onChange={setSearch} />

      <TutorGrid tutors={filtered} />
    </div>
  );
}