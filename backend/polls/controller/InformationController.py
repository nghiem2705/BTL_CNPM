import json
import os
from .BaseController import BaseController
from polls.entity.UserEntity import StudentEntity

class InformationController(BaseController):

    USER_PATH = ["data", "user.json"]
    SSO_PATH = ["data", "sso", "user.json"]

    def __init__(self):
        super().__init__()

    # Helpers: read and write user data file
    def readUser(self):
        try:
            return super().readFile(self.USER_PATH) or {}
        except Exception:
            return {}
        
    def readSSO_User(self):
        try:
            return super().readFile(self.SSO_PATH) or {}
        except Exception:
            return {}

    def writeUser(self, data) -> bool:
        try:
            super().writeFile(self.USER_PATH, data)
            return True
        except Exception:
            return False

    def getProfile(self, uID: str) -> dict:
        users = self.readFile(self.USER_PATH) or {}
        return users.get(uID, {})

    def updateProfile(self, uID: str, new_data: dict) -> bool:
        users = self.readFile(self.USER_PATH) or {}
        if uID not in users:
            return False
        users[uID].update(new_data)
        return self.writeFile(self.USER_PATH, users)    

    # Get students following a tutor
    def getStudentsOfTutor(self, tutor_id: str) -> list[dict]:
        tutor = self.readFile(self.USER_PATH).get(tutor_id, None)
        if not tutor:
            return []
        student_list = tutor.get("students", [])
        return student_list
    
    def authenticate(self, username: str, password: str , role: str) -> bool:
        sso_users = self.readSSO_User() or {}
        users = self.readUser() or {}

        d_role = ""
        uid_str = ""
        for uid, user_info in sso_users.items():
            # print(user_info)
            
            if user_info.get('username') == username and user_info.get('password') == password:
                uid_str = str(uid)
                d_role = ""

                if uid_str.startswith("t_"):
                    d_role = "tutor"
                elif uid_str.startswith("1") or uid_str.startswith("2"):
                    d_role = "student"

                break
        if not uid_str:
            return None
        if role is True and role != d_role:
            return None
        
        user = users.get(uid_str, {})
        return user