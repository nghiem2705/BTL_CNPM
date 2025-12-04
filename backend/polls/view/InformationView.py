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
        
        uid, user, error_type = self.controller.authenticate(username, password, role)
        
        if user:
            return Response({
                "success": True,
                "message": "Đăng nhập thành công",
                "role": user.get('role'),
                "uID": uid, 
                "user": user           
            }, status=status.HTTP_200_OK)
        else:
            # Provide specific error messages
            error_messages = {
                "user_not_found": "Tên đăng nhập không tồn tại!",
                "wrong_password": "Mật khẩu không đúng!",

                "role_mismatch": "Tài khoản này không có quyền truy cập trang này!"

            }
            message = error_messages.get(error_type, "Sai tên đăng nhập hoặc mật khẩu!")
            
            return Response({
                "success": False,
                "message": message
            }, status=status.HTTP_401_UNAUTHORIZED)



    # Xem thông tin cá nhân GET: /tutor/information?uID=<tutor_id>
    # Lấy danh sách sinh viên theo tutor GET: /tutor/<tutor_id>/students
    # Lấy danh sách tutor hệ thống đề xuất cho sinh viên GET: /student/<student_id>/tutors
    def get(self, request, user_id=None, tutor_id=None, student_id=None) -> Response:
        path = request.path
        
        # GET profile: /tutor/<id>/information/ OR /student/<id>/information/
        if path.endswith('/information/'):
            target_id = tutor_id if tutor_id else student_id
            if target_id:
                profile = self.controller.readUser().get(target_id)
                if profile and student_id:
                    return Response({"success": True, "profile": profile, "statistics": self.controller.getStatistics(student_id)})
                if profile and tutor_id:
                    return Response({"success": True, "profile": profile, "statistics": self.controller.getStatistics(tutor_id)})
                return Response({"success": False, "message": "User not found"}, status=404)
            return Response({"success": False, "message": "Missing user id parameter"}, status=400)
        
        if user_id:
            if path.endswith('/tutors/'): #
                # Lấy filter param từ query string
                filter_status = request.GET.get('filter_status', 'all')  # all, registered, unregistered
                keyword = request.GET.get('keyword', '')  # search keyword
                
                tutors = self.controller.getTutorListForStudent(user_id, filter_status, keyword)
                return Response({"tutors": tutors, "message": f"Returned {len(tutors)} tutors for {user_id}"})

            if path.endswith('/students/'):
                students = self.controller.getStudentsOfTutor(user_id)
                return Response({"students": students, "message": f"Returned {len(students)} students following {user_id}"})

        return Response({"message": "Missing parameters"}, status=400)


    # Chỉnh sửa thông tin cá nhân
    # PUT: update existing profile
    # endpoint: /tutor/information/<uID>/
    def put(self, request, uID=None, tutor_id=None, student_id=None) -> Response:
        data = request.data
        if not data:
            return Response({"message": "Missing body"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Determine target_id
        target_id = tutor_id if tutor_id else (student_id if student_id else uID)

        success = self.controller.updateProfile(target_id, data)
        
        if success:
            # Return updated profile data
            updated_profile = self.controller.readUser().get(target_id)
            if updated_profile:
                return Response({"success": True, "message": f"Updated {target_id}", "profile": updated_profile})
            return Response({"success": True, "message": f"Updated {target_id}"})
        
        return Response({"success": False, "message": f"User {target_id} not found or update failed"}, status=404)