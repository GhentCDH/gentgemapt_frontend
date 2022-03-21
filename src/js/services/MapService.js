import axios from 'axios';

import api from '../config/constants'

export default {
    async list() {
        const { data } = await axios.get(api + '/gentgemapt/map/list');
        return data;
    }
}
