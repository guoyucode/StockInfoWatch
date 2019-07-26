<template>
	<div>
		<el-tabs type="border-card" ref="tabs" v-model="configData.common.tabName" @tab-click="tabClick" @tab-remove="tabRemove">

			<!--v-loading.lock="cls.loading" -->
			<el-tab-pane v-if="configData.cls.enable" name="财经新闻" style="overflow-y: scroll;" :style="{height: clientHeight + 'px'}" >
				<span slot="label">
					<i><img class="tag-logo" :src="staticPath + '/img/cls.ico'"></i>
					财经新闻
					<span class="unread" @click="viewData.unReadNum=-1" v-if="viewData.unReadNum>0">&nbsp;{{viewData.unReadNum}}&nbsp;</span>
				</span>
				<news_view></news_view>
			</el-tab-pane>

			<el-tab-pane v-if="configData.hdy.enable" name="深交所互动易问答" style="overflow-y: scroll;" :style="{height: clientHeight + 'px'}" >
				<span slot="label">
					<i><img class="tag-logo" :src="staticPath + '/img/hdy.ico'"></i>
					互动问答
					<span class="unread" @click="hdy.unReadNum=-1" v-if="hdy.unReadNum>0">&nbsp;{{hdy.unReadNum}}&nbsp;</span>
				</span>
				<hdy></hdy>
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
    import configData from "./data_handler/config_data"
    import {api_cls_request} from "./api/cls"
    import Hdy from "./hdy";
    import News_view from "./new_view";
    import {api_dycj_request} from "./api/dycj";
    import {api_hdy_request} from "./api/hdy";
    import {api_xuangubao_request} from "./api/xuangubao";
    import {api_yuncaijing_request} from "./api/yuncaijing";
    import {api_taoguba_request} from "./api/taoguba";
    import {viewData} from "./data_handler/view_data"


    const staticPath = require('path').join(__static);

    let vue = null;

    export default {
        name: 'index',
        components: {News_view, Setting, Hdy},
        data() {
            return {
                hdy: {
                    data: [],
                    loading: true,
                    unReadNum: 0,
                },
                viewData: viewData,
                staticPath: staticPath,
                configData: configData,
                settingClose: true,
                dbStore: null,
                clientHeight: 450,
            }
        },
	    computed: {
	    },
        watch: {
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

            refreshAction(/*function () {
                let name = vue.configData.common.tabName;

                //发布刷新事件
	            //vue.$eventBus.$emit(name + "-refresh")
	            if(name == "财联社电报") api_cls_request("refresh")
                else if(name == "深交所互动易问答") api_hdy_request("refresh")
                else if(name == "第一财经直播区") api_dycj_request("refresh")
                else if(name == "选股宝") api_xuangubao_request("refresh")
                else if(name == "云财经") api_yuncaijing_request("refresh")

            }*/)

        },
        methods: {

            hdy_request(param) {
                vue.hdy.loading = true
                api_hdy_request(param, v => {
                    if(v) vue.hdy.data = v
                    vue.hdy.loading = false
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

	.tag-logo{
		height: 18px;
		margin-bottom: -4px;
		margin-right: 4px;
		border-radius: 4px;
	}

	.unread {
		color: black;
		border-radius: 6px;
		background-color: #e8d6d5;
		position: absolute;
		height: 15px;
		font-size: 10px;
		line-height: initial;
	}
</style>
