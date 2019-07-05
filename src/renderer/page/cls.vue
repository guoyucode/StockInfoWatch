<template><!--财联社电报-->

	<div v-loading.lock="loading">
		<el-card class="box-card" v-for="item in data" :key="item.id">
			<div slot="header" class="clearfix">
				<span v-text="'发布时间: ' + formatTime(item.ctime * 1000)">发布时间</span>
				<!--<span style="float: right; padding: 3px 0" v-text="'阅读量: ' + item.reading_num"></span>-->
			</div>
			<div class="text item" v-text="item.brief">
				列表内容
			</div>
		</el-card>
		<el-card class="box-card" key="99999999" style="cursor:pointer;" @click.native="requestData('next')">
			<div v-if="!loading" class="text item" >
				<span style="margin-left: 40%;">点击加载更多</span>
			</div>
		</el-card>
	</div>

		<!--
		<el-card class="box-card" key="-1" style="cursor:pointer;" >
			<div class="text item">
				更新中...
			</div>
		</el-card>
		-->

</template>

<script>

    import {caiLianSheRequest, caiLianSheUpdateRequest} from './api/cls'
    import {dataLenthLimit, DateFormat, delayer, generalHandlerData, mergeData, notification} from "./js/utils";
    import {getDBStore} from "./js/db";
    import {initDB} from "./js/project";
	let vue = null

    export default {
        name: 'cls',
        props: {
            tabClick: Function, //点击通知消息功换到该消息的tab中去
        },
        data() {
            return {
                setInterval_time: 50,
                data: [],
                loading: true,
                enableNotice: true,
                dbStore: null,
            }
        },
        watch: {
            setInterval_time: delayer(cur => {
                vue.dbStore.push("cls.setInterval_time", cur)
	            vue.setInterval()
            }),
            enableNotice: delayer(cur => {
                vue.dbStore.push("cls.enableNotice", cur)
            }),
        },
	    created(){
          vue = this;
	    },
        mounted() {
            getDBStore(readDBStore => {
                vue.dbStore = readDBStore
                initDB(vue, "cls")
                vue.setInterval()
            })
            vue.requestData()
        },
        methods: {

            //请求财联社电报数据
            requestData(next) {
                vue.loading = true

	            //下一页,点击更多时
                let data = {}
                if(next && next == "next" && this.data && this.data.length>0){
                    data.last_time = this.data[this.data.length-1].ctime
                }

                caiLianSheRequest(data).then(function (res) {
                    vue.loading = false
                    if(!res || res.error != 0) return;
                    res = res.data;
                    if(!res || !res.roll_data || res.roll_data.length === 0) return
                    let rows = res.roll_data;
                    console.log("财联网 res-data", rows)
                    generalHandlerData(vue, next, rows, "id", "财联社电报", "title")
                })
            },

            //定时器
            setInterval(){
                if(vue.setInterval_val) {
                    clearInterval(vue.setInterval_val)
                    vue.setInterval_val = null
                }
                vue.setInterval_val = setInterval(function () {
                    vue.requestUpdateData("setInterval")
                }, vue.setInterval_time*1000)
            },

            //定时请求
            requestUpdateData(next) {
                if(!vue.data && vue.data.length == 0) return vue.requestData("refresh")
                caiLianSheUpdateRequest({last_time: vue.data[0].ctime}).then(function (res) {
                    if(!res || res.error != 0) return;
                    res = res.data;
                    if(!res || !res.update_num ||  !res.roll_data || res.roll_data.length === 0) return
                    let rows = res.roll_data
                    generalHandlerData(vue, next, rows, "id", "财联社电报", "title")
                })
            },

            //格式化时间方法
            formatTime(time) {
                let date = new Date(time)
                return DateFormat(date)
            },

        }
    }
</script>

<style scoped>
</style>
