from rest_framework.response import Response
from rest_framework import status
from .BaseView import BaseView
from ..controller.InformationController import InformationController

class InformationView(BaseView):
    def __init__(self):
        super().__init__()
        self.controller = InformationController()

    # post nay la SSO nhe ae
    def post(self, request) -> Response:
        username = request.data.get('username')
        password = request.data.get('password')
        role = request.data.get('role')
        
        if not username or not password:
            return Response({"message": "Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu"}, 
                status=status.HTTP_400_BAD_REQUEST
            )
        # print(request.data)
        # print(username, password, role)
        uid, user = self.controller.authenticate(username, password, role)
        if user:
            return Response({
                "success": True,
                "message": "Đăng nhập thành công",
                "role": user.get('role'),
                "uID": uid, # Trả về ID để Frontend lưu lại dùng sau này
                "user": user            # Trả về toàn bộ info để hiển thị header
            }, status=status.HTTP_200_OK)
        else:
            return Response({
                "success": False,
                "message": "Sai tên đăng nhập, mật khẩu hoặc vai trò không đúng!"
            }, status=status.HTTP_401_UNAUTHORIZED)
        # return Response({"message": "POST method not implemented"}, status=status.HTTP_501_NOT_IMPLEMENTED)

    # Xem thông tin cá nhân GET: /tutor/information?uID=<tutor_id>
    # Lấy danh sách sinh viên theo tutor GET: /tutor/<tutor_id>/students
    # Lấy danh sách tutor hệ thống đề xuất cho sinh viên GET: /student/<student_id>/tutors
    def get(self, request, user_id=None) -> Response:
        path = request.path
        # if uID requested -> return profile
        uID = request.query_params.get('uID')
        if uID:
            profile = self.controller.getProfile(uID)
            if profile:
                return Response({"profile": profile, "message": f"Found profile {uID}"})
            return Response({"profile": {}, "message": f"Profile {uID} not found"}, status=status.HTTP_404_NOT_FOUND)

        # if tutor param provided -> return students following that tutor
        if user_id:
            if path.endswith('/tutors/'): #
                tutors = self.controller.getTutorListForStudent(user_id)
                return Response({"tutors": tutors, "message": f"Returned {len(tutors)} tutors recommended for {user_id}"})

            if path.endswith('/students/'):
                students = self.controller.getStudentsOfTutor(user_id)
                return Response({"students": students, "message": f"Returned {len(students)} students following {user_id}"})

        return Response({"message": "Missing parameters"}, status=400)

    # Chỉnh sửa thông tin cá nhân
    # PUT: update existing profile
    # endpoint: /tutor/information/<uID>
    def put(self, request, uID) -> Response:
        data = getattr(request, 'data', None)
        if not data:
            return Response({"message": "Missing body"}, status=status.HTTP_400_BAD_REQUEST)
        success = self.controller.updateProfile(uID, data)
        if success:
            return Response({"message": f"Updated {uID}"})
        if not success:
            return Response({"message": f"User {uID} not found or update failed"}, status=404)
        return Response({"message": f"Failed to update {uID}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
