import axios from 'axios';

export default {
    async get(id) {
        const { data } = await axios.get('http://omeka-s.vagrant.ugent.be/v2/gentgemapt/api/place/get/' + parseInt(id) );
        return data;
    },
    async search(text) {
        const { data } = await axios.get('http://omeka-s.vagrant.ugent.be/v2/gentgemapt/api/place/search?text=' + encodeURIComponent(text));
        return data;
    },
    async list() {
        const { data } = await axios.get('http://omeka-s.vagrant.ugent.be/v2/gentgemapt/api/place/list');
        return data;
    }
}
