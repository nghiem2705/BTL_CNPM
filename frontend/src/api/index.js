// src/api/index.js

export const mockSessions = [
  {
    id: 1,
    title: "Ứng dụng đại số trong công nghệ",
    date: "2025-11-05",
    displayDate: "Thứ tư, 5/11/2025",
    startTime: "10:00",
    endTime: "11:30",
    duration: "90 phút",
    status: "upcoming", 
    location: "Google Meet",
    meetLink: "https://meet.google.com/gfs-iocr-yks",
    description: "Giúp người học hiểu rõ vai trò và ứng dụng của đại số...",
    note: "Nhớ xem trước tài liệu chương 1 nhé các em!",
    files: [{ name: "Slide_Chuong_1.pdf", size: "2.3 MB" }]
  },
  {
    id: 2,
    title: "Nhập môn Trí tuệ nhân tạo (AI Basics)",
    date: "2025-10-29",
    displayDate: "Thứ tư, 29/10/2025",
    startTime: "07:00",
    endTime: "08:30",
    duration: "90 phút",
    status: "finished",
    location: "Google Meet",
    meetLink: "",
    description: "Giới thiệu các khái niệm cơ bản về AI...",
    note: "Đã tổng kết điểm danh.",
    files: []
  },
  {
    id: 3,
    title: "Lập trình Web Frontend với ReactJS",
    date: "2025-12-01",
    displayDate: "Thứ hai, 01/12/2025",
    startTime: "13:00",
    endTime: "16:00",
    duration: "180 phút",
    status: "upcoming", 
    location: "Phòng 201-H6",
    meetLink: "",
    description: "Hướng dẫn thực hành ReactJS...",
    note: "Yêu cầu mang laptop...",
    files: [{ name: "React_Cheatsheet.pdf", size: "1.5 MB" }]
  }
];
