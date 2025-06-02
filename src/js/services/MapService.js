import axios from 'axios';
import store from '../store'

import layers from '../data/layers'

export default {
    async list(project_id = null) {
        return layers;
        // let endpoint = store.getters['config/getApiUrl'] + '/api/gentgemapt/map/list'
        // if (project_id) {
        //     endpoint += '?project_id=' + parseInt(project_id);
        // }
        // const { data } = await axios.get(endpoint);
        // return data;
    }
}
