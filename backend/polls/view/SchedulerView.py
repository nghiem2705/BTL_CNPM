from rest_framework.response import Response 
from rest_framework import status
from .BaseView import BaseView
from polls.controller.SchedulerController import *
from polls.controller.InformationController import *


class SchedulerView(BaseView):
    def __init__(self):
        super().__init__()
        self.controller = SchedulerController()
        self.infoController = InformationController()

    # GET
    # /tutor/sessions/ --> get all sessions by tutor_id (query param)
    # /student/sessions/registered/ --> get all sessions registered by student_id
    # /sessions/ --> get all sessions (with filters)
    # /sessions/<str:session_id>/ --> get session detail
    def get(self, request, session_id = None, tutor_id = None, student_id = None) -> Response:
        path = request.path
        # print("DEBUG KWARGS:", self.kwargs) 
        
        # # In thử tutor_id nhận được
        # print(f"DEBUG tutor_id param: {tutor_id}")
        if path.endswith('/sessions/') and tutor_id != None:
            return self._handle_get_tutor_sessions(request, tutor_id)
        if path.endswith('/sessions/registered/') and student_id != None:
            return self._handle_get_student_registered(request, student_id)
        if session_id is not None:
            return self._handle_get_session_detail(session_id)
        return self._handle_get_sessions_list(request)

    # POST
    # /student/sessions/register/ --> register student to session
    # /student/follow/<str:student_id>/<str:tutor_id>/ --> student follow tutor
    # /sessions/ --> create new session
    def post(self, request, student_id: str = None, tutor_id: str = None) -> Response:
        path = request.path
        
        if path.endswith('/student/sessions/register/'):
            return self._handle_post_register(request)
        if '/student/follow/' in path and student_id and tutor_id:
            return self._handle_post_follow(student_id, tutor_id)
        return self._handle_post_create_session(request)


    # PUT
    # /student/follow/<str:student_id>/<str:tutor_id>/ --> student follow tutor
    # /sessions/<str:session_id>/ --> update session
    def put(self, request, session_id=None, student_id: str = None, tutor_id: str = None) -> Response:
        path = request.path
        if '/student/follow/' in path and student_id and tutor_id:
            return self._handle_post_follow(student_id, tutor_id)
        return self._handle_put_update_session(request, session_id)

    # DELETE
    # /student/sessions/unregister/ --> unregister student from session
    # /student/follow/<str:student_id>/<str:tutor_id>/ --> student unfollow tutor
    # /sessions/<str:session_id>/ --> delete session
    def delete(self, request, session_id=None, student_id: str = None, tutor_id: str = None) -> Response:
        path = request.path
        print(path)
        if session_id is not None and student_id is not None:
            print("a")
            return self._handle_delete_unregister(student_id, session_id)
        if '/follow/' in path and student_id and tutor_id:
            return self._handle_delete_unfollow(student_id, tutor_id)
        return self._handle_delete_session(session_id)

    # ===================== Handlers (GET) =====================
    # /tutor/sessions/ --> get all sessions by tutor_id (query param)
    def _handle_get_tutor_sessions(self, request, tutor_id) -> Response:
        # tutor_id = request.query_params.get('tutor_id')
        if not tutor_id:
            return Response({"error": "Missing tutor_id"}, status=status.HTTP_400_BAD_REQUEST)
        sessions = self.controller.get_sessions_by_tutor(tutor_id)
        data = {ss.session_id: ss.to_dictionary(has_status=True) for ss in sessions}
        return Response({"sessions": data, "count": len(sessions)})

    # /student/sessions/registered/ --> get all sessions registered by student_id
    def _handle_get_student_registered(self, request, student_id) -> Response:
        # student_id = request.query_params.get('student_id')
        if not student_id:
            return Response({"error": "Missing student_id"}, status=status.HTTP_400_BAD_REQUEST)
        sessions = self.controller.get_sessions_registered_by_student(student_id)
        # print(sessions.tutor)
        # tutor = self.infoController.getProfile(sessions)
        data = {ss.session_id: ss.to_dictionary(has_status=True) for ss in sessions}
        return Response({"sessions": data,  "count": len(sessions)})

    # /sessions/<str:session_id>/ --> get session detail
    def _handle_get_session_detail(self, session_id: str) -> Response:
        session = self.controller.getSessionById2(session_id)
        if session is not None:
            return Response({"session": session.to_dictionary(has_status=True), "message": f"Get Detail {session_id}"})
        return Response({"message": f"Session {session_id} not found"}, status=status.HTTP_404_NOT_FOUND)

    # /sessions/ --> get all sessions (with filters)
    def _handle_get_sessions_list(self, request) -> Response:
        page = int(request.query_params.get('page', 1))
        keyword = request.query_params.get('keyword', "")
        sort_filter = int(request.query_params.get('filter', SessionFiler.DATE))
        status_filter = int(request.query_params.get('status', SessionStatus.NOT_SET))
        sessions_list = self.controller.getSessions(page, keyword, sort_filter, status_filter)
        data = {ss.session_id: ss.to_dictionary(has_status=True) for ss in sessions_list}
        return Response({
            "sessions": data,
            "message": f"Search for {keyword} having {status_filter} status in page {page}. Sorted by {sort_filter}"
        })

    # ===================== Handlers (POST) =====================
    # /student/sessions/register/
    def _handle_post_register(self, request) -> Response:
        data = getattr(request, 'data', {}) or {}
        student_id = data.get('student_id')
        session_id = data.get('session_id')
        if not student_id or not session_id:
            return Response({"error": "Missing student_id or session_id"}, status=status.HTTP_400_BAD_REQUEST)
        ok, msg = self.controller.register_student_to_session(student_id, session_id)
        if ok:
            return Response({"message": msg, "student_id": student_id, "session_id": session_id})
        return Response({"message": msg}, status=status.HTTP_400_BAD_REQUEST)

    # /student/follow/<str:student_id>/<str:tutor_id>/
    def _handle_post_follow(self, student_id: str, tutor_id: str) -> Response:
        ok, msg = self.controller.student_follow_tutor(student_id, tutor_id)
        if ok:
            return Response({"message": msg, "student_id": student_id, "tutor_id": tutor_id})
        return Response({"message": msg}, status=status.HTTP_400_BAD_REQUEST)

    # /sessions/ --> create new session
    def _handle_post_create_session(self, request) -> Response:
        # generate id
        id = 0
        auto_gen_id = f"ss{id}"
        while self.controller.getSessionById(auto_gen_id) is not None:
            id += 1
            auto_gen_id = f"ss{id}"
        session_id = auto_gen_id
        try:
            data = request.data
            new_session = Session(
                session_id,
                data['name'],
                data['tutor'],
                [],
                data['date'],
                data['time'],
                data['duration'],
                data['online'],
                data['address'],
                data['address'],
                data['description'],
                data['note'],
                data['document']
            )
        except KeyError as e:
            return Response({"error": f"Missing field: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        valid = self.controller.addSession(new_session)
        if valid:
            return Response({"message": f"Created {session_id}", "id": session_id}, status=status.HTTP_200_OK)
        return Response({"error": "Lịch dạy bị trùng!"}, status=status.HTTP_400_BAD_REQUEST)

    # ===================== Handlers (PUT) =====================
    # /sessions/<str:session_id>/ --> update session
    def _handle_put_update_session(self, request, session_id: str) -> Response:
        data = request.data
        session = self.controller.getSessionById(session_id)
        tutor = session.tutor
        students = session.students
        new_session = Session(
            session_id,
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
            data['document']
        )
        self.controller.updateSession(session_id, new_session)
        return Response({"message": f"Updated {session_id}"})

    # ===================== Handlers (DELETE) =====================
    # /student/sessions/unregister/
    def _handle_delete_unregister(self, student_id, session_id) -> Response:
        # data = getattr(request, 'data', {}) or {}
        # student_id = data.get('student_id')
        # s_id = data.get('session_id')
        s_id = session_id
        if not student_id or not s_id:
            return Response({"error": "Missing student_id or session_id"}, status=status.HTTP_400_BAD_REQUEST)
        ok, msg = self.controller.unregister_student_from_session(student_id, s_id)
        if ok:
            return Response({"message": msg, "student_id": student_id, "session_id": s_id})
        return Response({"message": msg}, status=status.HTTP_400_BAD_REQUEST)

    # /student/follow/<str:student_id>/<str:tutor_id>/
    def _handle_delete_unfollow(self, student_id: str, tutor_id: str) -> Response:
        ok, msg = self.controller.student_unfollow_tutor(student_id, tutor_id)
        if ok:
            return Response({"message": msg, "student_id": student_id, "tutor_id": tutor_id})
        return Response({"message": msg}, status=status.HTTP_400_BAD_REQUEST)

    # /sessions/<str:session_id>/
    def _handle_delete_session(self, session_id: str) -> Response:
        self.controller.removeSession(session_id)
        return Response({"message": f"Removed {session_id}"})