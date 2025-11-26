from enum import Enum
from datetime import datetime, timedelta

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
        self.title = ""
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

    def getStatus(self):
        # compare time
        start_str = self.date + " " + self.time
        start_dt = datetime.strptime(start_str, "%Y-%m-%d %H:%M")
        end_dt = start_dt + timedelta(minutes=self.duration)
        now = datetime.now()

        if now < start_dt:
            return SessionStatus.COMING_SOON
        elif start_dt <= now < end_dt:
            return SessionStatus.PROCESSING
        else:
            return SessionStatus.COMPLETED

    def __init__(self, session_id, title, tutor_name, students, date, time, duration, is_online, address, description, note, document):
        self.session_id = session_id
        self.title = title
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
            'title': self.title,
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