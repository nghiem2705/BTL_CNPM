from rest_framework.response import Response
from rest_framework import status
from .BaseView import BaseView
from ..controller.InformationController import InformationController

class StatisticsView(BaseView):
    def __init__(self):
        super().__init__()
        self.controller = InformationController()

    def post(self, request) -> Response:
        return Response({"message": "POST method not implemented"}, status=status.HTTP_501_NOT_IMPLEMENTED)

    # Lấy thống kê học tập
    # GET: /user/statistics?uID=<user_id>
    def get(self, request) -> Response:
        uID = request.query_params.get('uID')
        if not uID:
            return Response({"message": "Missing uID parameter"}, status=status.HTTP_400_BAD_REQUEST)
        
        statistics = self.controller.getStatistics(uID)
        if statistics:
            return Response({"statistics": statistics, "message": f"Statistics for {uID}"})
        return Response({"statistics": {}, "message": f"User {uID} not found"}, status=status.HTTP_404_NOT_FOUND)

