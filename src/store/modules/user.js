import AuthenticationService from "../../iam/services/authentication.service.js";

// Helper to get user from localStorage
const savedUser = JSON.parse(localStorage.getItem("user"));

export default {
    namespaced: true,
    state: {
        id: savedUser?.id || null,
        role: savedUser?.role || null,
        token: localStorage.getItem("token") || null,
        isAuthenticated: !!(savedUser && localStorage.getItem("token")),
        user: savedUser || null,
    },
    mutations: {
        SET_USER(state, user) {
            state.id = user?.id || null;
            state.role = user?.role || null;
            state.user = user;
            state.isAuthenticated = !!user;
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
            const userPayload = { id, role, username };
            commit("SET_USER", userPayload);
            commit("SET_TOKEN", token);
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(userPayload));
        },
        async signUp(_, payload) {
            await AuthenticationService.signUp(payload);
        },
        signOut({ commit }) {
            commit("CLEAR_USER");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
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
