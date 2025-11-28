import { useState } from "react";
import TabsFilter from "./components/TabsFilter";
import SearchBar from "./components/SearchBar";
import SummaryBox from "./components/SummaryBox";
import TutorGrid from "./components/TutorGrid";
//* Mock data
import { tutors } from "./tutorsData";

export default function Tutors() {
  const [activeTab, setActiveTab] = useState("all");
  const [search, setSearch] = useState("");

  const filtered = tutors.filter(t => {
    const matchesSearch =
      t.name.toLowerCase().includes(search.toLowerCase()) ||
      t.subject.toLowerCase().includes(search.toLowerCase());

    if (activeTab === "registered") return t.registered && matchesSearch;
    if (activeTab === "unregistered") return !t.registered && matchesSearch;

    return matchesSearch; // all
  });

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
