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
	</div>

		<!--<el-card class="box-card" key="-1" style="cursor:pointer;" >
			<div class="text item">
				更新中...
			</div>
		</el-card>-->

		<!--<el-card class="box-card" key="99999999" style="cursor:pointer;" >
			<div class="text item" @click="requestData('next')">
				<span style="margin-left: 40%;">点击加载更多</span>
			</div>
		</el-card>-->


</template>

<script>

    import {dycjRequest} from './api/dycj'
    import {dataLenthLimit, DateFormat, notification} from "./common-js/utils";

    export default {
        name: 'dycj',
        props: {
            tabClick: Function, //点击通知消息功换到该消息的tab中去
        },
        data() {
            return {
                cls_SetInterval: 5,
                data: null,
                loading: true,
            }
        },
        watch: {},
        mounted() {
            const self = this;

            //请求数据
            this.requestData()
        },
        methods: {

            //请求财联社电报数据
            requestData(next) {
                const self = this
                self.loading = true
                let data = {}
                if(next && this.page) data.page = this.page
                dycjRequest(data).then(function (res) {
                    let row = res;
                    console.log("第一财经 res-data", next, row)
                    self.data = row
                    self.loading = false
                })
                if(!next) self.mySetInterval()
            },

            //请求定时器
            mySetInterval(){
                let self = this;
                if(self.setInterval_val) return
                self.setInterval_val = setInterval(function () {
                    //self.requestData("refresh")
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
