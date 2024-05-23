import axios from 'axios';

import layers from '../data/layers'

export default {
    async list(project_id = null) {
        return layers;
        // let endpoint = process.env.URL_API + '/api/gentgemapt/map/list'
        // if (project_id) {
        //     endpoint += '?project_id=' + parseInt(project_id);
        // }
        // const { data } = await axios.get(endpoint);
        // return data;
    }
}
