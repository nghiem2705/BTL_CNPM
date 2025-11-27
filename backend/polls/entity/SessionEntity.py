from enum import IntEnum
from datetime import datetime, timedelta

class SessionStatus(IntEnum):
    NOT_SET = 0
    PROCESSING = 1
    COMPLETED = 2
    COMING_SOON = 3

class SessionFiler(IntEnum):
    DATE = 0
    NAME = 1
    DURATION = 2

class Session:
    def __init__(self):
        self.name = ""
        self.session_id = ""
        self.tutor = ""
        self.students = []
        self.date = None
        self.status = SessionStatus.NOT_SET
        self.time = None
        self.duration = 0
        self.online = False
        self.address = ""
        self.link = ""
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

    def __init__(self, session_id, name, tutor, students, date, time, duration, online, address, link, description, note, document):
        self.session_id = session_id
        self.name = name
        self.tutor = tutor
        self.students = students
        self.date = date
        self.time = time
        self.duration = duration
        self.online = online
        self.address = address
        self.link = link
        self.description = description
        self.note = note
        self.document = document

        self.status = self.getStatus()

    def add_student(self, student):
        self.students.append(student)

    # Thêm tham số mặc định has_status=False
    def to_dictionary(self, has_status=False):
        result = {
            "session_id": self.session_id,
            "name": self.name,
            "tutor": self.tutor,
            "students": self.students,
            "date": self.date,
            "time": self.time,
            "duration": self.duration,
            "online": self.online,
            "address": self.address,
            "link": self.link,
            "description": self.description,
            "note": self.note,
            "document": self.document
        }

        # Nếu code bên ngoài yêu cầu lấy Status (has_status=True)
        if has_status:
            # Gọi hàm getStatus mà bạn đã viết trước đó
            result["status"] = self.getStatus()

        return result