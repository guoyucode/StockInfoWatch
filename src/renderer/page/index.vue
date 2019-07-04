<template>
	<div>
		<el-tabs type="border-card" :value="swithTab" @tab-click="tabClick">
			<el-tab-pane name="财联杜电报" label="财联杜电报" style="overflow-y: scroll;" :style="{height: clientHeight + 'px'}">
				<cls ref="cls" :tabClick="tabClick"></cls>
			</el-tab-pane>
			<el-tab-pane name="深交所互动易问答" label="深交所互动易问答" style="overflow-y: scroll;" :style="{height: clientHeight + 'px'}">
				<hdy ref="hdy" :tabClick="tabClick"></hdy>
			</el-tab-pane>
		</el-tabs>
	</div>
</template>


<script>

    import {getStore} from "./js/db";
    import Cls from "./cls";
    import Hdy from "./hdy";

    export default {
        name: 'index',
        components: {Hdy, Cls},
        data() {
            return {
                dbCommonStore: null,
                swithTab: "财联社电报",
                clientHeight: 450,
            }
        },
        watch: {},
        mounted() {
            const self = this;

            //快捷键设置
            this.shortKey()

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


            //切换tab
            swithTabs() {
                const self = this;
                self.dbCommonStore.select("tabName", function (tab) {
                    if (tab) self.swithTab = tab
                    //self.requestByTabName(tab)
                });
            },

            //tab选中
            tabClick(tab) {
                let name = tab.name || tab
                this.dbCommonStore.push("tabName", name);
                this.swithTab = name
                //this.requestByTabName(tab.name)
            },

            //根据tab名字请求数据
            requestByTabName(name) {
                if (!name || name == "财联社电报") this.$refs.cls.requestData()
                else if (name == "深交所互动易问答")  this.$refs.hdy.requestData()
            },
        }
    }
</script>

<style scoped></style>
