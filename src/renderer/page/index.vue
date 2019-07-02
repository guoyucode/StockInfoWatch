<template>
	<div>

		<el-tabs type="border-card" :value="swithTab" @tab-click="tabClick">

			<el-tab-pane name="财联社电报" v-loading="loading" label="财联社电报" style="overflow-y: scroll;" :style="{height: clientHeight + 'px'}">
				<el-card class="box-card" v-for="item in data" :key="item.id">
					<div slot="header" class="clearfix">
						<span v-text="'发布时间: ' + formatTime(item.ctime)">发布时间</span>
						<span style="float: right; padding: 3px 0" v-text="'阅读量: ' + item.reading_num"></span>
					</div>
					<div class="text item" v-text="item.brief">
						列表内容
					</div>
				</el-card>
			</el-tab-pane>


			<el-tab-pane name="互动易问答" v-loading="loading" label="互动易问答" style="overflow-y: scroll;" :style="{height: clientHeight + 'px'}">
				<div class="left-content table-list" v-for="item in data2">
					<div class="table-head pd-20">
						<a href="http://irm.cninfo.com.cn/ircs/company/companyDetail?stockcode=002681&amp;orgId=9900022749" target="_blank">
							<img src="http://resstatic.cninfo.com.cn/irm//ssgs/S002681/images/002681.gif">
							<span class="company-name m-company-name"><span class="compnay-name">奋达科技&nbsp;
									<span class="company-code hidden-sm-and-up">(002681)</span>
							</span>
								<span class="company-code hidden-xs-only">[002681]</span>
								<span class="question-time hidden-sm-and-up">{{item.packageDate}}</span></span></a>
						<button type="button" class="el-button like-box hidden-xs-only el-button--primary el-button--mini" data-status="0"><!----><!---->
							<span><i class="el-icon-plus"></i> <span class="attention-text">关注</span></span></button>
						<div class="right-box hidden-xs-only hidden-sm-and-up"><span class="question-time">{{item.packageDate}}<</span></div>
					</div>
					<div data-id="401083177482932224" class="table-content translate-box"><!----> <a href="http://irm.cninfo.com.cn/ircs/question/questionDetail?questionId=401083177482932224" target="_blank">
						<div class="question-content pd-20 pb-10">
							<img src="http://ircsstatic.cninfo.com.cn/ircs//assets/images/question-icon.png" alt="" class="question-icon">
							{{item.mainContent}}
						</div>
						<div class="reply-content pd-20 pb-10"><img src="http://ircsstatic.cninfo.com.cn/ircs//assets/images/reply-icon.png" alt="" class="reply-icon">
							{{item.attachedContent}}
							<!----></div>
					</a></div>
					<div class="table-footer pd-10-20"><span class="flag-title new-question-icon hidden-xs-only"><svg aria-hidden="true" width="100%" class="icon"><use xlink:href="#icon-ICON_NEW"></use></svg>
                                    最新 ·  问答</span> <a href="http://irm.cninfo.com.cn/ircs/investorHomePage/investorInfo?userId=91818646225027072" target="_blank" class="hidden-xs-only"><span
							class="user-name hidden-xs-only">股市西门吹雪 ·</span></a> <!----> <span class="question-time hidden-xs-only">刚刚 ·</span> <span class="question-platform hidden-xs-only">来源
                                        &nbsp;网站</span>
						<div class="right-box el-row"><span data-status="0" class="like-content el-col-xs-8"><i class="iconfont icon-ICON_dianzan"></i> <span class="count-number">点赞</span></span> <span><div
								role="tooltip" id="el-popover-3327" aria-hidden="true" class="el-popover el-popper share-popover" style="display: none;" tabindex="0"><!---->
								<p onclick="" data-clipboard-text="http://irm.cninfo.com.cn/ircs/question/questionDetail?questionId=401083177482932224"
								   class="share-box copyBtn"><svg
										aria-hidden="true" width="100%" class="icon"><use xlink:href="#icon-lianjie"></use></svg> <span>复制链接</span></p> <p class="share-box"><svg aria-hidden="true" width="100%"
								                                                                                                                                                  class="icon"><use
									xlink:href="#icon-xinlangweibo"></use></svg> <span>新浪微博</span></p> <p class="share-box"><svg aria-hidden="true" width="100%" class="icon"><use
									xlink:href="#icon-weixin"></use></svg> <span>微信扫一扫</span></p> <p class="share-box" align="center"><img src="" alt=""></p> </div><span
								class="like-content el-col-xs-8 shareClick el-popover__reference" aria-describedby="el-popover-3327" tabindex="0"><i class="iconfont icon-ICON_fenxiang"></i>分享</span></span> <span
								data-status="0" class="like-content el-col-xs-8 collection "><i class="iconfont icon-ICON_shoucang"></i>
收藏                                        </span></div>
					</div>
				</div>
			</el-tab-pane>

		</el-tabs>


	</div>
</template>


<script>

    import {caiLianSheRequest} from './js/api'
    import {DateFormat} from "./js/utils";
    import {interactiveRequest} from "./js/api-2";
    import {getStore} from "./js/db";

    export default {
        name: 'index',
        data() {
            return {
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
            this.requestData()
            this.requestData2()

	        //设置窗口大小
            this.windowsResize()
            window.onresize = this.windowsResize

	        //通知
            this.notification()

	        //获得公共数据库
            getStore("common", function (dbStore) {
                self.dbCommonStore = dbStore
                self.swithTabs()
            })
        },
        methods: {

            //请求财联社电报数据
            requestData() {
                const self = this
                self.loading = true
                caiLianSheRequest().then(function (res) {
                    self.data = res.roll_data
                    self.loading = false
                })
            },

            //格式化时间方法
            formatTime(time) {
                let date = new Date(time * 1000)
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
                    console.log("data2-res", res)
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
            notification() {
                let myNotification = new Notification('标题', {
                    body: '通知正文内容'
                })

                myNotification.onclick = () => {
                    console.log('通知被点击')
                }
            },

            //切换tab
            swithTabs() {
                const self = this;
                self.dbCommonStore.select("tab", function (tab) {
                    if (tab) self.swithTab = tab;
                });

            },

	        //tab选中
            tabClick(tab) {
                this.dbCommonStore.push("tab", tab.name);
            }
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
