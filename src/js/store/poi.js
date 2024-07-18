export default {
    namespaced: true,
    state: () => ({
        place: null,
    }),
    getters: {
        getPlace(state) {
            return state.place
        },
    },
    mutations: {
        setPlace(state, place) {
            state.place = place
        },
    },
    actions: {
        setPlace({commit}, place) {
            commit('setPlace', place)
        },
        clearPlace({commit}) {
            commit('setPlace', null)
        }
    }
}
