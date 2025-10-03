import AuthenticationService from "../../iam/services/authentication.service.js";

export default {
    namespaced: true,
    state: {
        id: null,
        role: null,
        token: localStorage.getItem("token") || null,
        // El estado de isAuthenticated debe reflejar si hay un token válido
        isAuthenticated: !!localStorage.getItem("token"),
        user: null,
    },
    mutations: {
        SET_USER(state, user) {
            state.id = user?.id || null;
            state.role = user?.role || null;
            state.user = user;
            // -- CORRECCIÓN CLAVE AQUÍ --
            // Si establecemos un usuario, significa que está autenticado.
            state.isAuthenticated = true;
        },
        SET_TOKEN(state, token) {
            state.token = token;
        },
        CLEAR_USER(state) {
            state.id = null;
            state.role = null;
            state.token = null;
            state.isAuthenticated = false;
            state.user = null;
        },
    },
    actions: {
        async signIn({ commit }, payload) {
            const response = await AuthenticationService.signIn(payload);
            const { id, role, token, username } = response.data;
            if (!id || !role || !token) {
                throw new Error("Datos de usuario incompletos en la respuesta del servidor.");
            }

            // Guardamos el token en el almacenamiento local
            localStorage.setItem("token", token);

            // Actualizamos el estado con el token y los datos del usuario
            commit("SET_TOKEN", token);
            commit("SET_USER", { id, role, username });
        },
        async signUp(_, payload) {
            await AuthenticationService.signUp(payload);
        },
        signOut({ commit }) {
            commit("CLEAR_USER");
            localStorage.removeItem("token");
        },
        clearAuth({ commit }) {
            commit("CLEAR_USER");
        },
    },
    getters: {
        isAuthenticated(state) {
            return state.isAuthenticated;
        },
        currentUser(state) {
            return state.user;
        },
        currentUsername(state) {
            return state.user?.username || "Guest";
        },
        userId(state) {
            return state.id;
        },
        userRole(state) {
            return state.role;
        },
        userToken(state) {
            return state.token;
        },
    },
};