<template>
    <div class="app-container">
        <div class="filter-container">
            <el-input @keyup.enter.native="handleFilter" style="width: 200px;" class="filter-item" placeholder="标题" v-model="listQuery.title">
            </el-input>

            <el-select clearable style="width: 90px" class="filter-item" v-model="listQuery.importance" placeholder="重要性">
                <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item">
                </el-option>
            </el-select>

            <el-select clearable class="filter-item" style="width: 130px" v-model="listQuery.type" placeholder="类型">
                <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key">
                </el-option>
            </el-select>

            <el-select @change='handleFilter' style="width: 120px" class="filter-item" v-model="listQuery.sort" placeholder="排序">
                <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key">
                </el-option>
            </el-select>

            <el-button class="filter-item" type="primary" v-waves icon="search" @click="handleFilter">搜索</el-button>
            <el-button class="filter-item" style="margin-left: 10px;" @click="handleCreate" type="primary" icon="edit">添加</el-button>
        </div>

        <el-table :data="list" v-loading.body="listLoading" element-loading-text="加载中..." border fit highlight-current-row>
            <el-table-column align="center" label='ID' width="95">
                <template scope="scope">
                    {{scope.$index}}
                </template>
            </el-table-column>

            <el-table-column label="Title">
                <template scope="scope">
                    <span class="link-type" @click="handleUpdate(scope.row)">{{scope.row.title}}</span>
                </template>
            </el-table-column>

            <el-table-column label="Author" width="110" align="center">
                <template scope="scope">
                    <span>{{scope.row.author}}</span>
                </template>
            </el-table-column>

            <el-table-column label="Pageviews" width="110" align="center">
                <template scope="scope">
                    {{scope.row.pageviews}}
                </template>
            </el-table-column>

            <el-table-column align="center" prop="created_at" label="Display_time" width="200">
                <template scope="scope">
                    <i class="el-icon-time"></i>
                    <span>{{scope.row.display_time}}</span>
                </template>
            </el-table-column>

            <el-table-column align="center" label="操作" width="150">
                <template scope="scope">
                    <el-button v-if="scope.row.status!='deleted'" size="small" type="danger" @click="handleDelete(scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div v-show="!listLoading" class="pagination-container">
            <el-pagination @size-change="handleSizeChange" @current-change="handleCurrentChange" :current-page.sync="listQuery.page"
                :page-sizes="[10, 15, 20, 30, 50]" :page-size="listQuery.limit" layout="total, sizes, prev, pager, next, jumper"
                :total="total">
            </el-pagination>
        </div>

        <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
            <el-form class="small-space" :model="temp" label-position="left" label-width="70px" style='width: 400px; margin-left:50px;'>
                <el-form-item label="类型">
                    <el-select class="filter-item" v-model="temp.type" placeholder="请选择">
                        <el-option v-for="item in  calendarTypeOptions" :key="item.key" :label="item.display_name" :value="item.key">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="状态">
                    <el-select class="filter-item" v-model="temp.status" placeholder="请选择">
                        <el-option v-for="item in  statusOptions" :key="item" :label="item" :value="item">
                        </el-option>
                    </el-select>
                </el-form-item>

                <el-form-item label="时间">
                    <el-date-picker v-model="temp.timestamp" type="datetime" placeholder="选择日期时间">
                    </el-date-picker>
                </el-form-item>

                <el-form-item label="标题">
                    <el-input v-model="temp.title"></el-input>
                </el-form-item>

                <el-form-item label="重要性">
                    <el-rate style="margin-top:8px;" v-model="temp.importance" :colors="['#99A9BF', '#F7BA2A', '#FF9900']"></el-rate>
                </el-form-item>

                <el-form-item label="点评">
                    <el-input type="textarea" :autosize="{ minRows: 2, maxRows: 4}" placeholder="请输入内容" v-model="temp.remark">
                    </el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="dialogFormVisible = false">取 消</el-button>
                <el-button v-if="dialogStatus=='create'" type="primary" @click="create">确 定</el-button>
                <el-button v-else type="primary" @click="update">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import { getList } from '@/api/user';

    const calendarTypeOptions = [
        { key: 'CN', display_name: '中国' },
        { key: 'US', display_name: '美国' },
        { key: 'JP', display_name: '日本' },
        { key: 'EU', display_name: '欧元区' }
    ];

    export default {
        data() {
            return {
                list: null,
                total: null,
                importanceOptions: [1, 2, 3],
                calendarTypeOptions, sortOptions: [{ label: '按ID升序列', key: '+id' }, { label: '按ID降序', key: '-id' }],
                listLoading: true,
                listQuery: {
                    page: 1,
                    limit: 10,
                    importance: undefined,
                    title: undefined,
                    type: undefined,
                    sort: '+id'
                },
                temp: {
                    id: undefined,
                    importance: 0,
                    remark: '',
                    timestamp: 0,
                    title: '',
                    type: '',
                    status: 'published'
                },
                statusOptions: ['published', 'draft', 'deleted'],
                dialogFormVisible: false,
                dialogStatus: '',
                textMap: {
                    update: '编辑',
                    create: '创建'
                }
            }
        },
        created() {
            this.getList();
        },
        methods: {
            getList() {
                this.listLoading = true;
                getList(this.listQuery).then(response => {
                    this.list = response.data.items;
                    this.total = response.data.total;
                    this.listLoading = false;
                })
            },
            handleFilter() {
                this.getList();
            },
            handleSizeChange(val) {
                this.listQuery.limit = val;
                this.getList();
            },
            handleCurrentChange(val) {
                this.listQuery.page = val;
                this.getList();
            },
            handleCreate() {
                this.resetTemp();
                this.dialogStatus = 'create';
                this.dialogFormVisible = true;
            },
            handleUpdate(row) {
                this.temp = Object.assign({}, row);
                this.dialogStatus = 'update';
                this.dialogFormVisible = true;
            },
            handleDelete(row) {
                this.$notify({
                    title: '成功',
                    message: '删除成功',
                    type: 'success',
                    duration: 2000
                });
                const index = this.list.indexOf(row);
                this.list.splice(index, 1);
            }, create() {
                this.temp.id = parseInt(Math.random() * 100) + 1024;
                this.temp.timestamp = +new Date();
                this.temp.author = '原创作者';
                this.list.unshift(this.temp);
                this.dialogFormVisible = false;
                this.$notify({
                    title: '成功',
                    message: '创建成功',
                    type: 'success',
                    duration: 2000
                });
            },
            update() {
                this.temp.timestamp = +this.temp.timestamp;
                for (const v of this.list) {
                    if (v.id === this.temp.id) {
                        const index = this.list.indexOf(v);
                        this.list.splice(index, 1, this.temp);
                        break;
                    }
                }
                this.dialogFormVisible = false;
                this.$notify({
                    title: '成功',
                    message: '更新成功',
                    type: 'success',
                    duration: 2000
                });
            },
            resetTemp() {
                this.temp = {
                    id: undefined,
                    importance: 0,
                    remark: '',
                    timestamp: 0,
                    title: '',
                    status: 'published',
                    type: ''
                };
            }
        }
    };

</script>