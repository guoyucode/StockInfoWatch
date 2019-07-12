<template><!--第一财经直播区-->

	<div v-loading.lock="loading">
		<el-card class="box-card" v-for="item in data" :key="item.id">
			<div slot="header" class="clearfix">
				<span v-text="'发布时间: ' + item.datekey + ' '+ item.hm">发布时间</span>
				<!--<span style="float: right; padding: 3px 0" v-text="'阅读量: ' + item.reading_num"></span>-->
			</div>
			<div class="text item" v-html="item.newcontent">
				列表内容
			</div>
		</el-card>
		<el-card class="box-card" key="99999999" style="cursor:pointer;" @click.native="requestData('next')">
			<div v-if="!loading" class="text item" >
				<span style="margin-left: 40%;">点击加载更多</span>
			</div>
		</el-card>
	</div>
</template>

<script>

    import {dycjRequest} from './api/dycj'
    import {DateFormat, generalHandlerData, delayer} from "./js/utils";
    import {getDBStore} from "./js/db";
    import {readData} from "./js/project";
    import configData from "./js/config_data"

    let page = 1
    let vue = null

    export default {
        name: 'dycj',
        props: {
            tabClick: Function, //点击通知消息功换到该消息的tab中去
        },
        data() {
            return {
                setInterval_time: 35,
                data: [],
                loading: true,
                enableNotice: true,
                config: configData.dycj,
            }
        },
        watch: {
            "config.setInterval_time": delayer(cur => { vue.setInterval(cur) }),
        },
        created(){
            vue = this;
        },
        beforeMount() {
            vue.requestData()
            vue.$eventBus.$on("第一财经直播区-refresh", () => vue.requestData("refresh"))
        },
        methods: {

            //请求数据
            requestData(next) {
                const self = this
                if(!next || next != "setInterval") self.loading = true
                let data = {}
                if(next && next == "next") data.page = page+1
                dycjRequest(data).then(function (res) {
                    self.loading = false
                    console.log("第一财经 res-data", res)
                    if(!res || !(res instanceof Array) || res.length === 0) return
                    let rows = res;
                    generalHandlerData(self, next, rows, "id", (vue.config.enableNotice?"第一财经直播区":false), "newcontent")
                    if(next && next == "next") page += 1
                })
            },

            //请求定时器
            setInterval(setInterval_time){
                let self = this;
                if(vue.setInterval_val) {
                    clearInterval(vue.setInterval_val)
                    vue.setInterval_val = null
                }
                self.setInterval_val = setInterval(function () {
                    self.requestData("setInterval")
                }, setInterval_time*1000)
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
