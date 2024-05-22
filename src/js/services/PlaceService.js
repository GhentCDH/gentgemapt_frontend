import axios from 'axios';

export default {
    async get(id) {
        const { data } = await axios.get(process.env.URL_API + '/api/gentgemapt/place/get/' + parseInt(id) );
        return data;
    },
    async search(text, project_id = null) {
        let endpoint = process.env.URL_API + '/api/gentgemapt/place/search?text=' + encodeURIComponent(text);
        if (project_id) {
            endpoint += '&project_id=' + parseInt(project_id);
        }
        const { data } = await axios.get(endpoint);
        return data;
    },
    async list(project_id = null) {
        let endpoint = process.env.URL_API + '/api/gentgemapt/place/list'
        if (project_id) {
            endpoint += '?project_id=' + parseInt(project_id);
        }
        const { data } = await axios.get(endpoint);
        return data;
    }
}
