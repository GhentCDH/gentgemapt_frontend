import urlJoin from 'url-join'
import store from '../store'
import UrlPattern from "url-pattern";

export default {
    createProjectUrl(project) {
        return '/' + (store.getters['project/getDefaultProject'].id === project.id ? '' : project.slug)
    },
    createPlaceUrl(place_id, project = null) {
        project = project ?? store.getters['project/getActiveProject']
        return project ? urlJoin(this.createProjectUrl(project), 'plaats', place_id) : urlJoin('plaats', place_id)
    },
    parseUrlPath(url_path) {
        const urlPatterns = [
            '/:project_slug(/plaats/:place_id)',
            '/plaats/:place_id'
        ]
        const defaultReturn = { project_slug: null, place_id: null}
        const patternOptions = {segmentValueCharset: 'a-zA-Z0-9-_', segmentNameCharset: 'a-zA-Z0-9_-'}

        for (let pattern of urlPatterns) {
            const urlSegmentValues = (new UrlPattern(pattern, patternOptions)).match(url_path)
            if (urlSegmentValues) {
                return { ...defaultReturn, ...urlSegmentValues }
            }
        }

        return defaultReturn
    }
}
