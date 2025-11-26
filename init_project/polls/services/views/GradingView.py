import json
from rest_framework.response import Response
from rest_framework import status
from .BaseView import BaseView
from ..controller.GradingController import GradingController



class GradingView(BaseView):
    def __init__(self):
        super().__init__()

    # POST tutor/grading/grade/
    # POST tutor/grading/component/
    def post(self, request) -> Response:
        if 'grade' in request.path:
            return self.handle_grade(request)
        elif 'component' in request.path:
            return self.handle_add_component(request)

    def handle_grade(self, request) -> Response:
        data = getattr(request, 'data', None)
        if not data:
            return Response({"message": "Missing body"}, status=status.HTTP_400_BAD_REQUEST)

        tutor_id = data.get('tutor_id') 
        student_id = data.get('student_id')
        component = data.get('component')
        score = data.get('score')

        if not all([tutor_id, student_id, component]) or score is None:
            return Response({"message": "Missing parameters (tutor_id, student_id, component, score)"}, status=status.HTTP_400_BAD_REQUEST)

        controller = GradingController()
        success = controller.grade(tutor_id, student_id, component, score)
        if success:
            return Response({"message": "Score updated"})
        return Response({"message": "Record or component not found"}, status=status.HTTP_404_NOT_FOUND)

    def handle_add_component(self, request) -> Response:
        data = getattr(request, 'data', None)
        if not data:
            return Response({"message": "Missing body"}, status=status.HTTP_400_BAD_REQUEST)

        tutor_id = data.get('tutor_id') or data.get('tutor')
        student_id = data.get('student_id') or data.get('student')
        component = data.get('component')
        weight = data.get('weight')

        if not all([tutor_id, student_id, component]) or weight is None:
            return Response({"message": "Missing parameters (tutor_id, student_id, component, weight)"}, status=status.HTTP_400_BAD_REQUEST)

        controller = GradingController()
        success = controller.addComponent(tutor_id, student_id, component, weight)
        if success:
            return Response({"message": "Component added/updated"})
        return Response({"message": "Failed to add component"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)