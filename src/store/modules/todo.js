import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import VueLocalStorage from 'vue-localstorage'
Vue.use(VueLocalStorage)

const STORAGE_KEY = 'todos-vuejs'

const todo = {
    state: {
        todos: JSON.parse(window.localStorage.getItem(STORAGE_KEY) || '[]')
    },

    mutations: {
        addTodo(state, text) {
            state.todos.push({
                text,
                done: false
            })
            // window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos))
        },
        deleteTodo(state, index) {
            state.todos.splice(index, 1)
            // window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos))
        },
        toggleTodo(state, index) {
            state.todos[index].done = !state.todos[index].done
            // window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state.todos))
        }
    },

    plugins: store => {
        store.subscribe((mutations, { todos }) => {
            console.log('plugins')
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
        })
    }
};

export default todo;