from enum import Enum
import datetime

class SessionStatus(Enum):
    NOT_SET = 0
    PROCESSING = 1
    COMPLETED = 2
    COMING_SOON = 3

class SessionFiler(Enum):
    DATE = 0
    NAME = 1
    DURATION = 2

class Session:
    def __init__(self):
        self.session_id = ""
        self.tutor_name = ""
        self.students = []
        self.date = None
        self.status = SessionStatus.NOT_SET
        self.time = None
        self.duration = 0
        self.is_online = False
        self.address = ""
        self.description = ""
        self.note = ""
        self.document = ""

    def get_status(self):
        # compare time
        pass

    def __init__(self, session_id, tutor_name, students, date, time, duration, is_online, address, description, note, document):
        self.session_id = session_id
        self.tutor_name = tutor_name
        self.students = students
        self.date = date
        self.time = time
        self.duration = duration
        self.is_online = is_online
        self.address = address
        self.description = description
        self.note = note
        self.document = document
        self.status = self.get_status()

    def add_student(self, student):
        self.students.append(student)

    def to_dictionary(self):
        return {
            'session_id': self.session_id,
            'tutor_name': self.tutor_name,
            'students': self.students,
            'date': self.date.isoformat() if self.date else None,
            'status': self.status.name,
            'time': self.time.isoformat() if self.time else None,
            'duration': self.duration,
            'is_online': self.is_online,
            'address': self.address,
            'description': self.description,
            'note': self.note,
            'document': self.document
        }