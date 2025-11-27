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