<template>
	<div>
		<el-row>
			<el-col :span="cardWidth" :key="0" :offset="cardOffset">
				<el-card class="box-card" >
					<div slot="header" class="clearfix">
						<span>公共配置</span>
					</div>
					<div class="text item" >
						刷新快捷键设置
					</div>
					<div class="text item" style="" >

					</div>
				</el-card>
			</el-col>
			<el-col :span="cardWidth" :key="1" :offset="cardOffset">
				<el-card class="box-card" >
					<div slot="header" class="clearfix">
						<span>
							财联社电报&nbsp;&nbsp;
							<el-switch v-model="enableTab.cls" :active-value="true" :inactive-value="false" active-color="#13ce66" inactive-color="#ff4949">
							</el-switch>
						</span>
					</div>
					<diV v-if="enableTab.cls">
						<div class="text item" >
							<el-row>
								<label>定时刷新频率</label>
								<el-input style="float: right; width: 66%;"  size="mini" v-model="refs.cls.setInterval_time" placeholder="请输入内容"></el-input>
							</el-row>
						</div>
						<br/>
						<div class="text item">
							<el-row>
								<label>通知开关</label>
								<el-switch style="margin-left: 45px;" v-model="refs.cls.enableNotice" :active-value="true" :inactive-value="false" > </el-switch>
							</el-row>
						</div>
					</diV>
				</el-card>
			</el-col>
		</el-row>

		<el-row>
			<el-col :span="cardWidth" :key="2" :offset="cardOffset">
				<el-card class="box-card" >
					<div slot="header" class="clearfix">
						<span>互动易问答&nbsp;&nbsp;
							<el-switch
									v-model="enableTab.hdy"
									:active-value="true"
									:inactive-value="false"
									active-color="#13ce66"
									inactive-color="#ff4949">
							</el-switch>
						</span>
					</div>
					<div class="text item" >
						列表内容
					</div>
					<div class="text item" style="" >
						新闻描述
					</div>
				</el-card>
			</el-col>
			<el-col :span="cardWidth" :key="3" :offset="cardOffset">
				<el-card class="box-card" >
					<div slot="header" class="clearfix">
						<span>第一财经&nbsp;&nbsp;
							<el-switch
									v-model="enableTab.dycj"
									:active-value="true"
									:inactive-value="false"
									active-color="#13ce66"
									inactive-color="#ff4949">
							</el-switch>
						</span>
					</div>
					<div class="text item" >
						列表内容
					</div>
					<div class="text item" style="" >
						新闻描述
					</div>
				</el-card>
			</el-col>
		</el-row>

		<el-row>
			<el-col :span="cardWidth" :key="4" :offset="cardOffset">
				<el-card class="box-card" >
					<div slot="header" class="clearfix">
						<span>选股宝&nbsp;&nbsp;
							<el-switch
									v-model="enableTab.xuangubao"
									:active-value="true"
									:inactive-value="false"
									active-color="#13ce66"
									inactive-color="#ff4949">
							</el-switch>
						</span>
					</div>
					<div class="text item" >
						列表内容
					</div>
					<div class="text item" style="" >
						新闻描述
					</div>
				</el-card>
			</el-col>
			<el-col :span="cardWidth" :key="5" :offset="cardOffset">
				<el-card class="box-card" >
					<div slot="header" class="clearfix">
						<span>云财经&nbsp;&nbsp;
							<el-switch
									v-model="enableTab.yuncaijing"
									:active-value="true"
									:inactive-value="false"
									active-color="#13ce66"
									inactive-color="#ff4949">
							</el-switch>
						</span>
					</div>
					<div class="text item" >
						列表内容
					</div>
					<div class="text item" style="" >
						新闻描述
					</div>
				</el-card>
			</el-col>
		</el-row>

	</div>
</template>

<script>
    export default {
        name: "setting",
	    data(){
            return {
                cardWidth: 10,
                cardOffset: 1,
            }
	    },
	    props: {
            refs: Object,
            enableTab: Object, // {cls: true, dycj: true, ...}
	    },
	    mounted() {
            //console.log("设置页-refs", this.refs)
        }
    }
</script>

<style scoped>

</style>
