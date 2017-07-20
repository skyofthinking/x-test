<template>
    <div class="app-container">
        <el-form ref="form" :model="form" label-width="80px">
            <el-form-item label="待办事项">
                <el-input v-model="form.todotext" @keyup.enter.native="addTodo"></el-input>
            </el-form-item>
            <el-form-item label="名称" style="display:none">
                <el-input v-model="form.name"></el-input>
            </el-form-item>
        </el-form>
        <el-card class="box-card">
            <todo v-for="(todoItem, index) in todoList" v-bind:key="todoItem.index" :todoItem="todoItem" :index="index"></todo>
        </el-card>
    </div>
</template>

<script>
import Todo from '@/components/example/todo'

export default {
    name: 'todoList',
    components: {
        Todo
    },
    data() {
        return {
            form: {
                name: '',
                todotext: ''
            }
        }
    },
    computed: {
        todoList() {
            return this.$store.getters.todos
        }
    },
    methods: {
        addTodo() {
            this.$store.commit('addTodo', this.form.todotext)
            this.todoText = ''
        },
        deleteTodo(index) {
            this.$store.commit('deleteTodo', index)
        }
    }
}
</script>

<style>
ul {
    list-style: none;
    padding: 0;
}
</style>