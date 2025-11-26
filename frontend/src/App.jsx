import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './layout';
import Home from './pages/Home';
import ConsultationDetail from './pages/ConsultationDetail'; // Import trang mới

function App() {
  return (
    <Router>
      <Layout>
        <Routes>
          {/* Trang chủ: Hiện danh sách */}
          <Route path="/" element={<Home />} />
          
          {/* Trang chi tiết: Hiện thông tin buổi tư vấn theo ID */}
          <Route path="/consultation/:id" element={<ConsultationDetail />} />
        </Routes>
      </Layout>
    </Router>
  );
}

export default App;
