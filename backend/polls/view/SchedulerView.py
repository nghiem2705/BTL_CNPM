from rest_framework.response import Response 
from rest_framework import status
from .BaseView import BaseView
from polls.controller.SchedulerController import *


class SchedulerView(BaseView):
    def __init__(self):
        super().__init__()
        self.controller = SchedulerController()

    """Test rồi"""
    # GET sessions/...
    # get sessions list
    # require query parameters ?filter=...,keywork=...,status=...,page=...
    #return .sessions, .message
    # def get(self, request, session_id = None) -> Response:
    #     if session_id is not None:
    #         session = self.controller.getSessionById(session_id)
    #         if session is not None:
    #             return Response({"session": session.to_dictionary(has_status=True), "message": f"Get Detail {session_id}"})
    #         else:
    #             return Response({"message": f"Session {session_id} not found"}, status=status.HTTP_404_NOT_FOUND)

    #     page = int(request.query_params['page'])
    #     keyword = request.query_params['keyword']
    #     filter = int(request.query_params['filter'])
    #     status = int(request.query_params['status'])
    #     sessions_list = self.controller.getSessions(
    #         page, keyword, filter, status)
        
    #     # print([{ss.session_id: ss.to_dictionary()} for ss in sessions_list])

    #     into_dict = {ss.session_id: ss.to_dictionary(has_status=True) for ss in sessions_list}
    #     return Response({"sessions": into_dict, "message": f"Search for {keyword} having {status} status in page {page}. Sorted by {filter}"})

    def get(self, request, session_id=None) -> Response:
        # 1. Xử lý lấy chi tiết (Giữ nguyên)
        if session_id is not None:
            session = self.controller.getSessionById(session_id)
            if session is not None:
                return Response({"session": session.to_dictionary(has_status=True), "message": f"Get Detail {session_id}"})
            else:
                return Response({"message": f"Session {session_id} not found"}, status=status.HTTP_404_NOT_FOUND)

        # 2. Xử lý lấy danh sách (SỬA Ở ĐÂY)
        try:
            # Dùng .get('key', default_value) để tạo giá trị mặc định nếu Frontend không gửi lên
            page = int(request.query_params.get('page', 1))         # Mặc định trang 1
            keyword = request.query_params.get('keyword', '')       # Mặc định tìm rỗng
            
            # Đổi tên biến filter -> sort_option (tránh trùng tên hàm filter của python)
            sort_option = int(request.query_params.get('filter', 0)) # Mặc định sắp xếp kiểu 0
            
            # Đổi tên biến status -> search_status (tránh trùng library status)
            search_status = int(request.query_params.get('status', 0)) # Mặc định status 0
            
            # Gọi Controller
            sessions_list = self.controller.getSessions(
                page, keyword, sort_option, search_status
            )

            # 3. Chuyển đổi dữ liệu trả về
            # LƯU Ý: Frontend React thường thích nhận về LIST ([]), 
            # nhưng code cũ của bạn đang trả về DICT ({ "ss1": {...} }).
            # Nếu Frontend bạn đã dùng Object.entries() như mình chỉ thì giữ nguyên dòng dưới.
            into_dict = {ss.session_id: ss.to_dictionary(has_status=True) for ss in sessions_list}
            
            return Response({
                "sessions": into_dict, 
                "message": f"Search for '{keyword}' status {search_status} page {page}"
            })

        except Exception as e:
            # Bắt lỗi nếu controller có vấn đề để server không bị sập (Error 500)
            print("Lỗi server:", str(e))
            return Response({"message": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    """Test rồi"""
    # POST sessions
    # create new sessions
    # require body and header json
    # return .message
    def post(self, request) -> Response:
        # generate id
        id = 0
        auto_gen_id = f"ss{id}"
        while self.controller.getSessionById(auto_gen_id) is not None:
            id+=1
            auto_gen_id = f"ss{id}"
        
        session_id = auto_gen_id
        
        data = request.data
        new_session = Session(session_id, 
                        data['name'],
                        data['tutor'],
                        data['students'],
                        data['date'],
                        data['time'],
                        data['duration'],
                        data['online'],
                        data['address'],
                        data['link'],
                        data['description'],
                        data['note'],
                        data['document'])
        valid = self.controller.addSession(new_session)
        if valid: 
            return Response({"message": f"Created {session_id}", "id": session_id}, status=status.HTTP_200_OK)
        
        return Response(
            {"error": "Lịch dạy bị trùng!"}, 
            status=status.HTTP_400_BAD_REQUEST
        )

    """Test rồi"""
    # PUT sessions/<pk>
    # need body and header json
    # return .message
    def put(self, request, session_id) -> Response:
        data = request.data
        session = self.controller.getSessionById(session_id)
        tutor = session.tutor
        students = session.students
        new_session = Session(session_id, 
                        data['name'],
                        tutor,
                        students,
                        data['date'],
                        data['time'],
                        data['duration'],
                        data['online'],
                        data['address'],
                        data['link'],
                        data['description'],
                        data['note'],
                        data['document'])
        self.controller.updateSession(session_id, new_session)
        return Response({"message": f"Updated {session_id}"})

    """Test rồi"""
    # DELETE sessions/<pk>
    # return .message
    def delete(self, request, session_id) -> Response:
        self.controller.removeSession(session_id)
        return Response({"message": f"Removed {session_id}"})