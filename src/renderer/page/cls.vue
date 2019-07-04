<template><!--财联社电报-->

	<div v-loading="loading">
		<el-card class="box-card" v-for="item in data" :key="item.id">
			<div slot="header" class="clearfix">
				<span v-text="'发布时间: ' + formatTime(item.ctime * 1000)">发布时间</span>
				<span style="float: right; padding: 3px 0" v-text="'阅读量: ' + item.reading_num"></span>
			</div>
			<div class="text item" v-text="item.brief">
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

    import {caiLianSheRequest, caiLianSheUpdateRequest} from './api/cls'
    import {dataLenthLimit, DateFormat, mergeData, notification} from "./common-js/utils";

    export default {
        name: 'cls',
        props: {
            tabClick: Function, //点击通知消息功换到该消息的tab中去
        },
        data() {
            return {
                setInterval_time: 50,
                cls_last_time: 0,
                cls_next_time: 0,
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
                if(next && this.cls_next_time) data.cls_next_time = this.cls_next_time
                caiLianSheRequest(data).then(function (res) {
                    self.loading = false
                    if(!res || !res.roll_data || res.roll_data.length === 0) return

                    let row = res.roll_data;
                    console.log("财联网 res-data", row)

                    self.data = row

                    if(res && row && row.length > 0){
                        self.cls_next_time = row[row.length -1].ctime
                        if(next){
                            for (let k in row) {
                                self.data.push(row[k])
                            }
                        }else{
                            self.cls_last_time = row[0].ctime
                            self.clcSetInterval()
                        }
                    }
                })
            },

            //财联社定时器
            clcSetInterval(){
                let self = this;
                if(self.clcSetInterval_val) return
                self.clcSetInterval_val = setInterval(function () {
                    self.requestUpdateData(self.cls_last_time)
                }, self.setInterval_time*1000)
            },

            //定时请求
            requestUpdateData(cls_last_time) {
                const self = this
                caiLianSheUpdateRequest({cls_last_time: cls_last_time}).then(function (res) {
                    if(!res || !res.update_num ||  !res.roll_data || res.roll_data.length === 0) return
                    let list = res.roll_data

                    self.cls_last_time = list[0].ctime

	                //合并数据
                    if(!self.data || self.data.length === 0) self.data = list;
                    else mergeData(list, self.data, "id")

	                //发送通知
                    if(list.length > 3) notification("财联社电报", "多于三条消息,请进入应用中查看 !", self.tabClick)
	                else{
                        for (let i = list.length-1; i >= 0; i --) {
                            let v = list[i];
                            let body = v.brief + "";
                            let number = body.indexOf("】");
                            if(number != -1 && number > 10) body = body.substring(0, number+1)
                            if(list.length <= 3) notification("财联社电报", body, self.tabClick)
                        }
                    }

                    //数据长度限制
                    dataLenthLimit(self.data)

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
