<template>
	<div>
		<el-tabs type="border-card" ref="tabs" v-model="swithTab" @tab-click="tabClick" @tab-remove="tabRemove">

			<el-tab-pane v-if="enableTab.cls" name="财联社电报" label="财联社电报" style="overflow-y: scroll;" :style="{height: clientHeight + 'px'}" >
				<cls ref="cls" ></cls>
			</el-tab-pane>

			<el-tab-pane v-if="enableTab.hdy" name="深交所互动易问答" label="深交所互动易问答" style="overflow-y: scroll;" :style="{height: clientHeight + 'px'}" >
				<hdy ref="hdy" ></hdy>
			</el-tab-pane>

			<el-tab-pane v-if="enableTab.dycj" name="第一财经直播区" label="第一财经直播区" style="overflow-y: scroll;" :style="{height: clientHeight + 'px'}" >
				<dycj ref="dycj" ></dycj>
			</el-tab-pane>

			<el-tab-pane v-if="enableTab.xuangubao" name="选股宝" label="选股宝" style="overflow-y: scroll;" :style="{height: clientHeight + 'px'}" >
				<xuangubao ref="xuangubao"  ></xuangubao>
			</el-tab-pane>

			<el-tab-pane v-if="enableTab.yuncaijing" name="云财经" label="云财经" style="overflow-y: scroll;" :style="{height: clientHeight + 'px'}">
				<yuncaijing ref="yuncaijing" ></yuncaijing>
			</el-tab-pane>

			<el-tab-pane :closable="true" v-if="enableTab.setting" name="设置" style="overflow-y: scroll;" :style="{height: clientHeight + 'px'}" :lazy="true">
				<span slot="label"><i class="el-icon-setting"></i> 设置 </span>
				<setting :refs="$refs" ></setting>
			</el-tab-pane>

		</el-tabs>

		<i class="el-icon-setting" v-if="settingClose" @click="enableTab.setting = true; tabClick('设置') " style="position: absolute; float: right;top: 21px;right: 27px; cursor:pointer;"></i>
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

    let vue = null;

    export default {
        name: 'index',
        components: {Setting, Yuncaijing, Xuangubao, Dycj, Hdy, Cls},
        data() {
            return {
                settingClose: true,
                dbStore: null,
                clientHeight: 450,
                enableTab: {},
            }
        },
	    computed: {
            swithTab: {
                get(){return vue.$store.getters.get_tabName},
                set(v){vue.$store.commit("set_tabName", v)},
            },
	    },
        watch: {
            enableTab: {
                deep: true,
                handler: cur => vue.$store.commit("set_enableTab", clone(cur)),
            },
        },
	    created(){
            vue = this;
            vue.$store.dispatch("initTabsData")
            vue.enableTab = clone(vue.$store.getters.get_enableTab)
	    },
        mounted() {
            const self = this;

            initAlert(vue)

            //设置窗口大小
            this.windowsResize()
            window.onresize = this.windowsResize

            refreshAction(vue.refreshAction_request)
            //this.setHotKey(cur)
        },
        methods: {


            //调整窗口大小时触发此方法
            windowsResize() {
                this.clientHeight = document.documentElement.clientHeight - 90
            },

            // 点击tab, 或者点击通知打开tab,那么需要这个tab存在才切换到该tab
            tabClick(tab) {
                console.log("点击tab", tab)
                let name = tab.name || tab
	            if(name == "设置") {
	                this.swithTab = name
		            this.enableTab.setting = true
		            return;
                }
                let childrens = this.$refs.tabs.$children
                for(let k = childrens.length-1; k >= 0; k--){
                    let idStr = childrens[k].$el.id;
                    if(idStr && idStr.indexOf(name) != -1){
                        this.swithTab = name
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
                        this.enableTab.setting = false
						return
                    }
                }
	            alert("全部关闭将不能显示任何数据")
            },

            refreshAction_request(){
                let name = vue.swithTab;
                if(name == "财联社电报") this.$refs.cls.requestData("refresh")
                else if(name == "深交所互动易问答") this.$refs.hdy.requestData("refresh")
                else if(name == "第一财经直播区") this.$refs.dycj.requestData("refresh")
                else if(name == "选股宝") this.$refs.xuangubao.requestData("refresh")
                else if(name == "云财经") this.$refs.yuncaijing.requestData("refresh")
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
