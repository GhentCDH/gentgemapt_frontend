import urlJoin from 'url-join'
import store from '../store'
import UrlPattern from "url-pattern";

export default {
    getApiUrl() {
        return store.getters['config/getApiUrl']
    },
    getMapUrl() {
        return store.getters['config/getMapUrl'] ?? '/'
    },
    getInfositeUrl() {
        return store.getters['config/getSiteUrl']
    },
    createProjectUrl(project) {
        return this.createMapUrl(store.getters['project/getDefaultProject'].id === project.id ? '' : project.slug)
    },
    createPlaceUrl(placeId, project = null, absolute = false) {
        project = project ?? store.getters['project/getActiveProject']
        return project ? urlJoin(this.createProjectUrl(project), 'plaats', placeId) : urlJoin('plaats', placeId)
    },
    createSiteUrl(path) {
        return urlJoin(store.getters['config/getSiteUrl'], path)
    },
    createMapUrl(path) {
        return urlJoin(store.getters['config/getMapUrl'], path)
    },
    parseUrlPath(urlPath) {
        const urlPatterns = [
            '/:project_slug(/plaats/:place_id)',
            '/plaats/:place_id'
        ]
        const defaultReturn = { project_slug: null, place_id: null}
        const patternOptions = {segmentValueCharset: 'a-zA-Z0-9-_', segmentNameCharset: 'a-zA-Z0-9_-'}

        for (let pattern of urlPatterns) {
            const urlSegmentValues = (new UrlPattern(pattern, patternOptions)).match(urlPath)
            if (urlSegmentValues) {
                return { ...defaultReturn, ...urlSegmentValues }
            }
        }

        return defaultReturn
    }
}
