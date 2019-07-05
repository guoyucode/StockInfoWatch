<template><!--第一财经直播区-->

	<div v-loading="loading">
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
    import {dataLenthLimit, DateFormat, generalHandlerData, mergeData, notification} from "./js/utils";

    export default {
        name: 'dycj',
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
            self.mySetInterval()
            self.requestData()
        },
        methods: {

            //请求数据
            requestData(next) {
                const self = this
                if(!next || next != "setInterval") self.loading == true
                let data = {}
                if(next && next == "next") data.page = ++self.page
                dycjRequest(data).then(function (res) {
                    self.loading = false
                    if(!res || res.length === 0) return
                    let rows = res;
                    console.log("第一财经 res-data", rows)
                    generalHandlerData(self, next, rows, "id", "第一财经直播区", "newcontent")
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
            formatTime(time) {
                let date = new Date(time)
                return DateFormat(date)
            },

        }
    }
</script>

<style scoped>
</style>
