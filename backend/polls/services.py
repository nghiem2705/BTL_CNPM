"""
Nơi để định nghĩa các logic nghiệp vụ (business logic) và các lớp trừu tượng.
Theo yêu cầu: GradingService, BookManager
"""
from abc import ABC, abstractmethod

# --- Quản lý Sách (Book Manager) ---

class Book:
    """Một lớp dữ liệu đơn giản để đại diện cho một cuốn sách."""
    def __init__(self, id, title, author):
        self.id = id
        self.title = title
        self.author = author

class IBookManager(ABC):
    """Giao diện (Interface) trừu tượng cho Quản lý Sách."""
    
    @abstractmethod
    def get_book_by_id(self, book_id: str) -> Book:
        pass

    @abstractmethod
    def search_books(self, query: str) -> list[Book]:
        pass

class BookManager(IBookManager):
    """Triển khai cụ thể của IBookManager."""
    
    def get_book_by_id(self, book_id: str) -> Book:
        print(f"Đang tìm sách với ID: {book_id}")
        return Book(id=book_id, title="Sách Lập Trình Python", author="Tác giả A")

    def search_books(self, query: str) -> list[Book]:
        print(f"Đang tìm kiếm với từ khóa: {query}")
        return [
            Book(id="001", title="Python Cơ Bản", author="Tác giả A"),
            Book(id="002", title="Django Nâng Cao", author="Tác giả B")
        ]

# --- Dịch vụ Chấm điểm (Grading Service) ---

class IGradingService(ABC):
    """Giao diện trừu tượng cho Dịch vụ Chấm điểm."""
    
    @abstractmethod
    def calculate_student_score(self, student_id: str, tutor_id: str) -> float:
        pass
    
    @abstractmethod
    def save_score_to_system(self, student_id: str, score: float):
        pass

class GradingService(IGradingService):
    """Triển khai cụ thể của Dịch vụ Chấm điểm."""
    
    def calculate_student_score(self, student_id: str, tutor_id: str) -> float:
        print(f"Đang tính điểm cho SV: {student_id} (Tutor: {tutor_id})")
        score = 9.5 # Điểm giả lập
        return score

    def save_score_to_system(self, student_id: str, score: float):
        print(f"Đã lưu điểm {score} cho SV: {student_id} vào hệ thống.")
        pass