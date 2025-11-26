from rest_framework.views import APIView 
from rest_framework.response import Response 
from rest_framework import status
from abc import ABC, abstractmethod

class BaseView(ABC, APIView):
    """Lớp cơ sở cho tất cả các view trong hệ thống."""
    
    def __init__(self):
        pass

    @abstractmethod
    def get(self, request) -> Response:
        pass

    @abstractmethod
    def post(self, request) -> Response:
        pass