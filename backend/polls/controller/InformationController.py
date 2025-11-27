from .BaseController import BaseController
from polls.entity.UserEntity import StudentEntity, TutorEntity, UserFilter

class InformationController(BaseController):

    USER_PATH = ["data", "user.json"]

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
        users = self.readUser() or {}
        if uID not in users:
            return False
        users[uID].update(new_data)
        return self.writeUser(users)    

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