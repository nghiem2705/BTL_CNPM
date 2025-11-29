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
          <Route path="/tutor/:uID" element={
              <Layout header={<TutorHeader />}> 
                  <Home /> 
              </Layout>
          } />

          <Route path="/tutor/:uID/sessions" element={
              <Layout header={<TutorHeader />}> 
                  <TutorConsultation /> 
              </Layout>
          } />
          
          <Route path="/tutor/:uID/create" element={
              <Layout header={<TutorHeader />}> 
                  <TutorConsultationCreate />
              </Layout>
          } />

          <Route path="/tutor/:uID/library" element={
              <Layout header={<TutorHeader />}> 
                  {/* Thêm trang chỗ này */}
              </Layout>
          } />

          <Route path="/tutor/:uID/students" element={
              <Layout header={<TutorHeader />}> 
                  {/* Thêm trang chỗ này */}
              </Layout>
          } />

          <Route path="/tutor/:uID/profile" element={
              <Layout header={<TutorHeader />}> 
                  {/* Thêm trang chỗ này */}
              </Layout>
          } />

          <Route path="/tutor/:uID/sessions/:id" element={
              <Layout header={<TutorHeader />}> 
                  <TutorConsultationDetail /> 
              </Layout>
          } />

          {/* TRANG STUDENT */}
          <Route path="/student/:uID" element={
              <Layout header={<StudentHeader />}> 
                  <Home /> 
              </Layout>
          } />

          <Route path="/student/:uID/tutors" element={
              <Layout header={<StudentHeader />}> 
                  <TutorMatch />
              </Layout>
          } />

          <Route path="/student/:uID/library" element={
              <Layout header={<StudentHeader />}> 
                  {/* Thêm trang chỗ này */}
              </Layout>
          } />

          <Route path="/student/:uID/sessions/registered" element={
              <Layout header={<StudentHeader />}> 
                  <StudentConsultation />
              </Layout>
          } />

          <Route path="/student/:uID/sessions/registered/:id" element={
              <Layout header={<StudentHeader />}> 
                  <StudentConsultationDetail />
              </Layout>
          } />

          <Route path="/student/:uID/sessions/register" element={
              <Layout header={<StudentHeader />}> 
                  <StudentConsultationRegister/>
              </Layout>
          } />

          <Route path="/student/:uID/profile" element={
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
