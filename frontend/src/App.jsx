import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import TutorLayout from './tutor_layout';
import Home from './pages/Home';
import ConsultationDetail from './pages/ConsultationDetail'; // Import trang mới

// Làm rõ xíu về cái app này nha
// App này là cái khung chính của ứng dụng React
// Nó sử dụng React Router để quản lý các trang khác nhau trong ứng dụng
// Ở đây có hai trang chính:
function App() {
  return (
    <Router>
      {/*tutor view*/}
      <TutorLayout>
        <Routes>
          
          {/* Trang chủ: Hiện danh sách */}
          <Route path="/" element={<Home />} />
          {/* Trang chi tiết: Hiện thông tin buổi tư vấn theo ID */}
          <Route path="/consultation/:id" element={<ConsultationDetail />} />
        
          {/*student view - chưa có gì nên tạm ẩn đi*/}

        </Routes>
      </TutorLayout>
      {/*student view*/}
      {/*<TutorLayout> */}
      {/* <Routes> */}
          
          {/* Trang chủ: Hiện danh sách */}
          {/* <Route path="/" element={<Home />} /> */}
          {/* Trang chi tiết: Hiện thông tin buổi tư vấn theo ID */}
          {/* <Route path="/consultation/:id" element={<ConsultationDetail />} /> */}
        
          {/*student view - chưa có gì nên tạm ẩn đi*/}

      {/* </Routes> */}
      {/* </TutorLayout> */}
    </Router>
  );
}

export default App;
