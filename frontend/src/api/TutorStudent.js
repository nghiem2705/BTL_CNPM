const BASE_URL = 'http://127.0.0.1:8000';

// API for managing tutor's students
export const tutorStudentApi = {
    // Get all students following a tutor
    getAll: async (tutorId) => {
        try {
            const response = await fetch(`${BASE_URL}/tutor/${tutorId}/students/`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch students')
            }
            
            const data = await response.json();
            
            // Backend returns: { students: [...], message: "..." }
            return data.students || [];
        } catch (error) {
            console.error('Error fetching students:', error);
            throw error;
        }
    },

    // Get student detail by ID
    getById: async (tutorId, studentId) => {
        try {
            const response = await fetch(`${BASE_URL}/student/${studentId}/information/`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' }
            });
            
            if (!response.ok) {
                throw new Error('Failed to fetch student detail');
            }
            
            const data = await response.json();
            return data.profile || {};
        } catch (error) {
            console.error('Error fetching student detail:', error);
            throw error;
        }
    }
};

