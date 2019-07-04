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
		<el-card v-if="!loading" class="box-card" key="99999999" style="cursor:pointer;" >
			<div class="text item" @click="requestData('next')">
				<span style="margin-left: 40%;">点击加载更多</span>
			</div>
		</el-card>
	</div>
</template>

<script>

    import {dycjRequest} from './api/dycj'
    import {dataLenthLimit, DateFormat, mergeData, notification} from "./js/utils";

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

            //请求数据
            this.requestData()
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

	                //加载更多的逻辑
	                if(next && next == "next"){
                        for (let k in rows) {
	                        self.data.push(rows[k])
                        }
	                }

                    //刷新,或者定时刷新的逻辑
                    else if(next && next == "refresh") {

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
            formatTime(time) {
                let date = new Date(time)
                return DateFormat(date)
            },

        }
    }
</script>

<style scoped>
</style>
