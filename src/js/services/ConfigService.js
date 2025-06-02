import axios from 'axios';

export default {
    async load() {
        try {
            const { data } = await axios.get('/config.json' );
            return data
        } catch (error) {
            throw new Error('Error loading /config.json');
        }
    },
}
