<template><!--选股宝-->

	<div v-loading="loading">
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

		<el-card v-if="!loading" class="box-card" key="99999999" style="cursor:pointer;" >
			<div class="text item" @click="requestData('next')">
				<span style="margin-left: 40%;">点击加载更多</span>
			</div>
		</el-card>
	</div>
</template>

<script>

    import {xuangubaoRequest} from './api/xuangubao'
    import {dataLenthLimit, DateFormat, mergeData, notification} from "./common-js/utils";
    let markData = null //下次提交的记号数据

    export default {
        name: 'xuangubao',
        props: {
            tabClick: Function, //点击通知消息功换到该消息的tab中去
        },
        data() {
            return {

                setInterval_time: 30,
                data: [],
                loading: true,
	            page: 1,
            }
        },
        watch: {},
        mounted() {
            const self = this;

            //请求数据
            this.requestData()
        },
        methods: {

            //请求数据
            requestData(next) {
                const self = this
                if(!next || next != "setInterval") self.loading == true
                let data = {}
                if(next && next == "next" && markData && markData.TailMsgId) {
                    data.TailMark = markData.TailMark
                    data.TailMsgId = markData.TailMsgId
                }
                xuangubaoRequest(data).then(function (res) {
                    self.loading = false
                    if(!res || res.NewMsgs.length === 0) return

	                //记号数据
                    markData = {HeadMark: res.HeadMark, TailMark: res.TailMark, TailMsgId: res.TailMsgId}

                    let rows = res.NewMsgs;
                    console.log("选股宝 res-data", rows)

	                //加载更多的逻辑
	                if(next && next == "next"){
                        for (let k in rows) {
	                        self.data.push(rows[k])
                        }
	                }

                    //定时刷新的逻辑
                    else if(next && next == "setInterval"){
                        //合并数据
                        if(!self.data || self.data.length === 0) self.data = rows
                        else mergeData(rows, self.data, "id")

                        if(rows.length > 0) notification("第一财经直播区", "多于三条消息,请进入应用中查看 !", self.tabClick)
                        else{
                            for (let k in rows) {
                                let row = rows[k];
                                notification("第一财经直播区", item.newcontent, self.tabClick)
                            }
                        }
	                }

                    //手动刷新
                    else if(next && next == "refresh") {

                        //合并数据
	                    if(!self.data || self.data.length === 0) self.data = rows
                        else mergeData(rows, self.data, "id")
                    }
                    else{
                        self.data = rows
                        self.mySetInterval()
                    }

                    //数据长度限制
                    dataLenthLimit(self.data)

                })

            },

            //请求定时器
            mySetInterval(){
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
