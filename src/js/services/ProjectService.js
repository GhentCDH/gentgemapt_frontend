import axios from 'axios';
import store from '../store'

export default {
    async get(id) {
        const { data } = await axios.get(store.getters['config/getApiUrl'] + '/api/gentgemapt/project/' + parseInt(id) );
        return data;
    },
    async list() {
        const { data } = await axios.get(store.getters['config/getApiUrl'] + '/api/gentgemapt/project/list');
        return data;
    }
}
