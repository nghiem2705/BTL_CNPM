from rest_framework.response import Response
from rest_framework import status
from .BaseView import BaseView
from ..controller.InformationController import InformationController

class InformationView(BaseView):
    def __init__(self):
        super().__init__()
        self.controller = InformationController()

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
        data = getattr(request, 'data', None)
        if not data:
            return Response({"message": "Missing body"}, status=status.HTTP_400_BAD_REQUEST)
        success = self.controller.updateProfile(uID, data)
        if success:
            return Response({"message": f"Updated {uID}"})
        if not success:
            return Response({"message": f"User {uID} not found or update failed"}, status=404)
        return Response({"message": f"Failed to update {uID}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    