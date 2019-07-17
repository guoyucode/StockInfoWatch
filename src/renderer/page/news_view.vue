<template>

	<div>
		<KeywordSubscription title="关键词订阅: " lable-color="red" :keywords="keywordData.data" v-if="keywordData.enable"></KeywordSubscription>
		<KeywordSubscription title="数据过滤: " lable-color="darkmagenta" :keywords="filterData.data" v-if="filterData.enable"></KeywordSubscription>

		<el-card class="box-card" v-for="item in data2" :key="item.id" :item="item" v-view-lazy="()=>lazyView(item)">
			<div slot="header" class="clearfix">
				<span v-html="'发布时间: ' + item.time"></span>

				<span @click="item.readed=true" v-show="!item.readed"
				      style="float: right; padding: 3px 0; color: darkgreen; background-color: darkgrey; border-radius: 6px; cursor:pointer;">
					<a >&nbsp;NEW&nbsp;</a>
				</span>

				<!--深交所问答易-->
				<span v-if="item.companyShortName" style="padding-left: 15px;"
				      v-html="'公司: ' + item.companyShortName + ' [' + item.stockCode + ']'"></span>
				<span v-if="item.authorName" style="padding-left: 15px;">发布人: {{item.authorName}}</span>

			</div>
			<div class="text item" v-html="item.content">
				列表内容
			</div>
			<br v-if="item.content2"/>
			<div class="text item" v-if="item.content2" v-html="item.content2">
				列表内容
			</div>
		</el-card>

		<template v-if="!loading">
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

    import configData from "./data_handler/config_data"
    import KeywordSubscription from "./keyword_subscription";
    import keywordData from "./data_handler/keyword_subscription_data"
    import filterData from "./data_handler/filter_data"
    import {isExistingFilterData, isExistingKeyword} from "./js/project"
    //import {delayer} from "./js/utils";


    let vue = null;

    export default {
        name: "news_view",
        components: {KeywordSubscription},
        props: {
            viewData: {
                type: Object,
                default: {
                    data: [],
                    loading: false,
                    unReadNum: 0,
                }
            },
            tabName: {
                type: String,
                default: "财联社电报",
            },
            nextPage: Function,
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
                console.log("viewData.unReadNum ==-1", this.viewData.data)
                for(let item of this.viewData.data){
                    item.readed = true;
                }
            }
        },
        data() {
            return {
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
            this.nextPage()

            //设置窗口大小
            this.windowsResize()
            window.onresize = this.windowsResize

        },
	    updated(){
            //vue.delayer(vue.setUnReadNum)
	    },
        computed: {

            data2() {
                return this.viewData.data.filter(item => {
                    //显示关键字
                    isExistingKeyword(item, true)

                    //过滤数据
                    let isAt2 = isExistingFilterData(item, true);
                    if (!isAt2) return null;

                    return item
                })
            },

            setUnReadNum(){
                let unRead = 0;
                for(let item of this.data2){
                    if(item.readed == undefined || item.readed == false) unRead++
                }
                this.viewData.unReadNum = unRead
            },

        },
        methods: {



            lazyView(item) {
                if(this.viewData.unReadNum < 1) return;
                setTimeout(() => {
                    item.readed = true
                    this.viewData.unReadNum--
                }, 1000)
            },

            delayer(action, delay = 1500) {
                let timer = -1;
                return () => {
                    clearTimeout(timer);
                    timer = setTimeout(() => {
                        action();
                    }, delay);
                };
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
