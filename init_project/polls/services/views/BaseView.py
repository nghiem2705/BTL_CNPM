from django.http import HttpResponse
from abc import ABC, abstractmethod

class BaseView(ABC):
    """Lớp cơ sở cho tất cả các view trong hệ thống."""
    
    def __init__(self):
        pass

    @abstractmethod
    def get(self, request, context, *args, **kwargs) -> HttpResponse:
        pass

    @abstractmethod
    def post(self, request, context, *args, **kwargs) -> HttpResponse:
        pass

    @abstractmethod
    def render(self, request, context) -> HttpResponse:
        pass