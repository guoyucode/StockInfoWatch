<template>

	<div v-loading.lock.fullscreen="viewData.loading">
		<KeywordSubscription title="关键词订阅: " lable-color="red" :keywords="keywordData.data" v-if="keywordData.enable"></KeywordSubscription>
		<KeywordSubscription title="数据过滤: " lable-color="darkmagenta" :keywords="filterData.data" v-if="filterData.enable"></KeywordSubscription>

		<el-card class="box-card" @click.native="cardClick(item)" v-for="item in data2" :key="item.id" :item="item" v-view-lazy="()=>lazyView(item)">
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

			</div>
			<div class="text item content-css"  style="font-size: 17px !important;" v-html="item.content_color">
				列表内容
			</div>
			<br v-if="item.content2"/>
			<div class="text item" style="color: #686868;" v-if="item.content2" v-html="item.content2_color">
				列表内容
			</div>
		</el-card>

		<template v-if="!viewData.loading">
			<el-card class="box-card" v-if="viewData.data.length == 0" key="99999998" style="cursor:pointer;" @click.native="nextPage()">
				<div class="text item">
					<span style="margin-left: 40%;">网络异常, 点击刷新重试</span>
				</div>
			</el-card>

			<el-card class="box-card" v-else key="99999999" style="cursor:pointer;" @click.native="nextPage('next')">
				<div class="text item">
					<span style="margin-left: 40%;">点击加载更多</span>
				</div>
			</el-card>
		</template>

	</div>

</template>

<script>

    import configData from "../assets/data_handler/config_data"
    import KeywordSubscription from "./keyword_subscription";
    import keywordData from "../assets/data_handler/keyword_subscription_data"
    import filterData from "../assets/data_handler/filter_data"
    import {isExistingFilterData} from "../assets/js/project"
    import {init_news_data, viewData} from "../assets/data_handler/view_data"

    //import {delayer} from "./js/utils";

    let vue = null;

    export default {
        name: "news_view",
        components: {KeywordSubscription},
        props: {
            tabName: {
                type: String,
                default: "财联社电报",
            },
            loading: Boolean,
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
            },
        },
        data() {
            return {
                viewData: viewData,
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
            //this.nextPage()

            $EventBus.$on("refresh-news-complete", function (isSucces, data) {
                setTimeout(function () {
                    vue.viewData.loading = false;
                }, 600)
            })

            $EventBus.$on("refresh", () => {
                if (configData.common.tabName == "财经新闻")
                    vue.viewData.loading = true;
            })

	        //初始化数据
	        init_news_data();

            //设置窗口大小
            this.windowsResize()
            window.onresize = this.windowsResize

	        //加载所有接口文件中的 init-api 方法
	        require('../assets/api/init-news-api')

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

                    //显示关键字
                    this.fomatKeyword(item);

                    return item
                })
            },

        },
        methods: {

            requestCallback(v){
                this.viewData.loading = false
            },

            nextPage(){
                this.viewData.loading = true;
                $EventBus.$emit("news-next");
            },

            openWindow: window.open,

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
                    let clorA = `<a style='color: darkmagenta; font-weight: bold;''>${keyword}</a>`
                    rv = rv.replace(new RegExp(keyword, 'g'), clorA)
                }
                return rv;
            },

	        //懒加载技术实现看到new字后,已读功能
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

            cardClick(item){

                //淘股吧祥情页
                let topicID = item.topicID;
                if(topicID != undefined){
                    if(topicID){
                        window.open(`https://www.taoguba.com.cn/Article/${topicID}/1?sy_txyz`, "_blank")
                    }else{
                        alert("不是一个贴子")
                    }
                }
            },
        }
    }
</script>

<style scoped>
</style>
