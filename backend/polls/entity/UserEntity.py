from .GradingEntity import Grade_Record

class UserEntity:
    def __init__(self, uID: int, fullname: str, email: str, password: str, phoneNumber: str):
        self.uID = uID
        self.fullname = fullname
        self.email = email
        self.password = password
        self.phoneNumber = phoneNumber

class StudentEntity(UserEntity):    
    def __init__(self, major: str, demand: str, tutors: list["TutorEntity"], grade: list["Grade_Record"], unregisterTimes: int, **kwargs):
        super().__init__(**kwargs)
        self.major = major
        self.demand = demand
        self.tutors = tutors
        self.grade = grade
        self.unregisterTimes = unregisterTimes

class TutorEntity(UserEntity):
    def __init__(self, major: str, students: list["StudentEntity"], rate: float , cancelTimes: int, **kwargs):
        super().__init__(**kwargs)
        self.major = major
        self.students = students
        self.rate = rate
        self.cancelTimes = cancelTimes

class CoordinatorEntity(UserEntity):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)