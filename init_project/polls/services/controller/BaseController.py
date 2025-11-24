from abc import ABC, abstractmethod
import json

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
