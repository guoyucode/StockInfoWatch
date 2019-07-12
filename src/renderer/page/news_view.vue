<template>
	<div >
		<KeywordSubscription></KeywordSubscription>
		<el-card class="box-card" v-for="item in data2" :key="item.id">
			<div slot="header" class="clearfix">
				<span v-html="'发布时间: ' + item.time"></span>
				<!--<span style="float: right; padding: 3px 0" v-text="'阅读量: ' + item.reading_num"></span>-->
			</div>
			<div class="text item" v-html="item.content">
				列表内容
			</div>
			<br v-if="item.content2"/>
			<div class="text item" v-if="item.content2" v-html="item.content2">
				列表内容
			</div>
		</el-card>
		<el-card class="box-card" key="99999999" style="cursor:pointer;" @click.native="nextPage('next')">
			<div class="text item" >
				<span style="margin-left: 40%;">点击加载更多</span>
			</div>
		</el-card>
	</div>
</template>

<script>
    import KeywordSubscription from "./keyword_subscription";
    export default {
        name: "news_view",
        components: {KeywordSubscription},
        props: {
            data: Array,
            nextPage: Function,
	    },
	    computed: {
            data2(){
                return this.data
            }
	    }
    }
</script>

<style scoped>

</style>
