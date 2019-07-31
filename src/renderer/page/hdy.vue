<template>

	<div v-loading.lock.fullscreen="viewData.loading" >
		<KeywordSubscription title="关键词订阅: " lable-color="red" :keywords="keywordData.data" v-if="keywordData.enable"></KeywordSubscription>
		<KeywordSubscription title="数据过滤: " lable-color="darkmagenta" :keywords="filterData.data" v-if="filterData.enable"></KeywordSubscription>

		<el-card class="box-card" v-for="item in data2" :key="item.id" :item="item" v-view-lazy="()=>lazyView(item)">
			<div slot="header" class="clearfix" style="position: relative;">
				<span v-html="'发布时间: ' + item.time"></span>

				<span v-if="item.src.str" @click="openWindow(item.src.url)"
				      style="float: right; color: #6d6d6d; cursor:pointer;">
					<a><img style="margin-bottom: -3px; height: 18px; border-radius: 4px;" :src="item.src.ico"> {{item.src.str}}</a>
				</span>

				<span @click="item.readed=true" v-show="!item.readed"
				      style="float: right; padding: 0px 0;
				      color: darkgreen; background-color: darkgrey;
				      border-radius: 6px; cursor:pointer;
				      position: absolute; right: -17px; margin-top: -17px; font-size: 12px;">
					<a >&nbsp;新&nbsp;</a>
				</span>

				<!--深交所问答易-->
				<span v-if="item.companyShortName" style="padding-left: 15px;"
				      v-html="'公司: ' + item.companyShortName_color + (item.stockCode ? ' (' + item.stockCode + ')' : '')"></span>
				<span v-if="item.authorName" style="padding-left: 15px;" v-html="'发布人: ' + item.authorName_color" ></span>

			</div>
			<div class="text item">
				<a style="color: #0077E6;">问 </a>
				<span v-html="item.content_color"></span>
			</div>
			<br v-if="item.content2"/>
			<div class="text item" v-if="item.content2" >
				<div class="text item" >
					<a style="color: orange;">答 </a>
					<span v-html="item.content2_color"></span>
				</div>
			</div>
		</el-card>

		<template v-if="!viewData.loading">
			<el-card class="box-card" v-if="viewData.data.length == 0" key="99999998" style="cursor:pointer;" @click.native="nextPage('refresh')">
				<div class="text item">
					<span style="margin-left: 40%;">网络异常, 点击刷新重试</span>
				</div>
			</el-card>

			<el-card class="box-card" v-else key="99999999" style="cursor:pointer;" @click.native="nextPage('hdy-next')">
				<div class="text item">
					<span style="margin-left: 40%;">点击加载更多</span>
				</div>
			</el-card>
		</template>

	</div>

</template>

<script>

    import configData from "./data_handler/config_data"
    import KeywordSubscription from "./keyword_subscription";
    import keywordData from "./data_handler/keyword_subscription_data"
    import filterData from "./data_handler/filter_data"
    import {isExistingFilterData, isExistingKeyword} from "./js/project"
    import {init_hdy_data, viewDataHdy} from "./data_handler/view_data_hdy";
    import {api_hdy_request, init_hdy_api} from "./api/hdy";
    import {api_ehd_request, init_ehd_api} from "./api/ehd";

    //import {delayer} from "./js/utils";

    let vue = null;

    export default {
        name: "hdy",
        components: {KeywordSubscription},
        props: {
            tabName: {
                type: String,
                default: "财联社电报",
            },
        },
        watch: {
            data2: function(cur){
                let num = 0
                for(let item of cur){
                    if(!item.readed) num ++
                }
                this.viewData.unReadNum = num;
            },
	        "viewData.unReadNum": function(cur){
                if(cur != -1) return;
                this.viewData.unReadNum = 0;
                for(let item of this.viewData.data){
                    item.readed = true;
                }
            }
        },
        data() {
            return {
                viewData: viewDataHdy,
                configData: configData,
                keywordData: keywordData,
                filterData: filterData,
                clientHeight: 450,
            }
        },
        created() {
            vue = this;
        },
        mounted() {

            $EventBus.$on("refresh", () => {
                if (configData.common.tabName == "互动问答") vue.viewData.loading = true;
            })

            $EventBus.$on("refresh-hdy-complete", function (isSuccess, data) {
                setTimeout(function () {
                    vue.viewData.loading = false;
                }, 600)
            })

            //设置窗口大小
            this.windowsResize()
            window.onresize = this.windowsResize

	        //数据初始化
            init_hdy_data();

            //深交所问答请求初始化
	        init_hdy_api();

	        //上证问答请求初始化
	        init_ehd_api();

        },
	    updated(){
            //vue.delayer(vue.setUnReadNum)
	    },
        computed: {

            data2() {
                return this.viewData.data.filter(item => {

                    //过滤数据
                    let isAt2 = isExistingFilterData(item);
                    if (!isAt2) return null;

                    this.fomatKeyword(item);

                    return item
                })
            },

        },
        methods: {

            openWindow: window.open,

	        //传参: refresh || hdy-next
            nextPage(next){
                vue.viewData.loading = true;
                $EventBus.$emit(next);
            },

            requestCallback(v){
                this.viewData.loading = false
            },

            fomatKeyword(item){
                if(item.companyShortName) item.companyShortName_color = this.formatterKeyword(item, item.companyShortName);
                if(item.content) item.content_color = this.formatterKeyword(item, item.content);
                if(item.content2) item.content2_color = this.formatterKeyword(item, item.content2);
                if(item.authorName) item.authorName_color = this.formatterKeyword(item, item.authorName);
                if(item.companyShortName) item.companyShortName_color = this.formatterKeyword(item, item.companyShortName);
                //if(item.companyShortName) item.item.companyShortName_color = this.formatterKeyword(item, item.companyShortName);
             },

            //显示订阅关键词
            formatterKeyword(item, text){
                if(!this.keywordData.enable || this.keywordData.data.length == 0 || !text) {
                    return this.formatterFilterData(item, text);
                }
                let rv = text + "";
                for (let keyword of this.keywordData.data) {
                    let clorA = `<a style='color: red; font-weight: bold;'>${keyword}</a>`
                    rv = rv.replace(new RegExp(keyword, 'g'), clorA)
                }
                return this.formatterFilterData(item, rv);
            },

	        //显示过滤关键词
            formatterFilterData(item, text){
                if(!this.filterData.enable || !this.filterData.data || this.filterData.data.length == 0 || !text) return text;
                let rv = text + "";
                for (let keyword of this.filterData.data) {
                    let clorA = `<a style='color: darkmagenta; font-weight: bold;'>${keyword}</a>`
                    rv = rv.replace(new RegExp(keyword, 'g'), clorA)
                }
                return rv;
            },

            lazyView(item) {
                if(this.viewData.unReadNum < 1) return;
                setTimeout(() => {
                    item.readed = true
                    this.viewData.unReadNum--
                }, 1200)
            },

            //调整窗口大小时触发此方法
            windowsResize() {
                this.clientHeight = document.documentElement.clientHeight - 90
            },

        }
    }
</script>

<style scoped>

</style>
