<template>
	<div>
		<el-tabs type="border-card" ref="tabs" v-model="configData.common.tabName" @tab-click="tabClick" @tab-remove="tabRemove">

			<el-tab-pane v-if="configData.cls.enable" name="财联社电报" label="财联社电报" style="overflow-y: scroll;" :style="{height: clientHeight + 'px'}" >
				<cls ref="cls" ></cls>
			</el-tab-pane>

			<el-tab-pane v-if="configData.hdy.enable" name="深交所互动易问答" label="深交所互动易问答" style="overflow-y: scroll;" :style="{height: clientHeight + 'px'}" >
				<hdy ref="hdy" ></hdy>
			</el-tab-pane>

			<el-tab-pane v-if="configData.dycj.enable" name="第一财经直播区" label="第一财经直播区" style="overflow-y: scroll;" :style="{height: clientHeight + 'px'}" >
				<dycj ref="dycj" ></dycj>
			</el-tab-pane>

			<el-tab-pane v-if="configData.xuangubao.enable" name="选股宝" label="选股宝" style="overflow-y: scroll;" :style="{height: clientHeight + 'px'}" >
				<xuangubao ref="xuangubao"  ></xuangubao>
			</el-tab-pane>

			<el-tab-pane v-if="configData.yuncaijing.enable" name="云财经" label="云财经" style="overflow-y: scroll;" :style="{height: clientHeight + 'px'}">
				<yuncaijing ref="yuncaijing" ></yuncaijing>
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

    import {getDBStore} from "./js/db";
    import Cls from "./cls";
    import Hdy from "./hdy";
    import Dycj from "./dycj";
    import Xuangubao from "./xuangubao";
    import Yuncaijing from "./yuncaijing";
    import Setting from "./setting";
    import {clone, config} from "./js/utils";
    import {mapMutations, mapGetters, mapState} from "vuex"
    import {initAlert, readData, refreshAction} from "./js/project";
    import store from "../store"
    import configData from "./js/config_data"

    let vue = null;

    export default {
        name: 'index',
        components: {Setting, Yuncaijing, Xuangubao, Dycj, Hdy, Cls},
        data() {
            return {
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

            refreshAction(function () {
                let name = vue.configData.common.tabName;

                //发布刷新事件
	            vue.$eventBus.$emit(name + "-refresh")
            })
        },
        methods: {


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
</style>
