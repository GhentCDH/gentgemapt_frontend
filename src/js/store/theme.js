export default {
    namespaced: true,
    state: () => ({
        theme: {
            colors: {
                primary: null,
                secondary: null,
                primaryContrast: null,
                secondaryContrast: null,
                marker: null,
                markerFocused: null,
                markerContrast: null,
                markerFocusedContrast: null,
            },
            logo: null,
            notch: true,
        },
        defaults: null,
    }),
    getters: {
        getLogo(state) {
            return state.theme.logo
        },
        getPrimaryColor(state) {
            return state.theme.colors.primary
        },
        getSecondaryColor(state) {
            return state.theme.colors.secondary
        },
        getConfig(state) {
            return {
                primaryColor: state.theme.colors.primary,
                secondaryColor: state.theme.colors.secondary,
                logo: state.theme.logo,
            }
        },
        getNotch(state) {
            return state.theme.notch
        },
        getThemeVariables(state) {
            function camelToSnake(string) {
                return string.replace(/([a-z]|(?=[A-Z]))([A-Z])/g, '$1-$2').toLowerCase();
            }

            const variables = {}
            let keys = Object.keys(state.theme.colors)
            keys.forEach(key => {
                if (state.theme.colors[key] !== null) {
                    variables['--theme-color-' + camelToSnake(key)] = state.theme.colors[key]
                }
            })
            variables['--theme-logo'] = state.theme.logo
            return variables
        }
    },
    mutations: {
        setTheme(state, theme) {
            state.theme.logo = theme.logo ?? state.defaults?.logo ?? null
            state.theme.notch = theme.notch ?? state.defaults?.notch ?? true
            for (const key of Object.keys(state.theme.colors)) {
                state.theme.colors[key] = theme?.colors?.[key] ?? state.defaults?.colors?.[key] ?? null
            }
        },
        setThemeDefaults(state, defaults) {
            state.defaults = defaults
            if (!state.theme.logo) {
                state.theme.logo = defaults.logo
            }
            if (!state.theme.notch) {
                state.theme.notch = defaults.notch
            }
            for (const key of Object.keys(state.theme.colors)) {
                if (!state.theme.colors[key]) {
                    state.theme.colors[key] = defaults.colors?.[key]
                }
            }
        }
    },
}
