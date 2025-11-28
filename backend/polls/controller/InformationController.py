from .BaseController import BaseController
from polls.entity.UserEntity import StudentEntity, TutorEntity, UserFilter
import os

class InformationController(BaseController):

    USER_PATH = ["data", "user.json"]
    SESSION_PATH = ["data", "session.json"]
    GRADE_PATH = ["data", "grade.json"]

    def __init__(self):
        super().__init__()
        # self.all_students = self.getStudents()
        # self.all_tutors = self.getTutors()

    # Helpers: read and write user data file
    def readUser(self):
        try:
            return super().readFile(self.USER_PATH) or {}
        except Exception:
            return {}

    def writeUser(self, data) -> bool:
        try:
            super().writeFile(self.USER_PATH, data)
            return True
        except Exception:
            return False

    def readSessions(self):
        try:
            return super().readFile(self.SESSION_PATH) or {}
        except Exception:
            return {}

    def readGrades(self):
        try:
            return super().readFile(self.GRADE_PATH) or {}
        except Exception:
            return {}
        
    # def getStudents(self) -> list["StudentEntity"]:
    #     data = self.readUser()
    #     to_return = []
    #     for key, value in data.items():
    #         if value.get("role") == "student":
    #             stu = StudentEntity(
    #                 uID=key,
    #                 fullname=value["name"],
    #                 email=value["email"],
    #                 password="",
    #                 phoneNumber=value["phone"],
    #                 major=value["major"],
    #                 demand=value["demand"],
    #                 tutors=value["tutor"],
    #                 grade=None,
    #                 unregisterTimes=0
    #             )
    #             to_return.append(stu)
    #     return to_return
    
    # def getTutors(self) -> list["TutorEntity"]:
    #     data = self.readUser()
    #     to_return = []
    #     for key, value in data.items():
    #         if value.get("role") == "tutor":
    #             stu = TutorEntity(
    #                 uID=key,
    #                 fullname=value["name"],
    #                 email=value["email"],
    #                 password="",
    #                 phoneNumber=value["phone"],
    #                 # 
    #                 students = [],
    #                 major=value["major"],
    #                 strengths=value["strength"],
    #                 cancelTimes=0,
    #                 rate = value["rate"]
    #             )
    #             to_return.append(stu)
    #     return to_return

    def getProfile(self, uID: str) -> dict:
        users = self.readUser() or {}
        return users.get(uID, {})

    def updateProfile(self, uID: str, new_data: dict) -> bool:
        try:
            users = self.readUser() or {}
            if uID not in users:
                print(f"User {uID} not found in users data")
                return False
            
            # Log để debug
            print(f"Before update: {users[uID]}")
            print(f"Update data: {new_data}")
            
            # Cập nhật từng field một cách an toàn
            for key, value in new_data.items():
                users[uID][key] = value
            
            print(f"After update: {users[uID]}")
            
            # Ghi lại file
            result = self.writeUser(users)
            if result:
                print(f"Successfully updated profile for {uID}")
            else:
                print(f"Failed to write user data to file")
            return result
        except Exception as e:
            print(f"Error in updateProfile: {str(e)}")
            import traceback
            traceback.print_exc()
            return False    

    # Get students following a tutor
    def getStudentsOfTutor(self, tutor_id: str) -> list[dict]:
        tutor = self.readUser().get(tutor_id, None)
        if not tutor:
            return []
        student_list = tutor.get("students", [])
        return student_list
    
    # students/tutor/<stu_id>/?page=...&filter=...&keyword=... [get]
    # get tutors list for student
    # 
    def getTutorListForStudent(self, student_id: str, page: int = 1, filter_by: int = UserFilter.NOT_SET, keyword: str = "") -> list[dict]:
        users = self.readUser() or {}
        
        student = users.get(student_id)
        if (student is None):
            return []
        
        tutors = []
        for key, value in users.items():
            if value.get("role") == "tutor":
                tutors.append({key: value})

        print(tutors)

        student_demand = student.get("demand")

        matched_tutors = []
        for tutor in tutors:
            for key, value in tutor.items():
                strengths = value.get("strength")
                if (set(strengths) & set(student_demand)):
                    matched_tutors.append({key: value})
                
                # list[dict]
                # dict
        return matched_tutors

    def getStatistics(self, uID: str) -> dict:
        """
        Lấy thống kê học tập của user
        """
        users = self.readUser() or {}
        sessions = self.readSessions()
        grades = self.readGrades()
        
        user = users.get(uID, {})
        if not user:
            return {}
        
        role = user.get("role", "")
        
        # Đếm sessions
        total_sessions = 0
        completed_sessions = 0
        upcoming_sessions = 0
        total_hours = 0
        subjects_set = set()
        
        from datetime import datetime
        now = datetime.now()
        
        for session_id, session_data in sessions.items():
            # Kiểm tra nếu user tham gia session
            is_participant = False
            if role == "tutor" and session_data.get("tutor") == uID:
                is_participant = True
            elif role == "student" and uID in session_data.get("students", []):
                is_participant = True
            
            if is_participant:
                total_sessions += 1
                session_date_str = session_data.get("date", "")
                session_time_str = session_data.get("time", "")
                
                if session_date_str and session_time_str:
                    try:
                        session_datetime = datetime.strptime(f"{session_date_str} {session_time_str}", "%Y-%m-%d %H:%M")
                        duration = session_data.get("duration", 0)
                        total_hours += duration / 60  # Convert minutes to hours
                        
                        if session_datetime < now:
                            completed_sessions += 1
                        else:
                            upcoming_sessions += 1
                    except:
                        pass
                
                # Lấy tên session làm subject
                session_name = session_data.get("name", "")
                if session_name:
                    subjects_set.add(session_name)
        
        # Đếm students (cho tutor)
        total_students = 0
        if role == "tutor":
            students_list = user.get("students", [])
            total_students = len(students_list) if isinstance(students_list, list) else 0
        
        # Tính average rating
        average_rating = user.get("rate", 0.0)
        if isinstance(average_rating, (int, float)):
            average_rating = float(average_rating)
        else:
            average_rating = 0.0
        
        return {
            "totalSessions": total_sessions,
            "completedSessions": completed_sessions,
            "upcomingSessions": upcoming_sessions,
            "totalStudents": total_students,
            "averageRating": average_rating,
            "totalHours": round(total_hours, 1),
            "subjects": list(subjects_set)[:5]  # Limit to 5 subjects
        }