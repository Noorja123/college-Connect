import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const BASE_URL = process.env.VITE_API_BASE_URL || 'http://localhost:5005/api';

const run = async () => {
    try {
        console.log('Testing login request to', BASE_URL);
        const response = await axios({
            url: `${BASE_URL}/auth/login`,
            method: 'POST',
            data: { email: 'admin@college.edu', password: 'password123' }
        });
        
        console.log('AXIOS RAW RESPONSE:', response.data);
        let dataToReturn;
        if (response.data && response.data.success !== undefined && response.data.data !== undefined) {
             console.log('Hit the new format branch. Will return:', response.data.data);
             dataToReturn = response.data.data;
        } else {
             console.log('Hit the old format branch. Will return:', response.data);
             dataToReturn = response.data;
        }

        console.log('');
        console.log('Returned data is:', dataToReturn);
        console.log('Type of Returned data is:', typeof dataToReturn);
        if (dataToReturn === null) console.log('Data is exactly null');
        if (dataToReturn === undefined) console.log('Data is exactly undefined');
        console.log('Token is:', dataToReturn.token);
    } catch (e) {
        console.error('Request failed!', e.response ? e.response.data : e.message);
    }
};

run();
