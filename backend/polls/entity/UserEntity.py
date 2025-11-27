from .GradingEntity import Grade_Record
from enum import IntEnum

class UserFilter(IntEnum):
    NOT_SET = 0
    FOLLOWED = 1

class UserEntity:
    def __init__(self, uID: int, fullname: str, email: str, password: str, phoneNumber: str):
        self.uID = uID
        self.fullname = fullname
        self.email = email
        self.password = password
        self.phoneNumber = phoneNumber

class StudentEntity(UserEntity):    
    def __init__(self, major: str, demand: list[str], tutors: list["TutorEntity"], grade: list["Grade_Record"], unregisterTimes: int, **kwargs):
        super().__init__(**kwargs)
        self.major = major
        self.demand = demand
        self.tutors = tutors
        self.grade = grade
        self.unregisterTimes = unregisterTimes

class TutorEntity(UserEntity):
    def __init__(self, major: str, students: list["StudentEntity"], rate: float , cancelTimes: int, strengths: list[str], **kwargs):
        super().__init__(**kwargs)
        self.major = major
        self.students = students
        self.rate = rate
        self.cancelTimes = cancelTimes
        self.strengths = strengths

class CoordinatorEntity(UserEntity):
    def __init__(self, **kwargs):
        super().__init__(**kwargs)