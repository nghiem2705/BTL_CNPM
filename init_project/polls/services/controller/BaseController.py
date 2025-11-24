from abc import ABC, abstractmethod
import json
import os
# from django.conf import settings
class BaseController(ABC):
    """Lớp cơ sở cho tất cả các controller trong hệ thống."""
    
    def __init__(self):
        pass

    @abstractmethod
    def writeFile(self, path, data):
        pass

    @abstractmethod
    def readFile(self, file, path):
        pass

# file_path = os.path.join(settings.BASE_DIR, "data", "session.json")
file_path = os.path.join("init_project", "data", "session.json")
with open(file_path, "r", encoding="utf-8") as f:
    data = json.load(f)
print(data)