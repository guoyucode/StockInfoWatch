<template>
	<div>

		<el-tabs type="border-card" :value="swithTab" @tab-click="tabClick">

			<el-tab-pane name="财联社电报" v-loading="loading" label="财联社电报" style="overflow-y: scroll;" :style="{height: clientHeight + 'px'}">
				<!--<el-card class="box-card" key="-1" style="cursor:pointer;" >
					<div class="text item">
						更新中...
					</div>
				</el-card>-->

				<el-card class="box-card" v-for="item in data" :key="item.id">
					<div slot="header" class="clearfix">
						<span v-text="'发布时间: ' + formatTime(item.ctime * 1000)">发布时间</span>
						<span style="float: right; padding: 3px 0" v-text="'阅读量: ' + item.reading_num"></span>
					</div>
					<div class="text item" v-text="item.brief">
						列表内容
					</div>
				</el-card>

				<el-card class="box-card" key="99999999" style="cursor:pointer;" >
					<div class="text item" @click="requestData('next')">
						<span style="margin-left: 40%;">点击加载更多</span>
					</div>
				</el-card>

			</el-tab-pane>


			<el-tab-pane name="互动易问答" v-loading="loading2" label="互动易问答" style="overflow-y: scroll;" :style="{height: clientHeight + 'px'}">
				<el-card class="box-card" v-for="item in data2" :key="item.indexId">
					<div slot="header" class="clearfix">
						<span >发布时间: {{formatTime(Number.parseInt(item.pubDate))}}</span>
						<span style="padding-left: 15px;">认证公司: {{item.companyShortName}} [{{item.stockCode}}]</span>
						<span style="padding-left: 15px;">发布者: {{item.authorName}}</span>
						<!--<span style="float: right; padding: 3px 0" v-text="'阅读量: '"></span>-->
					</div>
					<div class="text item" >
						<a style="color: #0077E6;">问 </a>{{item.mainContent}}
						<div class="text item" v-if="item.attachedContent">
							<br/>
							<a style="color: orange;">答 </a>{{item.attachedContent}}
						</div>
					</div>

				</el-card>

				<!--<el-card class="box-card" key="99999999" style="cursor:pointer;" @click="requestData2('next')">
					<div class="text item">
						<span style="margin-left: 40%;">点击加载更多</span>
					</div>
				</el-card>-->

			</el-tab-pane>


		</el-tabs>


	</div>
</template>


<script>

    import {caiLianSheRequest, caiLianSheUpdateRequest} from './js/api'
    import {DateFormat} from "./js/utils";
    import {interactiveRequest} from "./js/api-2";
    import {getStore} from "./js/db";

    export default {
        name: 'index',
        data() {
            return {
                cls_SetInterval: 10,
                cls_last_time: 0,
	            cls_next_time: 0,
                dbCommonStore: null,
                swithTab: "财联社电报",
                clientHeight: 450,
                data: null,
                data2: null,
                loading: true,
                loading2: true,
            }
        },
	    watch: {},
        mounted() {
            const self = this;

            //快捷键设置
            this.shortKey()

	        //请求数据
            //this.requestData()
            //this.requestData2()

	        //设置窗口大小
            this.windowsResize()
            window.onresize = this.windowsResize

	        //获得公共数据库
            getStore("common", function (dbStore) {
                self.dbCommonStore = dbStore
                self.swithTabs()
            })
        },
        methods: {

            //请求财联社电报数据
            requestData(next) {
                console.log("requestData", next)
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
                setInterval(function () {
                    self.requestUpdateData(self.cls_last_time)
                }, 10*1000)
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
                        if(number != -1 && number <= 10 && body.length > 10) body = body.substring(0, 10)

                        //通知
	                    if(list.length <= 3) self.notification("财联社电报更新", body)
                    }

                    //通知
                    if(list.length > 3) self.notification("财联社电报更新", "多于三条消息.....")

                })
            },

            //格式化时间方法
            formatTime(time) {
                let date = new Date(time)
                return DateFormat(date)
            },

            //调整窗口大小时触发此方法
            windowsResize() {
                this.clientHeight = document.documentElement.clientHeight - 90
            },

            //互动易请求
            requestData2() {
                const self = this
                self.loading2 = true
                interactiveRequest().then(function (res) {
                    console.log("data2", res.results)
                    self.data2 = res.results;
                    self.loading2 = false
                })
            },

            //设置快捷键
            shortKey() {
                const self = this;
                const globalShortcut = require('electron').remote.globalShortcut
                globalShortcut.register('F5', () => {
                    self.requestData()
                })
            },

            //通知
            notification(title, body) {
                let myNotification = new Notification(title, {
                    body: body
                })

                myNotification.onclick = () => {
                    console.log('通知被点击')
                }
            },

            //切换tab
            swithTabs() {
                const self = this;
                self.dbCommonStore.select("tabName", function (tab) {
                    if (tab) self.swithTab = tab
                    self.requestByTabName(tab)
                });

            },

	        //tab选中
            tabClick(tab) {
                this.dbCommonStore.push("tabName", tab.name);
                this.requestByTabName(tab.name)
            },

	        //根据tab名字请求数据
	        requestByTabName(name){
                if(!name || name == "财联社电报") this.requestData()
                else if(name == "互动易问答") this.requestData2()
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


	.content-wrapper .left-content {
		margin-bottom: 12px;
		background-color: #fff;
		border-radius: 6px;
		box-shadow: 0 2px 4px 0 rgba(28, 31, 33, 0.05);
	}

	.table-list .table-head {
		height: 60px;
		line-height: 60px;
		border-bottom: 1px #eee solid;
	}

	.pd-20 {
		padding: 0 20px;
	}

	.table-list .table-footer {
		height: 40px;
		line-height: 40px;
		color: #8790A4;
	}

	.pd-10-20 {
		padding: 10px 20px;
	}

	table-list .table-head .like-box {
		float: right;
		margin-top: 16px;
	}

	.like-box {
		background-color: #e8f1fa;
		color: #0077e6;
		border-color: transparent !important;
		font-size: 12px;
		padding: 8px 10px;
	}

	a:link {
		color: #333;
		text-decoration: none;
	}

	.content-wrapper .sub-wrapper {
		padding-right: 16px;
		position: relative;
	}

	.table-list .table-footer span .icon {
		font-size: 13px;
	}
	.icon {
		width: 1em;
		height: 1em;
		vertical-align: -0.15em;
		fill: currentColor;
		overflow: hidden;
	}

	.table-list .table-footer .right-box {
		float: right;
		height: 40px;
		line-height: 40px;
		min-width: 240px;
	}
	table-list .table-footer .like-content {
		color: #8790A4;
		font-size: 14px;
		margin-left: 24px;
		height: 40px;
		cursor: pointer;
	}
	[class*="el-col-"] {
		float: left;
		-webkit-box-sizing: border-box;
		box-sizing: border-box;
	}
	.table-list .table-footer span i {
		margin-right: 8px;
		font-size: 20px;
		float: left;
		cursor: pointer;
	}
	.iconfont {
		font-family: "iconfont" !important;
		font-size: 16px;
		font-style: normal;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}
	.icon-ICON_dianzan::before {
		content: "\e67b";
	}
	.table-list .table-footer span i {
		font-size: 20px;
		cursor: pointer;
	}
	.table-list .question-content .question-icon {
		width: 20px;
		height: 20px;
		margin-right: 4px;
		margin-bottom: 3px;
		vertical-align: middle;
	}
	.table-list .reply-content .reply-icon {

		width: 20px;
		height: 20px;
		margin-right: 4px;
		margin-bottom: 3px;
		vertical-align: middle;

	}
	.table-list .table-head .company-name {

		padding-left: 4px;
		font-size: 14px;
		color: #333;
		cursor: pointer;

	}
	.table-list .table-head .like-box {

		float: right;
		margin-top: 16px;

	}
	.like-box {

		background-color: #e8f1fa;
		color: #0077e6;
		border-color: transparent !important;
		font-size: 12px;
		padding: 8px 10px;

	}
	.el-button--primary {

		color: #fff;
		background-color: #0077E6;
		border-color: #0077E6;

	}
</style>
