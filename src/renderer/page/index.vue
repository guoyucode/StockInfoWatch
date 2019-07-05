<template>
	<div>
		<el-tabs type="border-card" ref="tabs" v-model="swithTab" @tab-click="tabClick" @tab-remove="tabRemove">

			<el-tab-pane v-if="enableTab.cls" name="财联社电报" label="财联社电报" style="overflow-y: scroll;" :style="{height: clientHeight + 'px'}" >
				<cls ref="cls" :tabClick="tabClick"></cls>
			</el-tab-pane>

			<el-tab-pane v-if="enableTab.hdy" name="深交所互动易问答" label="深交所互动易问答" style="overflow-y: scroll;" :style="{height: clientHeight + 'px'}" >
				<hdy ref="hdy" :tabClick="tabClick"></hdy>
			</el-tab-pane>

			<el-tab-pane v-if="enableTab.dycj" name="第一财经直播区" label="第一财经直播区" style="overflow-y: scroll;" :style="{height: clientHeight + 'px'}" >
				<dycj ref="dycj" :tabClick="tabClick"></dycj>
			</el-tab-pane>

			<el-tab-pane v-if="enableTab.xuangubao" name="选股宝" label="选股宝" style="overflow-y: scroll;" :style="{height: clientHeight + 'px'}" >
				<xuangubao ref="xuangubao"  :tabClick="tabClick"></xuangubao>
			</el-tab-pane>

			<el-tab-pane v-if="enableTab.yuncaijing" name="云财经" label="云财经" style="overflow-y: scroll;" :style="{height: clientHeight + 'px'}">
				<yuncaijing ref="yuncaijing" :tabClick="tabClick"></yuncaijing>
			</el-tab-pane>

			<el-tab-pane :closable="true" v-if="!settingClose" name="设置" style="overflow-y: scroll;" :style="{height: clientHeight + 'px'}" :lazy="true">
				<span slot="label"><i class="el-icon-setting"></i> 设置 </span>
				<setting ref="yuncaijing" :refs="$refs" :enable-tab="enableTab"></setting>
			</el-tab-pane>

		</el-tabs>

		<i class="el-icon-setting" v-if="settingClose" @click="settingClose = false; tabClick('设置') " style="position: absolute; float: right;top: 21px;right: 27px; cursor:pointer;"></i>
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
    import {clone} from "./js/utils";

    const enableTab_bak = {
        cls: true,
        hdy: true,
        dycj: true,
        xuangubao: true,
        yuncaijing: true,
    }

    export default {
        name: 'index',
        components: {Setting, Yuncaijing, Xuangubao, Dycj, Hdy, Cls},
        data() {
            return {
                settingClose: true,
                dbStore: null,
                swithTab: "财联社电报",
                clientHeight: 450,
                enableTab: {
                    cls: false,
                    hdy: false,
                    dycj: false,
                    xuangubao: false,
                    yuncaijing: false,
                },
            }
        },
        watch: {
            enableTab: {
                handler: function(cur) {
                    this.dbStore.push("enableTab", cur)
                },
                deep: true
            },
            swithTab: function (cur) {
                if(cur != "设置") this.dbStore.push("tabName", cur)
                if(cur == "设置") this.settingClose = false
            }
        },
        mounted() {
            const self = this;

            //快捷键设置
            this.shortKey()

            //设置窗口大小
            this.windowsResize()
            window.onresize = this.windowsResize

            //获得数据库
            getDBStore(function (dbStore) {
                self.dbStore = dbStore
                self.readDbAfterinit(dbStore)
            })
        },
        methods: {

            readDbAfterinit(dbStore){
                const self = this;

                dbStore.select("enableTab", function (enableTab) {
                    if(enableTab) self.enableTab = enableTab
	                else self.enableTab = clone(enableTab_bak)

                    dbStore.select("tabName", function (tab) {
                        if(tab) self.tabClick(tab)
                    })
                })
            },

            //调整窗口大小时触发此方法
            windowsResize() {
                this.clientHeight = document.documentElement.clientHeight - 90
            },

            //设置刷新快捷键
            shortKey() {
                const self = this;
                const globalShortcut = require('electron').remote.globalShortcut
                globalShortcut.register('F5', () => {
                    self.requestByTabName(self.swithTab)
                })
            },

            // 点击tab, 或者点击通知打开tab,那么需要这个tab存在才切换到该tab
            tabClick(tab) {
                let name = tab.name || tab
	            if(name == "设置") this.swithTab = name
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
                        this.settingClose = true
						return
                    }
                }
	            alert("全部关闭将不能显示任何数据")
            },

            //根据tab名字请求数据
            requestByTabName(name) {
                const arg = "refresh"
                if (!name || name == "财联社电报") this.$refs.cls.requestData(arg)
                else if (name == "深交所互动易问答")  this.$refs.hdy.requestData(arg)
                else if (name == "第一财经直播区")  this.$refs.dycj.requestData(arg)
                else if (name == "选股宝")  this.$refs.xuangubao.requestData(arg)
                else if (name == "云财经")  this.$refs.yuncaijing.requestData(arg)
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
