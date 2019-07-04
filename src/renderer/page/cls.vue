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

    import {caiLianSheRequest, caiLianSheUpdateRequest} from './js/api-cls'
    import {dataLenthLimit, DateFormat, notification} from "./js/utils";

    export default {
        name: 'cls',
        props: {
            refreshFun: Function,//刷新方法
            tabClick: Function, //点击通知消息功换到该消息的tab中去
        },
        data() {
            return {
                cls_SetInterval: 10,
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
                    let row = res.roll_data;
                    console.log("data", row)
                    self.data = row
                    self.loading = false
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
                if(self.clcSetInterval_val){
                    clearInterval(self.clcSetInterval_val)
                    self.clcSetInterval_val = undefined
                }
                self.clcSetInterval_val = setInterval(function () {
                    self.requestUpdateData(self.cls_last_time)
                }, self.setInterval_time*1000)
            },

            //定时请求
            requestUpdateData(cls_last_time) {
                const self = this
                caiLianSheUpdateRequest({cls_last_time: cls_last_time}).then(function (res) {
                    if(!res || !res.update_num) return;
                    let list = res.roll_data
                    self.cls_last_time = list[0].ctime
                    for (let i = list.length-1; i >= 0; i --) {
                        let v = list[i];
                        self.data.splice(0, 0, v)

                        let body = v.brief + "";
                        let number = body.indexOf("】");
                        if(number != -1 && number > 10) body = body.substring(0, number)

                        //通知
                        if(list.length <= 3) notification("财联社电报", body, self.tabClick)
                    }

                    //数据长度限制
                    dataLenthLimit(self.data)

                    //通知
                    if(list.length > 3) notification("财联社电报", "多于三条消息,请进入应用中查看 !", self.tabClick)

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
	.box-card {
		margin-bottom: 18px;
		margin-right: 15px;
	}

	.el-card__body2 {
		padding: 13px !important;
	}
</style>
