import BaseController
from init_project.polls.entity.SessionEntity import *

class SchedulerController(BaseController):

    SESSION_PATH = ["init_project", "data", "session.json"]
    SESSION_PER_PAGE = 3

    def __init__(self):
        super().__init__()
        
        self.all_sessions = []
        self.update()

    def update(self):
        self.all_sessions = self.getAllSessions()

    def writeFile(self):
        # tiền xử lý dữ liệu đưa về dạng dictionary
        data = {ss.session_id: ss.to_dict() for ss in self.all_sessions}
        # ghi vào file
        to_return = super.writeFile(self.SESSION_PATH, data)
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
                        value['title'],
                        value['tutor_name'],
                        value['students'],
                        value['date'],
                        value['status'],
                        value['time'],
                        value['duration'],
                        value['is_online'],
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

        filtered_sessions = self.all_sessions.copy()
        if status != SessionStatus.NOT_SET:
            filtered_sessions = [ss for ss in filtered_sessions if ss.status == status]
        
        if sort_filer == SessionFiler.DATE:
            filtered_sessions.sort(key=lambda x: x.date)
        elif sort_filer == SessionFiler.NAME:
            filtered_sessions.sort(key=lambda x: x.title)
        elif sort_filer == SessionFiler.DURATION:
            filtered_sessions.sort(key=lambda x: x.duration)

        if keyword != "" and keyword is not None:
            filtered_sessions = [ss for ss in filtered_sessions if keyword.lower() in ss.title.lower()]
        
        result = []
        for i in range((page - 1) * self.SESSION_PER_PAGE, min(page * self.SESSION_PER_PAGE, len(filtered_sessions))):
            result.append(filtered_sessions[i])
            
        return result

    def removeSession(self, session_id):
        """
        session_id: str -> id của buổi học cần xóa
        """
        self.all_sessions.remove(self.getSessionById(session_id))
        self.writeFile()

    def updateSession(self, session_id, new_session):
        """
        session_id: str -> id của buổi học cần cập nhật
        """
        current = self.getSessionById(session_id)
        if current is not None:
            self.all_sessions.remove(current)
        self.all_sessions.append(new_session)
        self.writeFile()

