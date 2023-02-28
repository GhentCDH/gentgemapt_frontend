export default {
    namespaced: true,
    state: () => ({
        collapsed: false,
        expanded: false,
        content: {},
        id: null
    }),
    getters: {
        collapsed(state) {
            return state.collapsed
        }
    },
    mutations: {
        collapse(state, status = true) {
            state.collapsed = status;
        },
        expand(state, status = true) {
            state.expanded = status;
        },
        toggle(state, payload) {
            if ( ['collapsed', 'expanded'].includes(payload.property) ) {
                state[payload.property] = !state[payload.property]
            }
        },
        initStoreId(state, id) {
            state.id = id
        }
    },
    actions: {
        collapse(context, status = true) {
            context.commit('collapse', status)
            if ( !context.state.collapsed )
                context.commit('focusSidebar', context.state.id, { root: true})
            else
                context.commit('removeSidebarFocus', context.state.id, { root: true})
        },
        expand(context, status = true) {
            context.commit('expand', status)
        },
        toggle(context, payload) {
            context.commit('toggle', payload)
            if ( !context.state.collapsed )
                context.commit('focusSidebar', context.state.id, { root: true})
            else
                context.commit('removeSidebarFocus', context.state.id, { root: true})
        },
        initStoreId(context, id) {
            context.commit('initStoreId', id)
        }
    }
}