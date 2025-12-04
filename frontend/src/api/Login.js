const BASE_URL = 'http://127.0.0.1:8000';

export const SSOApi = {
    login: async (username, password, role ) => {
        try {
            const response = await fetch(`${BASE_URL}/login/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    role: role,
                })
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Đăng nhập thất bại');
            }

            return data;
        } 
        catch (error) {
        console.error("Lỗi API:", error);
        throw error;
        }
    }
};

// export default SSOApi;