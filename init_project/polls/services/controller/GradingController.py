import json
import os
from .BaseController import BaseController
from polls.entity.UserEntity import TutorEntity
from polls.entity.UserEntity import StudentEntity

class GradingController(BaseController):
    def __init__(self):
        super().__init__()
        self._data_path_components = ["init_project", "data", "grade.json"]

    def _read_file(self) -> dict:
        try:
            return super().readFile(self._data_path_components) or {}
        except Exception:
            return {}

    def _write_file(self, data: dict) -> bool:
        try:
            super().writeFile(self._data_path_components, data)
            return True
        except Exception:
            return False

    # Helper to make unique key for tutor-student pair
    def _make_key(self, tutorID, studentID) -> str:
        # Accept either entity objects or simple id strings
        return f"{tutorID}_{studentID}"

    # Đánh giá sinh viên
    def grade(self, tutorID: str, studentID: str, component: str, score: float) -> bool:
        data = self._read_file() or {}
        key = self._make_key(tutorID, studentID)
        record = data.get(key)
        if not record:
            return False
        components = record.get('component', [])
        for comp in components:
            if comp.get('name') == component:
                comp['score'] = score
                return self._write_file(data)
        # component not found
        return False

    # Thêm cột điểm
    def addComponent(self, tutorID: str, studentID: str, component: str, weight: float) -> bool:
        data = self._read_file() or {}
        key = self._make_key(tutorID, studentID)
        record = data.get(key)
        if not record:
            # create new record
            data[key] = {'component': []}
            record = data[key]
        components = record.get('component', [])
        # if component exists, update its weight
        for comp in components:
            if comp.get('name') == component:
                comp['weight'] = weight
                return self._write_file(data)
        # otherwise append new component with score default None
        components.append({'name': component, 'weight': weight, 'score': None})
        record['component'] = components
        return selfNoneite_file(data)
