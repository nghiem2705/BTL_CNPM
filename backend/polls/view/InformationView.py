from rest_framework.response import Response
from rest_framework import status
from .BaseView import BaseView
from ..controller.InformationController import InformationController

class InformationView(BaseView):
    def __init__(self):
        super().__init__()
        self.controller = InformationController()

    def post(self, request) -> Response:
        return Response({"message": "POST method not implemented"}, status=status.HTTP_501_NOT_IMPLEMENTED)

    # Xem thông tin cá nhân GET: /tutor/information?uID=<tutor_id>
    # Lấy danh sách sinh viên theo tutor GET: /tutor/<tutor_id>/students
    def get(self, request, tutor_id=None) -> Response:
        # if uID requested -> return profile
        uID = request.query_params.get('uID')
        if uID:
            profile = self.controller.getProfile(uID)
            if profile:
                return Response({"profile": profile, "message": f"Found profile {uID}"})
            return Response({"profile": {}, "message": f"Profile {uID} not found"}, status=status.HTTP_404_NOT_FOUND)

        # if tutor param provided -> return students following that tutor
        if tutor_id:
            students = self.controller.getStudentsOfTutor(tutor_id)
            return Response({"students": students, "message": f"Returned {len(students)} students following {tutor_id}"})

        return Response({"message": "Missing parameters"}, status=400)

    # Chỉnh sửa thông tin cá nhân
    # PUT: update existing profile
    # endpoint: /tutor/information/<uID>
    def put(self, request, uID) -> Response:
        try:
            print(f"[PUT] Received request to update profile for {uID}")
            print(f"[PUT] Request method: {request.method}")
            print(f"[PUT] Request headers: {dict(request.headers)}")
            
            # Lấy data từ request (DRF tự động parse JSON)
            data = request.data if hasattr(request, 'data') else None
            
            # Nếu không có data, thử lấy từ body
            if not data:
                import json
                try:
                    body = request.body.decode('utf-8')
                    print(f"[PUT] Raw body: {body}")
                    data = json.loads(body) if body else None
                except Exception as e:
                    print(f"[PUT] Error parsing body: {str(e)}")
                    pass
            
            print(f"[PUT] Parsed data: {data}")
            
            if not data:
                print(f"[PUT] ERROR: No data provided")
                return Response({
                    "message": "Missing body", 
                    "error": "No data provided"
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Log để debug
            print(f"[PUT] Updating profile for {uID} with data: {data}")
            
            success = self.controller.updateProfile(uID, data)
            print(f"[PUT] Update result: {success}")
            
            if success:
                # Lấy profile đã cập nhật để trả về
                updated_profile = self.controller.getProfile(uID)
                print(f"[PUT] Successfully updated profile for {uID}")
                return Response({
                    "message": f"Updated {uID}",
                    "profile": updated_profile
                }, status=status.HTTP_200_OK)
            else:
                print(f"[PUT] ERROR: User {uID} not found or update failed")
                return Response({
                    "message": f"User {uID} not found or update failed"
                }, status=status.HTTP_404_NOT_FOUND)
        except Exception as e:
            print(f"[PUT] EXCEPTION: Error updating profile: {str(e)}")
            import traceback
            traceback.print_exc()
            return Response({
                "message": f"Failed to update {uID}",
                "error": str(e)
            }, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
