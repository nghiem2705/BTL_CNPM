from .BaseController import BaseController
from polls.entity.SessionEntity import *
from datetime import datetime, timedelta
import os
from django.conf import settings

class SchedulerController(BaseController):

    # SESSION_PATH = ["data", "session.json"]
    # SESSION_PATH = os.path.join(settings.BASE_DIR, 'data', 'session.json')
    SESSION_PATH = [str(settings.BASE_DIR), "data", "session.json"]
    SESSION_PER_PAGE = 2

    def __init__(self):
        super().__init__()
        
        self.all_sessions = []
        self.update()

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

        # print([ss.to_dictionary() for ss in self.all_sessions])

        filtered_sessions = self.all_sessions.copy()
        if status != SessionStatus.NOT_SET:
            filtered_sessions = [ss for ss in filtered_sessions if ss.status == status]
        
        # print([ss.to_dictionary() for ss in filtered_sessions])
        
        if sort_filer == SessionFiler.DATE:
            filtered_sessions.sort(key=lambda x: x.date)
        elif sort_filer == SessionFiler.NAME:
            filtered_sessions.sort(key=lambda x: x.name)
        elif sort_filer == SessionFiler.DURATION:
            filtered_sessions.sort(key=lambda x: x.duration)

        # print([ss.to_dictionary() for ss in filtered_sessions])

        print(keyword)
        if keyword != "" and keyword is not None:
            filtered_sessions = [ss for ss in filtered_sessions if keyword.lower() in ss.name.lower()]
        
        # print([ss.to_dictionary() for ss in filtered_sessions])

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
        

