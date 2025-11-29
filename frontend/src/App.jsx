import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate} from 'react-router-dom';

// Import header/footer
import Layout from './layout';
import PublicHeader from './layout/Header/public_header';
import TutorHeader from './layout/Header/tutor_index';
import StudentHeader from './layout/Header/student_index';

// Import Tutor page
import TutorConsultationDetail from './pages/tutor/ConsultationDetail'; // Import trang mới
import TutorConsultation from "./pages/tutor/Consultation";
import TutorConsultationCreate from "./pages/tutor/ConsultationCreate";

// Import Student page
import StudentConsultation from "./pages/student/Consultation";
import StudentConsultationRegister from "./pages/student/ConsultationRegister";
import StudentConsultationDetail from "./pages/student/ConsultationDetail";
import TutorMatch from "./pages/student/TutorMatch";

// Import Guest Interface and Login page
import Home from './pages/Home/Home';
import RoleSelection from './pages/Login/RoleSelection';
import Login from './pages/Login/index'
import NotFound from "./pages/NotFound";

function App() {
  return (
    <Router>
      {/* <Layout> */}
        <Routes>
          {/* <Route path="/" element={<Navigate to="/tutor" replace />} /> 
          <Route path="/" element={<Login />} />
          <Route path="/tutor" element={<TutorHome />} />
          <Route path="/tutor/sessions" element={<Session/>}/>
          <Route path="/sessions/:id" element={<ConsultationDetail />} /> */}

          {/*  GIAO DIỆN KHÁCH */}
          <Route path="/" element={ 
            <Layout header={<PublicHeader />}> 
                <Home /> 
            </Layout>
          } />


          {/* TRANG TUTOR */}
          <Route path="/tutor" element={
              <Layout header={<TutorHeader />}> 
                  <Home /> 
              </Layout>
          } />

          <Route path="/tutor/sessions" element={
              <Layout header={<TutorHeader />}> 
                  <TutorConsultation /> 
              </Layout>
          } />
          
          <Route path="/tutor/create" element={
              <Layout header={<TutorHeader />}> 
                  <TutorConsultationCreate />
              </Layout>
          } />

          <Route path="/tutor/library" element={
              <Layout header={<TutorHeader />}> 
                  {/* Thêm trang chỗ này */}
              </Layout>
          } />

          <Route path="/tutor/students" element={
              <Layout header={<TutorHeader />}> 
                  {/* Thêm trang chỗ này */}
              </Layout>
          } />

          <Route path="/tutor/profile" element={
              <Layout header={<TutorHeader />}> 
                  {/* Thêm trang chỗ này */}
              </Layout>
          } />

          <Route path="/tutor/sessions/:id" element={
              <Layout header={<TutorHeader />}> 
                  <TutorConsultationDetail /> 
              </Layout>
          } />

          {/* TRANG STUDENT */}
          <Route path="/student" element={
              <Layout header={<StudentHeader />}> 
                  <Home /> 
              </Layout>
          } />

          <Route path="/student/tutors" element={
              <Layout header={<StudentHeader />}> 
                  <TutorMatch />
              </Layout>
          } />

          <Route path="/student/library" element={
              <Layout header={<StudentHeader />}> 
                  {/* Thêm trang chỗ này */}
              </Layout>
          } />

          <Route path="/student/sessions/registered" element={
              <Layout header={<StudentHeader />}> 
                  <StudentConsultation />
              </Layout>
          } />

          <Route path="/student/sessions/registered/:id" element={
              <Layout header={<StudentHeader />}> 
                  <StudentConsultationDetail />
              </Layout>
          } />

          <Route path="/student/sessions/register" element={
              <Layout header={<StudentHeader />}> 
                  <StudentConsultationRegister/>
              </Layout>
          } />

          <Route path="/student/profile" element={
              <Layout header={<StudentHeader />}> 
                  {/* Thêm trang chỗ này */}
              </Layout>
          } />


          {/* TRANG ĐĂNG NHẬP */}
          <Route path="/select-role" element={<RoleSelection />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      {/* </Layout> */}
    </Router>
  );
}

export default App;
