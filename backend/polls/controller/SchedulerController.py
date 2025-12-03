from .BaseController import BaseController
from polls.entity.SessionEntity import *
from datetime import datetime, timedelta
import os
from django.conf import settings
from polls.controller.InformationController import *


class SchedulerController(BaseController):

    SESSION_PATH = [str(settings.BASE_DIR), "data", "session.json"]
    SESSION_PER_PAGE = 10

    def __init__(self):
        super().__init__()
        
        self.all_sessions = []
        self.update()
        self.infoController = InformationController()

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

    def getSessionById2(self, session_id):
        """
        session_id: str -> id của buổi học cần lấy
        """
        ss_having_id = [ss for ss in self.all_sessions if ss.session_id == session_id]
        ss = ss_having_id[0] if ss_having_id else None
        tutor = self.infoController.getProfile(ss.tutor)
        ss.tutor = tutor

        return ss

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
            # Khac tutor - không cần check conflict
            if session.tutor != new_session.tutor:
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
    def get_sessions_by_tutor(self, tutor_id: str) -> list[Session]:
        """Lấy tất cả các buổi học của tutor theo tutor_id"""
        return [ss for ss in self.all_sessions if ss.tutor == tutor_id]

    def get_sessions_registered_by_student(self, student_id: str) -> list[Session]:
        """Lấy tất cả các buổi học mà student đã đăng ký theo student_id"""
        return [ss for ss in self.all_sessions if student_id in (ss.students or [])]

    def get_sessions_registered_by_student_filtered(
        self, 
        student_id: str, 
        status_filter: int = None,
        month_filter: bool = False,
        tutor_name: str = None,
        search_keyword: str = "",
        sort_by: str = "date"
    ) -> list[Session]:
        """
        Get registered sessions with filters
        - status_filter: 2 (finished), 3 (upcoming), None (all)
        - month_filter: True to filter by current month
        - tutor_name: filter by tutor name (pass 'Tất cả' to skip)
        - search_keyword: search in session title
        - sort_by: 'date', 'title', or 'duration'
        """
        # get all registered sessions
        filtered_sessions = self.get_sessions_registered_by_student(student_id)
        
        # apply status filter
        if status_filter is not None:
            filtered_sessions = [ss for ss in filtered_sessions if ss.status == status_filter]
        
        # apply month filter
        if month_filter:
            current_date = datetime.now()
            current_month = current_date.month
            current_year = current_date.year
            filtered_sessions = [
                ss for ss in filtered_sessions 
                if ss.date and datetime.strptime(ss.date, "%Y-%m-%d").month == current_month 
                and datetime.strptime(ss.date, "%Y-%m-%d").year == current_year
            ]
        
        # apply tutor name filter
        if tutor_name and tutor_name != 'Tất cả':
            # get tutor info for each session to match by name
            filtered_with_tutor = []
            for ss in filtered_sessions:
                tutor_info = self.infoController.readUser().get(ss.tutor, {})
                if tutor_info.get('name', '') == tutor_name:
                    filtered_with_tutor.append(ss)
            filtered_sessions = filtered_with_tutor
        
        # apply search keyword
        if search_keyword:
            filtered_sessions = [
                ss for ss in filtered_sessions 
                if search_keyword.lower() in ss.name.lower()
            ]
        
        # apply sorting
        if sort_by == 'title':
            filtered_sessions.sort(key=lambda x: x.name)
        elif sort_by == 'duration':
            filtered_sessions.sort(key=lambda x: x.duration, reverse=True)
        else:  # default: date
            filtered_sessions.sort(key=lambda x: x.date, reverse=True)
        
        return filtered_sessions

    def register_student_to_session(self, student_id: str, session_id: str) -> tuple[bool, str]:
        """Sinh viên đăng ký tham gia buổi học"""
        ss = self.getSessionById(session_id)
        if ss is None:
            return False, "Session not found"
        if ss.students is None:
            ss.students = []
        if student_id in ss.students:
            return False, "Already registered"
        
        # Check for schedule conflict with student's other sessions
        new_start_str = ss.date + " " + ss.time
        new_startime = datetime.strptime(new_start_str, "%Y-%m-%d %H:%M")
        new_endtime = new_startime + timedelta(minutes=ss.duration)
        
        # Get all sessions already registered by this student
        registered_sessions = self.get_sessions_registered_by_student(student_id)
        
        for existing_ss in registered_sessions:
            # Skip if same session (shouldn't happen but be safe)
            if existing_ss.session_id == session_id:
                continue
            # Skip if different date
            if existing_ss.date != ss.date:
                continue
            
            # Check time overlap
            existing_start_str = existing_ss.date + " " + existing_ss.time
            existing_start = datetime.strptime(existing_start_str, "%Y-%m-%d %H:%M")
            existing_end = existing_start + timedelta(minutes=existing_ss.duration)
            
            # If there's overlap, reject registration
            if new_startime < existing_end and existing_start < new_endtime:
                return False, f"Trùng lịch với buổi học '{existing_ss.name}' ({existing_ss.time})"
        
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
        
        users = self.infoController.readUser()
        print(users)
        print(student_id, tutor_id)
        if student_id not in users or tutor_id not in users:
            return False, "User not found"

        student = users[student_id]
        tutor = users[tutor_id]
        if student.get("role") != "student" or tutor.get("role") != "tutor":
            return False, "Invalid roles: require student->tutor"

        student_tutors = student.get("tutor", [])
        if tutor_id in student_tutors:
            return False, "Already following"
        student_tutors.append(tutor_id)
        student["tutor"] = student_tutors

        if not self.infoController.writeUser(users):
            return False, "Write failed"
        return True, "Followed"

    def student_unfollow_tutor(self, student_id: str, tutor_id: str) -> tuple[bool, str]:
        """
        Student unfollows Tutor:
        - Remove tutor_id from student's `tutor` list
        - Remove student_id from tutor's `students` list (if present)
        Enforces roles: follower must be student, target must be tutor.
        """
        users = self.infoController.readUser()
        if student_id not in users or tutor_id not in users:
            return False, "User not found"
        student = users[student_id]
        tutor = users[tutor_id]
        if student.get("role") != "student" or tutor.get("role") != "tutor":
            return False, "Invalid roles: require student->tutor"

        student_tutors = student.get("tutor", [])
        if tutor_id not in student_tutors:
            return False, "Not following"
        student_tutors.remove(tutor_id)
        student["tutor"] = student_tutors

        if not self.infoController.writeUser(users):
            return False, "Write failed"
        return True, "Unfollowed"
    
    def get_sessions_not_registered_by_student(self, student_id: str) -> list[Session]:
        """Lấy tất cả các buổi học mà student chưa đăng ký theo student_id"""
        all_unregistered = [ss for ss in self.all_sessions if ss.students is None or student_id not in ss.students]

        followed_tutors = self.infoController.readUser().get(student_id, None).get("tutor")

        to_return = [ss for ss in all_unregistered if ss.tutor in followed_tutors]

        return to_return