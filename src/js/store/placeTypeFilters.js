import union from 'lodash/union';

import placeTypes from '../data/placeTypes'

export default {
    namespaced: true,
    state: () => ( {
        filters: placeTypes,
    }),
    getters: {
        getFilters: state => state.filters,
    },
    mutations: {
        setFilters(state, filters) {
            state.filters = filters
        },
        setFilterStatus(state, payload) {
            if ( payload?.id && payload?.active !== undefined ) {
                state.filters.filter( i => i.id === payload.id ).forEach( i => i.active = payload.active )
            }
        },
        reset(state, active = true) {
            state.filters.forEach( i => i.active = active)
        },
    },
    actions: {
        setFilterStatus(context, payload) {
            context.commit('setFilterStatus', payload);
        },
        activateAll(context) {
            context.commit('reset', true)
        },
        activateNone(context) {
            context.commit('reset', false)
        }
    }
}