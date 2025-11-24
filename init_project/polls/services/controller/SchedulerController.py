import BaseController
from init_project.polls.entity.SessionEntity import *

class SchedulerController(BaseController):
    def __init__(self):
        super().__init__()

    def writeFile(self, path, data):
        pass

    def readFile(self, file, path):
        pass

    def getAllSessions(self):
        pass

    def getSessionById(self, session_id):
        pass

    def getSessions(self, page, keyword, sort_filer, status):
        pass

    def removeSession(self, session_id):
        pass

    def updateSession(self, session_id, new_session):
        pass

