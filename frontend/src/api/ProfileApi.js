// API helper for Profile operations (Tutor & Student)
const BASE_URL = 'http://127.0.0.1:8000';

export const profileApi = {
    // --- TUTOR ---
    getTutorProfile: async (tutorId) => {
        try {
            const response = await fetch(`${BASE_URL}/tutor/${tutorId}/information/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('Error fetching tutor profile:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    updateTutorProfile: async (tutorId, profileData) => {
        try {
            const response = await fetch(`${BASE_URL}/tutor/${tutorId}/information/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('Error updating tutor profile:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    // --- STUDENT ---
    getStudentProfile: async (studentId) => {
        try {
            const response = await fetch(`${BASE_URL}/student/${studentId}/information/`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('Error fetching student profile:', error);
            return {
                success: false,
                error: error.message
            };
        }
    },

    updateStudentProfile: async (studentId, profileData) => {
        try {
            const response = await fetch(`${BASE_URL}/student/${studentId}/information/`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(profileData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            return {
                success: true,
                data: data
            };
        } catch (error) {
            console.error('Error updating student profile:', error);
            return {
                success: false,
                error: error.message
            };
        }
    }
};
