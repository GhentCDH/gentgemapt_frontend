import axios from 'axios';

export default {
    async list() {
        const { data } = await axios.get(process.env.URL_API + '/api/gentgemapt/map/list');
        return data;
    }
}
