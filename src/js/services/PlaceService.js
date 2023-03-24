import axios from 'axios';

export default {
    async get(id) {
        const { data } = await axios.get(process.env.URL_API + '/api/gentgemapt/place/get/' + parseInt(id) );
        return data;
    },
    async search(text) {
        const { data } = await axios.get(process.env.URL_API + '/api/gentgemapt/place/search?text=' + encodeURIComponent(text));
        return data;
    },
    async list() {
        const { data } = await axios.get(process.env.URL_API + '/api/gentgemapt/place/list');
        return data;
    }
}
