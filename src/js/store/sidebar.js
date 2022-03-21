export default {
    namespaced: true,
    state: () => ({
        collapsed: false,
        expanded: false,
        content: {}
    }),
    mutations: {
        collapse(state, status = true) {
            state.collapsed = true & status;
        },
        expand(state, status = true) {
            state.expanded = true & status;
        },
        toggle(state, payload) {
            if ( ['collapsed', 'expanded'].includes(payload.property) ) {
                state[payload.property] = !state[payload.property]
            }
        },
    },
    actions: {
        collapse(context, status = true) {
            context.commit('collapse', status)
        },
        expand(context, status = true) {
            context.commit('expand', status)
        },
        toggle(context, payload) {
            context.commit('toggle', payload)
        }
    }
}