<template><!--深交所互动易问答-->
	<div v-loading="loading">

		<el-card class="box-card" v-for="item in data" :key="item.indexId">
			<div slot="header" class="clearfix">
				<span>发布时间: {{formatTime(Number.parseInt(item.pubDate))}}</span>
				<span style="padding-left: 15px;">公司: {{item.companyShortName}} [{{item.stockCode}}]</span>
				<span style="padding-left: 15px;">发布人: {{item.authorName}}</span>
			</div>
			<div class="text item">
				<a style="color: #0077E6;">问 </a>{{item.mainContent}}
				<div class="text item" v-if="item.attachedContent">
					<br/>
					<a style="color: orange;">答 </a>{{item.attachedContent}}
				</div>
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

    import {dataLenthLimit, DateFormat, mergeData, notification} from "./common-js/utils";
    import {interactiveRequest, interactiveUnReadRequest} from "./api/hdy";

    export default {
        name: 'hdy',
        props: {
            refreshFun: Function,//刷新方法
            tabClick: Function,
        },
        data() {
            return {
                page: 1,
                setInterval_time: 30,
                hdy_refreshTime: 0,
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

            //格式化时间方法
            formatTime(time) {
                let date = new Date(time)
                return DateFormat(date)
            },

            //互动易请求
            requestData(next) {
                const self = this
                if (!next) self.loading = true
	            var data = {}
	            if (next && next == "next") {
                    self.loading = true
	                data.page = ++self.page
                }
                interactiveRequest(data).then(function (res) {
                    let rows = res.results;
                    console.log("互动易 res-data", rows)
                    self.loading = false
                    if(!rows || rows.length === 0) return

                    /*if(rows && rows.length >0){
						let pubDate = rows[0].pubDate
						let number = Number.parseInt(pubDate);
						let formatTime = self.formatTime(number)
						let formatTime = DateFormat(new Date());
						let refreshTime = formatTime.replace(" ", "+")
						self.hdy_refreshTime = refreshTime
					}*/

                    //加载更多的逻辑
                    if(next && next == "next"){
                        for (let k in rows) {
                            self.data.push(rows[k])
                        }
                    }

                    else if (!next) {
                        self.data = rows;
                        self.hdySetInterval()
                    } else {

                        if(!self.data || self.data.length === 0) self.data = rows;
                        else mergeData(rows, self.data, "indexId")

                        //通知
                        if (rows.length > 3) notification("深交所互动易问答", "多于三条消息,请进入应用中查看 !", self.tabClick)
                        else {
                            for (let i = rows.length - 1; i >= 0; i--) {
                                let row = rows[i];
                                let mainContent = row.companyShortName + ": " + row.mainContent + "";
                                notification("深交所互动易问答", mainContent, self.tabClick)
                            }
                        }

                    }

                    //数据长度限制
                    dataLenthLimit(self.data)

                })
            },

            //互动易定时器
            hdySetInterval() {
                let self = this;
                if (self.hdySetInterval_val) {
                    clearInterval(self.hdySetInterval_val)
                    self.hdySetInterval_val = undefined
                }
                self.hdySetInterval_val = setInterval(function () {
                    let formatTime = DateFormat(new Date());
                    let refreshTime = formatTime.replace(" ", "+")
                    interactiveUnReadRequest({refreshTime: refreshTime}).then(res => {
                        if (res.statusCode != 200) return
                        if (res.data == 0) return
                        console.log("interactiveUnReadRequest", res)
                        self.requestData("hdySetInterval");
                        console.log("互动易请求-刷新到新数据: ", res.data)
                    })
                }, self.setInterval_time * 1000)
            },

        }
    }
</script>

<style scoped>
</style>
