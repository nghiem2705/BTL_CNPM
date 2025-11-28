from abc import ABC, abstractmethod
import json
import os
# from django.conf import settings
class BaseController(ABC):
    """Lớp cơ sở cho tất cả các controller trong hệ thống."""
    
    def __init__(self):
        pass

    def writeFile(self, paths, data):
        """
        paths: list -> ["data", "session.json"]
        data: dữ liệu cần ghi
        """

        # ghép đường dẫn
        file_path = os.path.join(*paths)

        # tự tạo nếu file chưa tồn tại
        folder = os.path.dirname(file_path)
        os.makedirs(folder, exist_ok=True)

        # Ghi file
        with open(file_path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=4, ensure_ascii=False)

        return file_path

    def readFile(self, paths):
        """
        paths: list -> ["data", "session.json"]
        """

        # ghép đường dẫn
        file_path = os.path.join(*paths)

        # Đọc file
        with open(file_path, "r", encoding="utf-8") as f:
            return json.load(f)