import json
import os
from datetime import datetime
from .BaseController import BaseController
from polls.entity.UserEntity import *

class InformationController(BaseController):

    USER_PATH = ["data", "user.json"]
    SSO_PATH = ["data", "sso", "user.json"]
    SESSION_PATH = ["data", "session.json"]
    def __init__(self):
        super().__init__()

    # Helpers: read and write user data file
    def readUser(self):
        try:
            return super().readFile(self.USER_PATH) or {}
        except Exception:
            return {}
        
    def readSSO_User(self):
        try:
            return super().readFile(self.SSO_PATH) or {}
        except Exception:
            return {}

    def readSession(self):
        try:
            return super().readFile(self.SESSION_PATH) or {}
        except Exception:
            return {}

    def writeUser(self, data) -> bool:
        try:
            super().writeFile(self.USER_PATH, data)
            return True
        except Exception:
            return False

    def getProfile(self, uID: str) -> dict:
        users = self.readFile(self.USER_PATH) or {}
        return users.get(uID, {})

    def updateProfile(self, uID: str, new_data: dict) -> bool:
        users = self.readFile(self.USER_PATH) or {}
        if uID not in users:
            return False
        users[uID].update(new_data)
        return self.writeFile(self.USER_PATH, users)    

    # Get students following a tutor
    def getStudentsOfTutor(self, tutor_id: str) -> list[dict]:
        tutor = self.readFile(self.USER_PATH).get(tutor_id, None)
        if not tutor:
            return []
        student_list = tutor.get("students", [])
        return student_list
    
    def authenticate(self, username: str, password: str , role: str) -> tuple:
        """
        Returns: (uid, user, error_type)
        - error_type: None (success), "user_not_found", "wrong_password"
        """
        sso_users = self.readSSO_User() or {}
        users = self.readUser() or {}

        d_role = ""
        uid_str = ""
        username_found = False
        
        for uid, user_info in sso_users.items():
            # Check if username exists
            if user_info.get('username') == username:
                username_found = True
                uid_str = str(uid)
                
                # Check password
                if user_info.get('password') != password:
                    return None, None, "wrong_password"
                
                # Determine role
                if uid_str.startswith("t_"):
                    d_role = "tutor"
                elif uid_str.startswith("1") or uid_str.startswith("2"):
                    d_role = "student"

                break
        
        # Username not found
        if not username_found:
            return None, None, "user_not_found"
        
        user = users.get(uid_str, {})
        return uid_str, user, None
    
    # student/<stu_id>/tutors/
    # get tutors list for student (return all tutors with filter)
    # filter_status: "all", "registered", "unregistered"
    # keyword: search by name or major
    def getTutorListForStudent(self, student_id: str, filter_status: str = "all", keyword: str = "") -> list[dict]:
        knn_threshold = 5
        
        users = self.readUser() or {}
        
        student = users.get(student_id)
        if (student is None):
            return []
        
        student_demand = student.get("demand")

        # lấy tất cả tutors
        all_tutors = []
        for key, value in users.items():
            if value.get("role") == "tutor":
                # kiểm tra xem tutor đã được đăng ký chưa
                registered = False
                if key in student.get("tutor", []):
                    registered = True
                to_return_value = value.copy()
                to_return_value["registered"] = registered

                # khởi tạo matched point
                strengths = value.get("strength")
                insertion_ = set(strengths) & set(student_demand)
                if (insertion_):
                    matched_demands = len(insertion_)
                    tutor_rating = value.get("rate", 0)
                    tutor_match_point = matched_demands *2 + tutor_rating # Hàm lượng giá
                    to_return_value["matched"] = tutor_match_point
                else:
                    to_return_value["matched"] = -1

                to_return_value["id"] = key
                all_tutors.append(to_return_value)

        
        # filter theo registered status
        filtered_tutors = []
        for tutor in all_tutors:
            # filter theo status
            if filter_status == "registered" and not tutor.get("registered"):
                continue
            if filter_status == "unregistered" and tutor.get("registered"):
                continue
            if filter_status == "matched" and tutor.get("matched", -1) == -1:
                continue
            
            # filter theo keyword (tìm trong name và major)
            if keyword:
                keyword_lower = keyword.lower()
                name_match = keyword_lower in tutor.get("name", "").lower()
                major_match = keyword_lower in tutor.get("major", "").lower()
                if not (name_match or major_match):
                    continue
            
            filtered_tutors.append(tutor)
                
        # sort theo matched point giảm dần
        if filter_status == "matched":
            filtered_tutors.sort(key=lambda x: x.get("matched", -1),  reverse=True)
            return filtered_tutors[:knn_threshold]

        return filtered_tutors

    def getStatistics(self, user_id: str) -> dict:
        user = self.readUser().get(user_id)
        if not user:
            return {}
        
        statistics = {
            "totalSessions": self.getTotalSessions(user_id),
            "completedSessions": self.getCompletedSessions(user_id),
            "upcomingSessions": self.getTotalSessions(user_id) - self.getCompletedSessions(user_id),
            "totalHours": self.getTotalHours(user_id),
        }

        if user_id.startswith("t_"):
            statistics["totalStudents"] = self.getTotalStudents(user_id)
            statistics["averageRating"] = user.get("rate", 0)
        return statistics

    def getTotalSessions(self, user_id: str) -> int:
        sessions = self.readSession()
        count = 0
        if user_id.startswith("t_"):
            # tutor
            for session_id, session in sessions.items():
                if user_id == session.get("tutor", ""):
                    count += 1
        elif user_id.startswith("2") or user_id.startswith("1"):
            # student
            for session_id, session in sessions.items():
                if user_id in session.get("students", []):
                    count += 1
        return count

    def getCompletedSessions(self, user_id: str) -> int:
        sessions = self.readSession()
        count = 0
        today = datetime.now().date()
        
        if user_id.startswith("t_"):
            # tutor
            for session_id, session in sessions.items():
                if user_id == session.get("tutor", ""):
                    # Check if session date is in the past
                    try:
                        session_date = datetime.strptime(session.get("date", ""), "%Y-%m-%d").date()
                        if session_date < today:
                            count += 1
                    except:
                        pass
        elif user_id.startswith("2") or user_id.startswith("1"):
            # student
            for session_id, session in sessions.items():
                if user_id in session.get("students", []):
                    # Check if session date is in the past
                    try:
                        session_date = datetime.strptime(session.get("date", ""), "%Y-%m-%d").date()
                        if session_date < today:
                            count += 1
                    except:
                        pass
        return count

    def getTotalHours(self, user_id: str) -> int:
        sessions = self.readSession()
        total_minutes = 0
        today = datetime.now().date()
        
        if user_id.startswith("t_"):
            # tutor
            for session_id, session in sessions.items():
                if user_id == session.get("tutor", ""):
                    # Only count hours from completed sessions (past dates)
                    try:
                        session_date = datetime.strptime(session.get("date", ""), "%Y-%m-%d").date()
                        if session_date < today:
                            duration = session.get("duration", 0)
                            # Handle both int and string duration
                            try:
                                total_minutes += int(duration)
                            except:
                                pass
                    except:
                        pass
        elif user_id.startswith("2") or user_id.startswith("1"):
            # student
            for session_id, session in sessions.items():
                if user_id in session.get("students", []):
                    # Only count hours from completed sessions (past dates)
                    try:
                        session_date = datetime.strptime(session.get("date", ""), "%Y-%m-%d").date()
                        if session_date < today:
                            duration = session.get("duration", 0)
                            # Handle both int and string duration
                            try:
                                total_minutes += int(duration)
                            except:
                                pass
                    except:
                        pass
        
        # Convert minutes to hours (rounded)
        return round(total_minutes / 60)

    def getTotalStudents(self, user_id: str) -> int:
        user = self.readUser().get(user_id)
        if not user:
            return 0
        return len(user.get("students", []))