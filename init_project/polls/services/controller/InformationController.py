import json
import os
from .BaseController import BaseController
from polls.entity.UserEntity import StudentEntity


class InformationController(BaseController):
    def __init__(self):
        super().__init__()
        # Khai báo đường dẫn tới data
        self._data_path_components = ["init_project", "data", "user.json"]

    # Helpers: read and write user data file
    def readFile(self, path: str):
        try:
            return super().readFile(self._data_path_components) or {}
        except Exception:
            return {}

    def writeFile(self, path: str, data) -> bool:
        try:
            super().writeFile(self._data_path_components, data)
            return True
        except Exception:
            return False

    def getProfile(self, uID: str) -> dict:
        users = self.readFile(self._data_path_components) or {}
        return users.get(uID, {})

    def updateProfile(self, uID: str, new_data: dict) -> bool:
        users = self.readFile(self._data_path) or {}
        if uID not in users:
            return False
        users[uID].update(new_data)
        return self.writeFile(self._data_path, users)    

    # Get students following a tutor
    def getStudentsOfTutor(self, tutor_id: str) -> list[dict]:
        tutor = self.readFile(self._data_path).get(tutor_id, None)
        if not tutor:
            return []
        student_list = tutor.get("students", [])
        return student_list
