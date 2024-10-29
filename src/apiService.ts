// src/apiService.ts

const API_BASE_URL = 'http://localhost:8080/sep';

export const fetchDataByButtonType = async (btnType: string | null, username: string | null): Promise<any> => {
    let endpoint = '';

    switch (btnType) {
        case 'applications':
            endpoint = 'applications';
            break;
        default:
            throw new Error('Invalid button type');
    }

    return fetchData(endpoint, username);
};

export const fetchEmpData = async (endpoint: string, username: string | null, applicationId: string): Promise<any> => {
    try {
        if (!username) {
            throw new Error('null username');
        }

        const url = `${API_BASE_URL}/${endpoint}?username=${encodeURIComponent(username)}&applicationId=${encodeURIComponent(applicationId)}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

const fetchData = async (endpoint: string, username: string | null): Promise<any> => {
    try {
        if (!username) {
            throw new Error('null username');
        }

        const url = `${API_BASE_URL}/${endpoint}?username=${encodeURIComponent(username)}`;
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        return await response.json();
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
};

export const postData = async (endpoint: string, data: any): Promise<any> => {
    try {
        const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return await response.json();
    } catch (error) {
        console.error('Post error:', error);
        throw error;
    }
};