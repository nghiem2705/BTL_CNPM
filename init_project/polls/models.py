from django.db import models
from enum import Enum

#
# Grading system implementation
#
class Grade:
    def __init__(self, in_name, in_weight, in_score = 0):
        self.name = in_name
        self.weight = in_weight
        self.score = in_score
        
class Grade_Record:
    def __init__(self, tutor_name, student_name):
        self.tutor = tutor_name
        self.student = student_name
        self.grades = []

    def add_grade(self, in_name, in_weight, in_score):
        new_grade = Grade(in_name, in_weight, in_score)
        self.grades.append(new_grade)

    def calculate_final_score(self):
        final_score = 0
        total_weight = 0
        for grade in self.grades:
            final_score += grade.score * grade.weight
            total_weight += grade.weight
        if total_weight == 0:
            return 0
        return final_score / total_weight
    
    def to_dictionary(self):
        grade_list = []
        for grade in self.grades:
            grade_list.append({
                'name': grade.name,
                'weight': grade.weight,
                'score': grade.score
            })
        return {
            'tutor': self.tutor,
            'student': self.student,
            'component': grade_list,
        }

#
# Scheduler system implementation
#
class Session:
    def __init__(self):
        self.session_id = ""
        self.tutor_name = ""
        self.students = []
        self.date = None
        self.time = None
        self.duration = 0
        self.is_online = False
        self.address = ""
        self.description = ""
        self.note = ""
        self.document = ""

    def __init__(self, session_id, tutor_name, students, date, time, duration, is_online, address, description, note, document):
        self.session_id = session_id
        self.tutor_name = tutor_name
        self.students = students
        self.date = date
        self.time = time
        self.duration = duration
        self.is_online = is_online
        self.address = address
        self.description = description
        self.note = note
        self.document = document