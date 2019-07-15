<template>
	<div>
		<KeywordSubscription v-if="keywordData.enable"></KeywordSubscription>
		<el-card class="box-card" v-for="item in data2" :key="item.id">
			<div slot="header" class="clearfix">
				<span v-html="'发布时间: ' + item.time"></span>
				<!--<span style="float: right; padding: 3px 0" v-text="'阅读量: ' + item.reading_num"></span>-->

				<!--深交所问答易-->
				<span v-if="item.companyShortName" style="padding-left: 15px;">公司: {{item.companyShortName}} [{{item.stockCode}}]</span>
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
          }
	    },
	    mounted(){
            this.nextPage()
	    },
	    computed: {
            data2(){

                if(!this.keywordData.enable) return this.data;
                let keywordList = this.keywordData.data;
                for(let keyword of keywordList){
                    for(let item of this.data){
                        if(item["handler_keyword_" + keyword]) continue
                        let clorA = `<a style='color: red'> [ ${keyword} ] </a>`
                        item.content = item.content.replace(new RegExp(keyword,'g'), clorA)
	                    if(item.content2) item.content2 = item.content2.replace(new RegExp(keyword,'g'), clorA)
                        item["handler_keyword_" + keyword] = true
                    }
                }

                return this.data
            }
	    }
    }
</script>

<style scoped>

</style>
