<template><!--云财经-->

	<div v-loading="loading">
		<el-card class="box-card" v-for="item in data" :key="item.id">
			<div slot="header" class="clearfix">
				<span v-text="'发布时间: ' + formatTime(item.inputtime)">发布时间</span>
				<!--<span style="float: right; padding: 3px 0" v-text="'阅读量: ' + item.reading_num"></span>-->
			</div>
			<div class="text item" v-text="item.title">
				列表内容
			</div>
			<div class="text item" style="color: #757575; margin-top: 13px;" v-if="item.description" v-text="item.description">
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

    import {dataLenthLimit, DateFormat, mergeData, notification} from "./js/utils";
    import {yuncaijingRequest} from "./api/yuncaijing";

    let page = 1

    export default {
        name: 'yuncaijing',
        props: {
            tabClick: Function, //点击通知消息功换到该消息的tab中去
        },
        data() {
            return {

                setInterval_time: 30,
                data: [],
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

            //请求数据
            requestData(next) {
                const self = this
                if(!next || next != "setInterval") self.loading == true
                let data = {}
                if(next && next == "next") {
                    data.page = ++page
                }
                yuncaijingRequest(data).then(function (res) {
                    self.loading = false
                    if(!res || !res.data || res.data.length === 0) return


                    let rows = res.data;
                    console.log("云财经 res-data", rows)

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

                        if(rows.length > 0) notification("云财经", "多于三条消息,请进入应用中查看 !", self.tabClick)
                        else{
                            for (let k in rows) {
                                let row = rows[k];
                                notification("云财经", row.title, self.tabClick)
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
            formatTime(inputtime) {
                let d1 = new Date(Number.parseInt(inputtime) * 1000);
                return DateFormat(d1)
            },

        }
    }
</script>

<style scoped>
</style>
