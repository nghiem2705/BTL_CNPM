from .BaseController import BaseController
from polls.entity.SessionEntity import *
from datetime import datetime, timedelta
import os
from django.conf import settings

class SchedulerController(BaseController):

    SESSION_PATH = [str(settings.BASE_DIR), "data", "session.json"]
    SESSION_PER_PAGE = 10

    def __init__(self):
        super().__init__()
        
        self.all_sessions = []
        self.update()

        # user data path
        self.USER_PATH = ["data", "user.json"]

    def update(self):
        self.all_sessions = self.getAllSessions()

    def sortSessions(self):
        self.all_sessions.sort(key=lambda x: int(x.session_id[2:]))

    def writeSession(self):
        self.sortSessions()
        # tiền xử lý dữ liệu đưa về dạng dictionary
        data = {ss.session_id: ss.to_dictionary() for ss in self.all_sessions}
        # ghi vào file
        to_return = super().writeFile(self.SESSION_PATH, data)
        # cập nhật lại danh sách
        self.update()

        return to_return

    def readFile(self):
        return super().readFile(self.SESSION_PATH)

    def getAllSessions(self):
        data = self.readFile()
        to_return = []
        for key, value in data.items():
            ss = Session(key, 
                        value['name'],
                        value['tutor'],
                        value['students'],
                        value['date'],
                        value['time'],
                        value['duration'],
                        value['online'],
                        value['address'],
                        value['link'],
                        value['description'],
                        value['note'],
                        value['document'])
            to_return.append(ss)
        return to_return

    def getSessionById(self, session_id):
        """
        session_id: str -> id của buổi học cần lấy
        """
        ss_having_id = [ss for ss in self.all_sessions if ss.session_id == session_id]
        return ss_having_id[0] if ss_having_id else None

    def getSessions(self, page, keyword, sort_filer, status = SessionStatus.NOT_SET):

        filtered_sessions = self.all_sessions.copy()
        if status != SessionStatus.NOT_SET:
            filtered_sessions = [ss for ss in filtered_sessions if ss.status == status]
        
        if sort_filer == SessionFiler.DATE:
            filtered_sessions.sort(key=lambda x: x.date)
        elif sort_filer == SessionFiler.NAME:
            filtered_sessions.sort(key=lambda x: x.name)
        elif sort_filer == SessionFiler.DURATION:
            filtered_sessions.sort(key=lambda x: x.duration)

        print(keyword)
        if keyword != "" and keyword is not None:
            filtered_sessions = [ss for ss in filtered_sessions if keyword.lower() in ss.name.lower()]

        result = []
        for i in range((page - 1) * self.SESSION_PER_PAGE, min(page * self.SESSION_PER_PAGE, len(filtered_sessions))):
            result.append(filtered_sessions[i])
            
        return result

    def removeSession(self, session_id):
        """
        session_id: str -> id của buổi học cần xóa
        """
        self.all_sessions.remove(self.getSessionById(session_id))
        self.writeSession()

    def updateSession(self, session_id, new_session):
        """
        session_id: str -> id của buổi học cần cập nhật
        """
        current = self.getSessionById(session_id)
        if current is not None:
            self.all_sessions.remove(current)
        self.all_sessions.append(new_session)
        self.writeSession()

    def addSession(self, new_session):
        if self.checkDate(new_session) is True:
            self.all_sessions.append(new_session)
            self.writeSession()
            return True
        else:
            return False

    def checkDate(self, new_session):
        # new_date = new_session.date
        # new_startime = float(new_session.time)
        # new_endtime = new_startime + (float(new_session.duration) / 60)
        new_start_str = new_session.date + " " + new_session.time
        new_startime = datetime.strptime(new_start_str, "%Y-%m-%d %H:%M")
        new_endtime = new_startime + timedelta(minutes=new_session.duration)

        for session in self.all_sessions:
            # chinh no
            if session.session_id == new_session.session_id:
                continue
            # Khac ngay
            if session.date != new_session.date:
                continue

            # Check
            existing_star_str = session.date + " " + session.time
            existing_start = datetime.strptime(existing_star_str, "%Y-%m-%d %H:%M")
            existing_end = existing_start + timedelta(minutes=session.duration)

            # Logic xu ly
            if new_startime < existing_end and existing_start < new_endtime:
                print(f"Trùng lịch với {session.session_id}") 
                return False
        return True

##################################################
    # Helpers
    def read_users(self) -> dict:
        try:
            return super().readFile(self.USER_PATH) or {}
        except Exception:
            return {}

    def write_users(self, data: dict) -> bool:
        try:
            super().writeFile(self.USER_PATH, data)
            return True
        except Exception:
            return False

    def get_sessions_by_tutor(self, tutor_id: str) -> list[Session]:
        """Lấy tất cả các buổi học của tutor theo tutor_id"""
        return [ss for ss in self.all_sessions if ss.tutor == tutor_id]

    def get_sessions_registered_by_student(self, student_id: str) -> list[Session]:
        """Lấy tất cả các buổi học mà student đã đăng ký theo student_id"""
        return [ss for ss in self.all_sessions if student_id in (ss.students or [])]

    def register_student_to_session(self, student_id: str, session_id: str) -> tuple[bool, str]:
        """Sinh viên đăng ký tham gia buổi học"""
        ss = self.getSessionById(session_id)
        if ss is None:
            return False, "Session not found"
        if ss.students is None:
            ss.students = []
        if student_id in ss.students:
            return False, "Already registered"
        ss.students.append(student_id)
        self.writeSession()
        
        return True, "Registered"

    def unregister_student_from_session(self, student_id: str, session_id: str) -> tuple[bool, str]:
        """Sinh viên hủy đăng ký tham gia buổi học"""
        ss = self.getSessionById(session_id)
        if ss is None:
            return False, "Session not found"
        if ss.students is None or student_id not in ss.students:
            return False, "Not registered"
        ss.students.remove(student_id)
        self.writeSession()
        
        return True, "Unregistered"

    def student_follow_tutor(self, student_id: str, tutor_id: str) -> tuple[bool, str]:
        """
        Student follows Tutor:
        - Add tutor_id to student's `tutor` list
        - Add student_id to tutor's `students` list
        Enforces roles: follower must be student, target must be tutor.
        """
        if student_id == tutor_id:
            return False, "Cannot follow self"
        users = self.read_users()
        if student_id not in users or tutor_id not in users:
            return False, "User not found"

        student = users[student_id]
        tutor = users[tutor_id]
        if student.get("role") != "student" or tutor.get("role") != "tutor":
            return False, "Invalid roles: require student->tutor"

        student_tutors = student.get("tutors", [])
        if tutor_id in student_tutors:
            return False, "Already following"
        student_tutors.append(tutor_id)
        student["tutors"] = student_tutors

        tutor_students = tutor.get("students", [])
        if student_id not in tutor_students:
            tutor_students.append(student_id)
            tutor["students"] = tutor_students

        if not self.write_users(users):
            return False, "Write failed"
        return True, "Followed"

    def student_unfollow_tutor(self, student_id: str, tutor_id: str) -> tuple[bool, str]:
        """
        Student unfollows Tutor:
        - Remove tutor_id from student's `tutor` list
        - Remove student_id from tutor's `students` list (if present)
        Enforces roles: follower must be student, target must be tutor.
        """
        users = self.read_users()
        if student_id not in users or tutor_id not in users:
            return False, "User not found"
        student = users[student_id]
        tutor = users[tutor_id]
        if student.get("role") != "student" or tutor.get("role") != "tutor":
            return False, "Invalid roles: require student->tutor"

        student_tutors = student.get("tutors", [])
        if tutor_id not in student_tutors:
            return False, "Not following"
        student_tutors.remove(tutor_id)
        student["tutors"] = student_tutors

        tutor_students = tutor.get("students", [])
        if student_id in tutor_students:
            tutor_students.remove(student_id)
            tutor["students"] = tutor_students

        if not self.write_users(users):
            return False, "Write failed"
        return True, "Unfollowed"
    
    def get_sessions_not_registered_by_student(self, student_id: str) -> list[Session]:
        """Lấy tất cả các buổi học mà student chưa đăng ký theo student_id"""
        return [ss for ss in self.all_sessions if ss.students is None or student_id not in ss.students]