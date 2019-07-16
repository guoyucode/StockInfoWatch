<template>
	<div>

		<KeywordSubscription title="关键词订阅: " lable-color="red" :keywords="keywordData.data" v-if="keywordData.enable"></KeywordSubscription>
		<KeywordSubscription title="数据过滤: " lable-color="darkmagenta" :keywords="filterData.data" v-if="filterData.enable"></KeywordSubscription>

		<el-card class="box-card" v-for="item in data2" :key="item.id" :item="item" v-view-lazy="()=>lazyView(item)" >
			<div slot="header" class="clearfix">
				<span v-html="'发布时间: ' + item.time"></span>

				<span v-show="!item.readed" style="float: right; padding: 3px 0; color: darkgreen;" >NEW</span>

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
			<el-card class="box-card" v-if="data.length == 0" key="99999998" style="cursor:pointer;" @click.native="nextPage()">
				<div class="text item" >
					<span style="margin-left: 40%;">网络异常, 点击刷新重试</span>
				</div>
			</el-card>

			<el-card class="box-card" v-else key="99999999" style="cursor:pointer;" @click.native="nextPage('next')">
				<div class="text item" >
					<span style="margin-left: 40%;">点击加载更多</span>
				</div>
			</el-card>
		</template>


	</div>
</template>

<script>

    import KeywordSubscription from "./keyword_subscription";
    import keywordData from "./js/keyword_subscription_data"
    import filterData from "./js/filter_data"
    import {isExistingFilterData, isExistingKeyword} from "./js/project"
    import {clone} from "./js/utils";
    let vue = null;

    export default {
        name: "news_view",
        components: {KeywordSubscription},
        props: {
            data: Array,
            nextPage: Function,
	        loading: Boolean,
	    },
	    data(){
          return {
              keywordData: keywordData,
              filterData: filterData,
          }
	    },
	    created(){
          vue = this;
	    },
	    mounted(){
            this.nextPage()
	    },
	    computed: {
            data2(){

                return this.data.filter(item => {
                    //显示关键字
                    isExistingKeyword(item, true)

                    //过滤数据
                    let isAt2 = isExistingFilterData(item, true);
                    if(!isAt2) return null;

                    return item
                })
            }
	    },
	    methods: {
            lazyView(item){
                setTimeout(()=>item.readed = true, 1000)
            }
	    }
    }
</script>

<style scoped>

</style>
