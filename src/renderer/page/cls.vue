<template><!--财联社电报-->

	<div v-loading.fullscreen.lock="loading">
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
    import {dataLenthLimit, DateFormat, generalHandlerData, mergeData, notification} from "./js/utils";

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
            }
        },
        watch: {},
        mounted() {
            const self = this;
            self.clcSetInterval()
            self.requestData()
        },
        methods: {

            //请求财联社电报数据
            requestData(next) {
                const self = this
                self.loading = true

	            //下一页,点击更多时
                let data = {}
                if(next && next == "next" && this.data && this.data.length>0){
                    data.last_time = this.data[this.data.length-1].ctime
                }

                caiLianSheRequest(data).then(function (res) {
                    self.loading = false
                    if(!res || res.error != 0) return;
                    res = res.data;
                    if(!res || !res.roll_data || res.roll_data.length === 0) return
                    let rows = res.roll_data;
                    console.log("财联网 res-data", rows)
                    generalHandlerData(self, next, rows, "id", "财联社电报", "title")
                })
            },

            //财联社定时器
            clcSetInterval(){
                let self = this;
                if(self.clcSetInterval_val) return
                self.clcSetInterval_val = setInterval(function () {
                    self.requestUpdateData("setInterval")
                }, self.setInterval_time*1000)
            },

            //定时请求
            requestUpdateData(next) {
                const self = this
                if(!self.data && self.data.length == 0) return self.requestData("refresh")
                caiLianSheUpdateRequest({last_time: self.data[0].ctime}).then(function (res) {
                    if(!res || res.error != 0) return;
                    res = res.data;
                    if(!res || !res.update_num ||  !res.roll_data || res.roll_data.length === 0) return
                    let rows = res.roll_data
                    generalHandlerData(self, next, rows, "id", "财联社电报", "title")
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
