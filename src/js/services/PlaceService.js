import axios from 'axios';
import {api} from '../config/constants'

export default {
    async get(id) {
        const { data } = await axios.get(api + '/gentgemapt/place/get/' + parseInt(id) );
        return data;
    },
    async search(text) {
        const { data } = await axios.get(api + '/gentgemapt/place/search?text=' + encodeURIComponent(text));
        return data;
    },
    async list() {
        const { data } = await axios.get(api + '/gentgemapt/place/list');
        return data;
    }
}
