<template><!--深交所互动易问答-->
	<div v-loading.lock="loading">

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

		<el-card v-if="!loading" class="box-card" key="99999999" style="cursor:pointer;" @click.native="requestData('next')">
			<div class="text item" >
				<span style="margin-left: 40%;">点击加载更多</span>
			</div>
		</el-card>

	</div>

</template>


<script>

    import {dataLenthLimit, DateFormat, generalHandlerData, delayer, notification} from "./js/utils";
    import {interactiveRequest} from "./api/hdy";
    import {getDBStore} from "./js/db";
    import {readData} from "./js/project";
    let page = 1
    let vue = null

    export default {
        name: 'hdy',
        props: {
            refreshFun: Function,//刷新方法
            tabClick: Function,
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
        watch: {
            setInterval_time: delayer(cur => {
                vue.dbStore.push("hdy.setInterval_time", cur)
                vue.setInterval()
            }),
            enableNotice: delayer(cur => {
                vue.dbStore.push("hdy.enableNotice", cur)
            }),
        },
        created(){
            vue = this;
        },
        mounted() {
            const self = this;
            getDBStore(dbStore => {
                vue.dbStore = dbStore
                dbStore.select("hdy.setInterval_time", v => vue.setInterval_time = v || vue.setInterval_time)
                dbStore.select("hdy.enableNotice", v => vue.enableNotice = v || vue.enableNotice)
            })
            self.requestData()
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
                if (!next || next != "setInterval") self.loading = true
	            var data = {}
	            if (next && next == "next") data.page = page+1
                interactiveRequest(data).then(function (res) {
                    self.loading = false
                    if(!res || !res.results || res.results.length === 0) return
                    let rows = res.results;
                    console.log("互动易 res-data", rows)
                    generalHandlerData(self, next, rows, "indexId", (vue.enableNotice?"深交所互动易问答":false), {keyEval: 'row.companyShortName + ": " + row.mainContent + ""'})
                    if (next && next == "next") page+=1
                })
            },

            //互动易定时器
            setInterval() {
                let self = this;
                if(vue.setInterval_val) {
                    clearInterval(vue.setInterval_val)
                    vue.setInterval_val = null
                }
                self.setInterval_val = setInterval(function () {
                    self.requestData("setInterval");
                    /*let formatTime = DateFormat(new Date());
                    let refreshTime = formatTime.replace(" ", "+")
                    interactiveUnReadRequest({refreshTime: refreshTime}).then(res => {
                        if (res.statusCode != 200) return
                        if (res.data == 0) return
                        self.requestData("setInterval");
                    })*/
                }, self.setInterval_time * 1000)
            },

        }
    }
</script>

<style scoped>
</style>
