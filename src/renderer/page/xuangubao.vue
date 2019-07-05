<template><!--选股宝-->

	<div v-loading.lock="loading">
		<el-card class="box-card" v-for="item in data" :key="item.Id">
			<div slot="header" class="clearfix">
				<span v-text="'发布时间: ' + formatTime(item.CreatedAt)">发布时间</span>
				<!--<span style="float: right; padding: 3px 0" v-text="'阅读量: ' + item.reading_num"></span>-->
			</div>
			<div class="text item" v-text="item.Title">
				列表内容
			</div>
			<div class="text item" style="color: #757575; margin-top: 13px;" v-if="item.Summary" v-text="item.Summary">
				新闻描述
			</div>
		</el-card>

		<el-card v-if="!loading" class="box-card" key="99999999" style="cursor:pointer;" @click.native="requestData('next')">
			<div class="text item" >
				<span style="margin-left: 40%;">点击加载更多</span>
			</div>
		</el-card>
	</div>
</template>

<script>

    import {xuangubaoRequest} from './api/xuangubao'
    import {dataLenthLimit, DateFormat, generalHandlerData, delayer, notification} from "./js/utils";
    import {getDBStore} from "./js/db";
    import {initDB} from "./js/project";
    let markData = null //下次提交的记号数据
    let vue = null

    export default {
        name: 'xuangubao',
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
        created(){
            vue = this;
        },
        watch: {
            setInterval_time: delayer(cur => {
                vue.dbStore.push("xuangubao.setInterval_time", cur)
                vue.setInterval()
            }),
            enableNotice: delayer(cur => {
                vue.dbStore.push("xuangubao.enableNotice", cur)
            }),
        },
        mounted() {
            const self = this;
            getDBStore(readDBStore => {
                vue.dbStore = readDBStore
                initDB(vue, "xuangubao")
                vue.setInterval()
            })

            self.requestData()
        },
        methods: {

            //请求数据
            requestData(next) {
                const self = this
                if(!next || next != "setInterval") self.loading = true
                let data = {}
                if(next && next == "next" && markData && markData.TailMsgId) {
                    data.TailMark = markData.TailMark
                    data.TailMsgId = markData.TailMsgId
                }
                xuangubaoRequest(data).then(function (res) {
                    self.loading = false
                    if(!res || !res.NewMsgs || res.NewMsgs.length === 0) return
                    let rows = res.NewMsgs;
                    console.log("选股宝 res-data", rows)
                    generalHandlerData(self, next, rows, "id", (vue.enableNotice?"第一财经直播区":false), "newcontent")
                    markData = {HeadMark: res.HeadMark, TailMark: res.TailMark, TailMsgId: res.TailMsgId}//记号数据
                })
            },

            //请求定时器
            setInterval(){
                let self = this;
                if(self.setInterval_val) return
                self.setInterval_val = setInterval(function () {
                    self.requestData("setInterval")
                }, self.setInterval_time*1000)
            },

            //格式化时间方法
            formatTime(str) {
                let s = str.replace("T", " ").replace("Z"," ");
                let d1 = new Date(s);
                let d2 = new Date(d1.getTime() + 8 * 3600 * 1000);
                return DateFormat(d2)
            },

        }
    }
</script>

<style scoped>
</style>
