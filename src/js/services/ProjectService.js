import axios from 'axios';

export default {
    async get(id) {
        const { data } = await axios.get(process.env.URL_API + '/api/gentgemapt/project/' + parseInt(id) );
        return data;
    },
    async list() {
        const { data } = await axios.get(process.env.URL_API + '/api/gentgemapt/project/list');
        return data;
    }
}
