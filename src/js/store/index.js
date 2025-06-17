import Vue from 'vue'
import Vuex from 'vuex'

import map from './map'
import poi from './poi'
import project from './project'
import filters from './featureFilters'
import sidebar from './sidebar'
import iiifViewer from './iiifViewer'
import theme from './theme'
import config from './config'

Vue.use(Vuex)

import ProjectService from '../services/ProjectService'
import PlaceService from '../services/PlaceService'
import MapService from '../services/MapService'
import UrlHelper from '../helper/UrlHelper'
import ConfigService from '../services/ConfigService'

const logo = require('@/images/gentgemapt-logo-white.svg')

export default new Vuex.Store({
  modules: {
    config: config,
    map: map,
    poi: poi,
    project: project,
    featureFilters: filters,
    sidebarSearch: sidebar,
    sidebarMaps: sidebar,
    sidebarFilters: sidebar,
    sidebarProjects: sidebar,
    sidebarTimeline: sidebar,
    sidebarInfo: sidebar,
    sidebarViewer: sidebar,
    iiifViewer: iiifViewer,
    theme: theme,
  },
  state: () => ({
    focusedSidebar: [],
    openRequests: 0,
    error: false,
    errorMessage: null,
  }),
  getters: {
    focusedSidebar: (state) => state.focusedSidebar[0] ?? null,
    sidebarWeight: (state) => (sidebar_id) => state.focusedSidebar.indexOf(sidebar_id),
    openRequests: (state) => state.openRequests,
    isError: (state) => state.error,
    getErrorMessage: (state) => state.errorMessage,
  },
  mutations: {
    focusSidebar(state, sidebar_id) {
      state.focusedSidebar.unshift(sidebar_id)
      state.focusedSidebar = [...new Set(state.focusedSidebar)]
    },
    removeSidebarFocus(state, sidebar_id) {
      state.focusedSidebar = state.focusedSidebar.filter(id => id !== sidebar_id)
    },
    startRequest(state) {
      state.openRequests++
    },
    endRequest(state) {
      if (state.openRequests > 0) {
        state.openRequests--
      }
    },
    setError(state, error) {
      state.error = error
    },
    setErrorMessage(state, message) {
      state.errorMessage = message
    },
  },
  actions: {
    async loadConfig({ commit }) {
      commit('startRequest')
      try {
        const config = await ConfigService.load()
        commit('config/setApiUrl', config.URL_API ?? '/')
        commit('config/setMapUrl', config.URL_MAP ?? '/')
        commit('config/setSiteUrl', config.URL_INFOSITE ?? '/')
        commit('config/setDebug', config.DEBUG ?? false)
        commit('endRequest')
      } catch (error) {
        commit('endRequest')
        throw new Error('Failed to load config', error)
      }
    },
    async loadProjects({ state, commit }) {
      if (!state.project.projects.length) {
        commit('startRequest')
        const projects = await ProjectService.list()
        commit('endRequest')
        commit('project/setProjects', projects)
      }
    },
    async loadLayers({ commit, getters }) {
      commit('startRequest', null, { root: true })
      const layers = await MapService.list(getters['project/getActiveProjectId'])
      commit('endRequest', null, { root: true })
      commit('map/setLayers', layers)
    },
    async loadPlaces({ commit, getters }) {
      commit('startRequest')
      const geojson = await PlaceService.list(getters['project/getActiveProjectId'])
      commit('endRequest')
      commit('map/setPlaces', geojson)
    },
    async loadPlace({ commit }, placeId) {
      // commit('startRequest');
      const place = await PlaceService.get(placeId)
      // commit('endRequest');
      commit('poi/setPlace', place)
    },
    async selectPlace({ dispatch, commit, getters }, payload) {
      const { placeId, pushState = true } = payload || {}
      if (!placeId) {
        console.warn('No placeId provided for selection. Skipping place selection.')
        return
      }
      if (!getters['map/getFeatureById'](placeId)) {
        console.warn(`Place with id ${placeId} not found. Skipping place selection.`)
        return
      }
      if (pushState) {
        const placeUrl = UrlHelper.createPlaceUrl(placeId)
        window.history.pushState({}, '', placeUrl)
      }
      dispatch('map/selectFeature', { id: placeId, focus: payload?.focus ?? false })
      dispatch('loadPlace', placeId).then(() => {
        dispatch('sidebarInfo/collapse', false)
      })
    },
    async initProject({ dispatch, commit }, payload) {
      const { project, pushState = true } = payload || {}
      if (!project) {
        console.warn('No project provided for initialization. Skipping project initialization.')
        return
      }

      // clear place
      dispatch('poi/clearPlace')
      // prepare map
      commit('map/clearSelection')
      commit('map/clearHighlight')
      // close sidebars
      commit('sidebarInfo/collapse')
      // set active project
      commit('project/setActiveProject', project)

      // set bounds
      if (project?.config?.bounds) {
        commit('map/setBounds', project.config.bounds)
      }

      // set center
      if (project?.config?.center) {
        commit('map/setCenter', project.config.center)
      }

      // set zoom
      if (project?.config?.zoom) {
        commit('map/setZoom', project.config.zoom)
      }

      // set theme
      commit('theme/setTheme', project?.config?.theme ?? {})

      // set url
      if (pushState) {
        window.history.pushState({}, '', UrlHelper.createProjectUrl(project))
      }

      // load project layers
      if (project?.config?.layers) {
        dispatch('map/setLayers', project.config.layers)
      } else {
        dispatch('loadLayers')
      }

      // load project features
      return dispatch('loadPlaces')
    },
    updateStateFromUrl({ dispatch, commit, getters }) {
      const urlSegmentValues = UrlHelper.parseUrlPath(window.location.pathname)

      // determine active project
      let activeProject = getters['project/getActiveProject']
      let newProject = null
      let pushState = false

      // url refers to project id?
      if (urlSegmentValues.project_slug) {
        newProject = getters['project/getProjectBySlug'](urlSegmentValues.project_slug)
        if (!newProject) {
          console.warn(`Project with slug '${urlSegmentValues.project_slug}' not found. Using default project.`)
          newProject = getters['project/getDefaultProject']
          pushState = true
          urlSegmentValues.place_id = null
        }
      } else {
        newProject = getters['project/getDefaultProject']
      }

      // set active project
      if (activeProject && activeProject.id === newProject.id) {
        // already active project, no need to change
        if (urlSegmentValues.place_id) {
          // select place
          dispatch('selectPlace', { placeId: urlSegmentValues.place_id, pushState: false })
            .then(() => dispatch('map/focusFeature', {id: urlSegmentValues.place_id}))
            .then(() => dispatch('map/redrawFeatures', [urlSegmentValues.place_id]))
        }
        return Promise.resolve()
      } else {
        return dispatch('initProject', { project: newProject, pushState: pushState }).then((result) => {
          if (urlSegmentValues?.place_id) {
            // select place
            dispatch('selectPlace', { placeId: urlSegmentValues.place_id, pushState: false, focus: true })
              .then(() => dispatch('map/redrawFeatures', [urlSegmentValues.place_id]))
          }
        })
      }
    },
    initApplication({ dispatch, commit, getters }) {
      // collapse info window
      dispatch('sidebarInfo/collapse')
      dispatch('sidebarViewer/collapse')
      dispatch('sidebarSearch/collapse')
      dispatch('sidebarMaps/collapse')
      dispatch('sidebarFilters/collapse')
      dispatch('sidebarTimeline/collapse')
      dispatch('sidebarProjects/collapse')

      commit('theme/setThemeDefaults', {
        logo: logo,
        notch: true,
        colors: {
          primary: '#610345',
          secondary: '#ed474a',
          primaryContrast: '#e6e6e6',
          secondaryContrast: '#e6e6e6',
          marker: '#fff',
          markerFocused: '#ed474a',
          markerContrast: '#610345',
          markerFocusedContrast: '#fff',
        },
      })

      // parse url
      dispatch('loadConfig')
        .then(() => dispatch('loadProjects'))
        .then(() => dispatch('updateStateFromUrl'))
        .catch(error => {
          console.error(error)
          commit('setError', true)
          commit('setErrorMessage', 'Failed to initialize application. Please try again later.')
          commit('endRequest')
        })
    },
  },
})
