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
    def get(self, request, session_id = None) -> Response:
        if session_id is not None:
            session = self.controller.getSessionById(session_id)
            if session is not None:
                return Response({"session": session.to_dictionary(have_status=True), "message": f"Get Detail {session_id}"})
            else:
                return Response({"message": f"Session {session_id} not found"}, status=status.HTTP_404_NOT_FOUND)

        page = int(request.query_params['page'])
        keyword = request.query_params['keyword']
        filter = int(request.query_params['filter'])
        status = int(request.query_params['status'])
        sessions_list = self.controller.getSessions(
            page, keyword, filter, status)
        
        # print([{ss.session_id: ss.to_dictionary()} for ss in sessions_list])

        into_dict = {ss.session_id: ss.to_dictionary(have_status=True) for ss in sessions_list}
        return Response({"sessions": into_dict, "message": f"Search for {keyword} having {status} status in page {page}. Sorted by {filter}"})
    
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
        new_session = Session(session_id, 
                        data['name'],
                        data['tutor'],
                        data['students'],
                        data['date'],
                        data['time'],
                        data['duration'],
                        data['online'],
                        data['address'],
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