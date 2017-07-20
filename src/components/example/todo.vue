<template>
    <div class="text item">
        <el-checkbox v-model="checked" @change="itemCheck(todoItem)">
            <span> {{ index + 1 }} . {{ todoItem.text }} </span>
            <el-button type="success" size="mini" v-if="todoItem.done">完成</el-button>
            <el-button type="danger" class="item-delete" size="mini" @click="deleteClick">删除</el-button>
        </el-checkbox>
    </div>
</template>

<script>
export default {
    props: {
        todoItem: Object,
        index: Number
    },
    data() {
        return {
            checked: false
        }
    },
    methods: {
        itemCheck() {
            this.$store.commit('toggleTodo', this.index)
        },
        deleteClick() {
            this.$store.commit('deleteTodo', this.index)
        }
    }
}
</script>

<style scoped>
.text {
    font-size: 14px;
}

.item {
    padding: 10px 0;
}

.item-delete {
    display: none;
}

.item:hover .item-delete {
    display: inline;
}
</style>