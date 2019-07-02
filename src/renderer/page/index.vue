<template>
	<div>

		<el-tabs type="border-card">

			<el-tab-pane v-loading="loading" label="财联社电报" style="overflow-y: scroll;" :style="{height: clientHeight + 'px'}">
				<el-card class="box-card" v-for="item in data" :key="item.id">
					<div slot="header" class="clearfix">
						<span v-text="formatTime(item.ctime)">发布时间</span>
						<span style="float: right; padding: 3px 0" v-text="'阅读量: ' + item.reading_num"></span>
					</div>
					<div class="text item" v-text="item.brief">
						列表内容
					</div>
				</el-card>
			</el-tab-pane>


			<el-tab-pane label="互动易" style="overflow-y: scroll;" :style="{height: clientHeight + 'px'}">
				<el-card class="box-card" v-for="item in data2" :key="item.indexId" >
					<div slot="header" class="clearfix">
						<span v-text="item.mainContent">问题...</span>
						<span style="float: right; padding: 3px 0" v-text="'阅读量: ' + item.reading_num"></span>
					</div>
					<div class="text item el-card__body2" v-if="item.attachedContent" v-text="item.attachedContent">
						回答内容...
					</div>
					<div class="text item el-card__body2"  v-else >
						暂无回答
					</div>
				</el-card>
			</el-tab-pane>

		</el-tabs>


	</div>
</template>


<script>

    import {caiLianSheRequest} from './js/api'
    import {DateFormat} from "./js/utils";
    import {interactiveRequest} from "./js/api-2";

    export default {
        name: 'index',
        data() {
            return {
                clientHeight: 450,
                data: null,
	            data2: null,
	            loading: true,
                loading2: true,
            }
        },
        mounted() {
            this.shortKey()

            this.requestData()
	        this.requestData2()

            this.windowsResize()
	        window.onresize = this.windowsResize
        },
        methods: {
            requestData() {
                const self = this
                self.loading = true
                caiLianSheRequest().then(function (res) {
                    self.data = res.roll_data
                    self.loading = false
                })
            },
	        formatTime (time) {
                let date = new Date(time * 1000)
                return DateFormat(date)
	        },
	        windowsResize(){
                this.clientHeight = document.documentElement.clientHeight - 90
	        },

            requestData2() {
                const self = this
                self.loading2 = true
                interactiveRequest().then(function (res) {
                    console.log("data2-res", res)
                    self.data2 = res.results;
                    self.loading2 = false
                })
            },

	        shortKey() {
                const self = this;
                const globalShortcut = require('electron').remote.globalShortcut
                globalShortcut.register('F5', () => {
                    self.requestData()
                })
            }
        }
    }
</script>

<style scoped>
	.box-card{
		margin-bottom: 18px;
	}
	.el-card__body2 {
		padding: 13px !important;
	}
</style>
