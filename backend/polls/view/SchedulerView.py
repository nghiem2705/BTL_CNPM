from rest_framework.response import Response 
from rest_framework import status
from .BaseView import BaseView
from polls.controller.SchedulerController import *

class SchedulerView(BaseView):
    def __init__(self):
        super().__init__()
        self.controller = SchedulerController()

    # GET
    def get(self, request, session_id = None, tutor_id = None, student_id = None) -> Response:
        path = request.path
        # Tutor get sessions
        if path.endswith('/sessions/') and tutor_id != None:
            return self._handle_get_tutor_sessions(request, tutor_id)
        
        # Student get registered session
        if path.endswith('/sessions/registered/') and student_id != None:
            return self._handle_get_student_registered(request, student_id)
        
        # Student get registered session
        if path.endswith('/sessions/register/') and student_id != None:
            print(path)

            return self._handle_get_student_unregistered(student_id)
        
        # Student get detail registered session
        if session_id is not None:
            return self._handle_get_session_detail(session_id)
        
        # Student get unregister session
        if path.endswith('/sessions/register/') and student_id != None:
            return self._handle_get_student_unregistered(student_id)


    # POST
    def post(self, request, student_id: str = None, tutor_id: str = None) -> Response:
        path = request.path
        print(path)
        # Student post register session
        if path.endswith('/sessions/register/') and student_id != None:
            return self._handle_post_register(request)
        
        # Student follow tutor
        if '/follow/' in path and student_id and tutor_id:
            print("Follow tutor")
            return self._handle_post_follow(student_id, tutor_id)
        
        # Tutor create new session
        return self._handle_post_create_session(request)


    # PUT
    def put(self, request, session_id=None, student_id: str = None, tutor_id: str = None) -> Response:
        path = request.path

        print(path)
        # Student follow tutor (Phuj)
        if '/follow/' in path and student_id and tutor_id:
            return self._handle_post_follow(student_id, tutor_id)
        
        # Tutor update session
        return self._handle_put_update_session(request, session_id)

    # DELETE
    def delete(self, request, session_id=None, student_id: str = None, tutor_id: str = None) -> Response:
        path = request.path
        # Student unregister session
        if session_id is not None and student_id is not None:
            return self._handle_delete_unregister(student_id, session_id)
        
        # Student unfollow tutor
        if '/follow/' in path and student_id and tutor_id:
            return self._handle_delete_unfollow(student_id, tutor_id)
        
        # Tutor delete session
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
        if not student_id:
            return Response({"error": "Missing student_id"}, status=status.HTTP_400_BAD_REQUEST)
        
        # Extract query parameters for filtering and sorting
        status_filter = request.query_params.get('status')
        if status_filter:
            status_filter = int(status_filter)
        
        month_filter = request.query_params.get('month') == 'true'
        tutor_name = request.query_params.get('tutor', 'Tất cả')
        search = request.query_params.get('search', '')
        sort_by = request.query_params.get('sort', 'date')
        
        # Call controller with filters
        sessions = self.controller.get_sessions_registered_by_student_filtered(
            student_id, status_filter, month_filter, tutor_name, search, sort_by
        )
        
        # Map sessions with tutor info (like in _handle_get_student_unregistered)
        data = {}
        for ss in sessions:
            session_dict = ss.to_dictionary(has_status=True)
            # Get tutor info
            tutor_id = ss.tutor
            tutor_info = self.controller.infoController.readUser().get(tutor_id, {})
            session_dict['tutor'] = {
                'id': tutor_id,
                'name': tutor_info.get('name', tutor_id)
            }
            data[ss.session_id] = session_dict
        
        return Response({"sessions": data,  "count": len(sessions)})

    # /sessions/<str:session_id>/ --> get session detail
    def _handle_get_session_detail(self, session_id: str) -> Response:
        session = self.controller.getSessionById2(session_id)
        if session is not None:
            return Response({"session": session.to_dictionary(has_status=True), "message": f"Get Detail {session_id}"})
        return Response({"message": f"Session {session_id} not found"}, status=status.HTTP_404_NOT_FOUND)

    def _handle_get_student_unregistered(self, student_id: str) -> Response:
        sessions = self.controller.get_sessions_not_registered_by_student(student_id)
        
        data = {}
        for ss in sessions:
            session_dict = ss.to_dictionary(has_status=True)
            # Get tutor info
            tutor_id = ss.tutor
            tutor_info = self.controller.infoController.readUser().get(tutor_id, {})
            session_dict['tutor'] = {
                'id': tutor_id,
                'name': tutor_info.get('name', tutor_id)
            }
            data[ss.session_id] = session_dict

        return Response({"sessions": data, "count": len(sessions)})
    
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
            
            # Validate required fields
            required_fields = ['name', 'tutor', 'date', 'time', 'duration', 'online', 'address', 'description']
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                return Response(
                    {"error": f"Missing required fields: {', '.join(missing_fields)}"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validate duration
            try:
                duration = int(data['duration'])
                if duration < 15:
                    return Response(
                        {"error": "Thời lượng phải ít nhất 15 phút"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                if duration > 480:
                    return Response(
                        {"error": "Thời lượng không được vượt quá 8 giờ (480 phút)"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            except (ValueError, TypeError):
                return Response(
                    {"error": "Thời lượng phải là số nguyên"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validate date format and ensure it's not in the past
            from datetime import datetime
            try:
                session_date = datetime.strptime(data['date'], '%Y-%m-%d')
                if session_date.date() < datetime.now().date():
                    return Response(
                        {"error": "Ngày học không được ở quá khứ"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            except ValueError:
                return Response(
                    {"error": "Định dạng ngày không hợp lệ (YYYY-MM-DD)"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validate time format
            import re
            if not re.match(r'^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$', data['time']):
                return Response(
                    {"error": "Định dạng giờ không hợp lệ (HH:MM)"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validate online/link constraint
            if data.get('online', False) is True:
                link = data.get('link', '').strip()
                if not link:
                    return Response(
                        {"error": "Link họp online không được để trống khi chọn chế độ online"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                # Optional: Validate URL format
                if not (link.startswith('http://') or link.startswith('https://')):
                    return Response(
                        {"error": "Link không hợp lệ"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            new_session = Session(
                session_id,
                data['name'],
                data['tutor'],
                [],
                data['date'],
                data['time'],
                duration,
                data['online'],
                data['address'],
                data.get('link', data['address']),
                data['description'],
                data.get('note', ''),
                data.get('document', [])
            )
        except KeyError as e:
            return Response({"error": f"Missing field: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"Invalid data: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        
        valid = self.controller.addSession(new_session)
        if valid:
            return Response({"message": f"Created {session_id}", "id": session_id}, status=status.HTTP_200_OK)
        return Response({"error": "Lịch dạy bị trùng!"}, status=status.HTTP_400_BAD_REQUEST)

    # ===================== Handlers (PUT) =====================
    # /sessions/<str:session_id>/ --> update session
    def _handle_put_update_session(self, request, session_id: str) -> Response:
        try:
            data = request.data
            session = self.controller.getSessionById(session_id)
            
            if session is None:
                return Response(
                    {"error": f"Session {session_id} not found"}, 
                    status=status.HTTP_404_NOT_FOUND
                )
            
            # Validate required fields
            required_fields = ['name', 'date', 'time', 'duration', 'online', 'description']
            missing_fields = [field for field in required_fields if field not in data]
            if missing_fields:
                return Response(
                    {"error": f"Missing required fields: {', '.join(missing_fields)}"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validate duration
            try:
                duration = int(data['duration'])
                if duration < 15:
                    return Response(
                        {"error": "Thời lượng phải ít nhất 15 phút"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                if duration > 480:
                    return Response(
                        {"error": "Thời lượng không được vượt quá 8 giờ (480 phút)"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            except (ValueError, TypeError):
                return Response(
                    {"error": "Thời lượng phải là số nguyên"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validate date format
            from datetime import datetime
            try:
                session_date = datetime.strptime(data['date'], '%Y-%m-%d')
                if session_date.date() < datetime.now().date():
                    return Response(
                        {"error": "Ngày học không được ở quá khứ"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            except ValueError:
                return Response(
                    {"error": "Định dạng ngày không hợp lệ (YYYY-MM-DD)"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validate time format
            import re
            if not re.match(r'^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$', data['time']):
                return Response(
                    {"error": "Định dạng giờ không hợp lệ (HH:MM)"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            # Validate online/link constraint
            if data.get('online', False) is True:
                link = data.get('link', '').strip()
                if not link:
                    return Response(
                        {"error": "Link họp online không được để trống khi chọn chế độ online"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
                # Optional: Validate URL format
                if not (link.startswith('http://') or link.startswith('https://')):
                    return Response(
                        {"error": "Link phải là URL hợp lệ (http:// hoặc https://)"}, 
                        status=status.HTTP_400_BAD_REQUEST
                    )
            
            tutor = session.tutor
            students = session.students
            new_session = Session(
                session_id,
                data['name'],
                tutor,
                students,
                data['date'],
                data['time'],
                duration,
                data['online'],
                data.get('address', ''),
                data.get('link', ''),
                data['description'],
                data.get('note', ''),
                data.get('document', [])
            )
            
            # Check for schedule conflicts
            if not self.controller.checkDate(new_session):
                return Response(
                    {"error": "Lịch dạy bị trùng!"}, 
                    status=status.HTTP_400_BAD_REQUEST
                )
            
            self.controller.updateSession(session_id, new_session)
            return Response({"message": f"Updated {session_id}"})
        except KeyError as e:
            return Response({"error": f"Missing field: {str(e)}"}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            return Response({"error": f"Update failed: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

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
        print("called")
        ok, msg = self.controller.student_unfollow_tutor(student_id, tutor_id)
        if ok:
            return Response({"message": msg, "student_id": student_id, "tutor_id": tutor_id})
        return Response({"message": msg}, status=status.HTTP_400_BAD_REQUEST)

    # /sessions/<str:session_id>/
    def _handle_delete_session(self, session_id: str) -> Response:
        self.controller.removeSession(session_id)
        return Response({"message": f"Removed {session_id}"})