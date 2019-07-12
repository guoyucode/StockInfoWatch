<template>
	<div>
		<el-tabs type="border-card" ref="tabs" v-model="configData.common.tabName" @tab-click="tabClick" @tab-remove="tabRemove">

			<!--v-loading.lock="cls.loading" -->
			<el-tab-pane v-if="configData.cls.enable" name="财联社电报" label="财联社电报" style="overflow-y: scroll;" :style="{height: clientHeight + 'px'}" >
				<news_view :data="cls.data" :nextPage="cls_request"></news_view>
			</el-tab-pane>

			<el-tab-pane v-if="configData.hdy.enable" name="深交所互动易问答" label="深交所互动易问答" style="overflow-y: scroll;" :style="{height: clientHeight + 'px'}" >
				<news_view :data="hdy.data" :nextPage="hdy_request"></news_view>
			</el-tab-pane>

			<el-tab-pane v-if="configData.dycj.enable" name="第一财经直播区" label="第一财经直播区" style="overflow-y: scroll;" :style="{height: clientHeight + 'px'}" >
				<news_view :data="dycj.data" :nextPage="dycj_request"></news_view>
			</el-tab-pane>

			<el-tab-pane v-if="configData.xuangubao.enable" name="选股宝" label="选股宝" style="overflow-y: scroll;" :style="{height: clientHeight + 'px'}" >
				<news_view :data="xuangubao.data" :nextPage="xuangubao_request"></news_view>
			</el-tab-pane>

			<el-tab-pane v-if="configData.yuncaijing.enable" name="云财经" label="云财经" style="overflow-y: scroll;" :style="{height: clientHeight + 'px'}">
				<news_view :data="yuncaijing.data" :nextPage="yuncaijing_request"></news_view>
			</el-tab-pane>

			<el-tab-pane :closable="true" v-if="configData.setting.enable" name="设置" style="overflow-y: scroll;" :style="{height: clientHeight + 'px'}" :lazy="true">
				<span slot="label"><i class="el-icon-setting"></i> 设置 </span>
				<setting></setting>
			</el-tab-pane>

		</el-tabs>

		<i class="el-icon-setting" v-if="!configData.setting.enable" @click="configData.setting.enable = true; tabClick('设置') " style="position: absolute; float: right;top: 21px;right: 27px; cursor:pointer;"></i>
	</div>
</template>


<script>

    import Setting from "./setting";
    import {initAlert, refreshAction} from "./js/project";
    import configData from "./js/config_data"
    import {api_cls_request} from "./api/cls"
    import News_view from "./news_view";
    import {api_dycj_request} from "./api/dycj";
    import {delayer} from "./js/utils"
    import {api_hdy_request} from "./api/hdy";
    import {api_xuangubao_request} from "./api/xuangubao";
    import {api_yuncaijing_requestData} from "./api/yuncaijing";

    let vue = null;

    export default {
        name: 'index',
        components: {News_view, Setting},
        data() {
            return {
                cls: {
                    data: [],
	                loading: true,
                },
                hdy: {
                    data: [],
                    loading: true,
                },
                dycj: {
                    data: [],
                    loading: true,
                },
                xuangubao: {
                    data: [],
                    loading: true,
                },
                yuncaijing: {
                    data: [],
                    loading: true,
                },
                configData: configData,
                settingClose: true,
                dbStore: null,
                clientHeight: 450,
            }
        },
	    computed: {
	    },
        watch: {
            "configData.cls.setInterval_time": delayer(cur => { vue.setInterval("财联社定时器", cur, vue.cls_request) }),
            "configData.dycj.setInterval_time": delayer(cur => { vue.setInterval("第一财经", cur, vue.dycj_request) }),
        },
	    created(){
            vue = this;
	    },
        mounted() {
            const self = this;

            initAlert(vue)

            //设置窗口大小
            this.windowsResize()
            window.onresize = this.windowsResize

            refreshAction(function () {
                let name = vue.configData.common.tabName;

                //发布刷新事件
	            vue.$eventBus.$emit(name + "-refresh")
            })

            vue.cls_request()
	        vue.dycj_request()
	        vue.hdy_request()
	        vue.xuangubao_request()
	        vue.yuncaijing_request()
        },
        methods: {

            cls_request(param) {
                api_cls_request(param, v => {
                    vue.cls.data = v
                })
            },

            hdy_request(param) {
                api_hdy_request(param, v => {
                    vue.hdy.data = v
                })
            },

	        dycj_request(param) {
                api_dycj_request(param, v => {
                    vue.dycj.data = v
                })
            },

            xuangubao_request(param){
                api_xuangubao_request(param, v => {
                    vue.xuangubao.data = v
                })
            },

            yuncaijing_request(param){
                api_yuncaijing_requestData(param, v => {
                    vue.yuncaijing.data = v
                })
            },

            //调整窗口大小时触发此方法
            windowsResize() {
                this.clientHeight = document.documentElement.clientHeight - 90
            },

            // 点击tab, 或者点击通知打开tab,那么需要这个tab存在才切换到该tab
            tabClick(tab) {
                let name = tab.name || tab
	            if(name == "设置") {
	                this.configData.common.tabName = name
                    this.configData.setting.enable = true
		            return;
                }
                let childrens = this.$refs.tabs.$children
                for(let k = childrens.length-1; k >= 0; k--){
                    let idStr = childrens[k].$el.id;
                    if(idStr && idStr.indexOf(name) != -1){
                        this.configData.common.tabName = name
	                    return
                    }
                }
            },

	        // 关闭设置,打开最后一个tab
            tabRemove(tab) {
                let childrens = this.$refs.tabs.$children
                for(let k = childrens.length-1; k >= 0; k--){
                    let idStr = childrens[k].$el.id;
                    if(idStr && idStr.indexOf("设置") == -1){
                        let id = idStr.split("-")[1]
                        this.tabClick(id)
                        this.configData.setting.enable = false
						return
                    }
                }
	            alert("全部关闭将不能显示任何数据")
            },

            //定时器
            setInterval(title = "定时器标题", setInterval_time = 0, reqestFun) {
                if (!setInterval_time) return
                if (vue[title]) {
                    clearInterval(vue[title])
                    vue[title] = null
                }
                vue[title] = setInterval(function () {
                    reqestFun("setInterval")
                }, setInterval_time * 1000)
            }

        }
    }
</script>

<style >
	.box-card {
		margin-bottom: 18px;
		margin-right: 15px;
	}

	.el-card__body2 {
		padding: 13px !important;
	}
</style>
