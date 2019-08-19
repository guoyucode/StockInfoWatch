<template>
	<div>
		<!--<el-dialog title="收货地址" :visible.sync="true">-->


		<el-row>
			<el-col :span="cardWidth" :key="-1" :offset="cardOffset">
				<el-collapse class="version">
					<el-collapse-item name="1"><!--style="max-height: 260px; overflow-y: auto;"-->
						<template slot="title">
							版本信息: {{version}}
						</template>

						<div style="color: green">当前更新:</div>
						<div>新功能: 托盘处添加检查更新功能</div>
						<br/>

						<div style="color: blue">近期更新:</div>
						<div>功能优化: 财经新闻合并,问答类资讯合并</div>
						<div>新增功能: 问答类新增上证E互动</div>
						<div>问题修复: 订阅显示修复,数据过滤如果没有一个关键词那么就不过滤</div>
						<div>新增功能: 标示已读未读功能</div>
						<div>新增功能: 订阅功能,数据筛选</div>
						<div>功能优化: 自已实现全局变量做状态管理,性能提升</div>
						<div>修复bug: 互动易不能保存通知开关的问题</div>
						<div>修复bug: 财联社电报通知开关保存后依然无效的问题</div>
						<div>新增功能: 完成快捷键设置, 数据条数等各种开关设置功能</div>
						<div>新增功能: 财联社电报,深交所互动易问答 数据展示,及定时器定时拉取新数据</div>

						<br/>
						<div style="color: darkviolet">程序说明:</div>
						<div>实时查看股票行情数据</div>
						<div>1: 行情数据展示: 财联社电报,互动易,第一财经,选股宝,云财经</div>
						<div>2: 订阅功能,数据筛选功能说明: 只有新的新闻中有订阅的关键词(如果启动),和数据筛选匹配(启用)才推送消息</div>
						<div>3: 按设置的时间定时拉取新数据</div>
						<div>4: 已读未读匹配消息标示,定时抓取和刷新到的数据,和数据筛选匹配(启用)中的数据才标示(启动时不标示)</div>
						<div>5: 设置各种参数配置: 显示数据开关,通知开关,数据显示数据限制,定时刷新时间设置,快捷键设置</div>
						<div>6: 自动升级功能</div>
						<div>程序设置理念：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
						<div></div>

					</el-collapse-item>
				</el-collapse>
			</el-col>
		</el-row>

		<el-row>
			<el-col :span="cardWidth" :key="0" :offset="cardOffset">
				<el-card class="box-card">
					<div slot="header" class="clearfix">
						<span>公共配置</span>
					</div>

					<diV>
						<div class="text item">
							<el-row>
								<label>刷新快捷键</label>
								<el-select class="setting-input" v-model="common.hotKey" placeholder="快捷键选择">
									<el-option
											v-for="item in ['无', 'F1', 'F2', 'F3', 'F4', 'F5','F6','F7','F8','F9','F10','F11','F12']"
											:key="item"
											:label="item"
											:value="item">
									</el-option>
								</el-select>
								<!--<el-input style="float: right; width: 66%;" size="mini"  placeholder="功能暂时没有实现"></el-input>-->
							</el-row>
						</div>
						<br/>
						<div class="text item">
							<el-row>
								<label>数据显示条数</label>
								<el-input class="setting-input" v-model.number.lazy="common.dataLimit" placeholder="请输入一个数字"></el-input>
							</el-row>
						</div>
						<br/>
						<div class="text item">
							<el-row>
								<label>订阅</label>
								<el-switch class="setting-switch" v-model="keywordData.enable" :active-value="true" :inactive-value="false"></el-switch>
							</el-row>
						</div>
						<br/>
						<div class="text item">
							<el-row>
								<label>数据过滤</label>
								<el-switch class="setting-switch" v-model="filterData.enable" :active-value="true" :inactive-value="false"></el-switch>
							</el-row>
						</div>
					</diV>
				</el-card>
			</el-col>
		</el-row>

		<el-row>
			<el-col :span="cardWidth" :key="1" :offset="cardOffset">
				<el-card class="box-card">
					<div slot="header" class="clearfix">
						<span>
							财联社电报&nbsp;&nbsp;
							<el-switch class="setting-switch" v-model="cls.enable" :active-value="true" :inactive-value="false" active-color="#13ce66">
							</el-switch>
						</span>
					</div>
					<diV>
						<div class="text item">
							<el-row>
								<label>定时刷新频率(秒)</label>
								<el-input class="setting-input" :disabled="!cls.enable" v-model.number.lazy="cls.setInterval_time" placeholder="请输入内容"></el-input>
							</el-row>
						</div>
						<br/>
						<div class="text item">
							<el-row>
								<label>通知开关</label>
								<el-switch class="setting-switch" style="margin-left: 16%;" :disabled="!cls.enable" v-model="cls.enableNotice" :active-value="true" :inactive-value="false"></el-switch>
							</el-row>
						</div>
					</diV>
				</el-card>
			</el-col>
		</el-row>

		<el-row>
			<el-col :span="cardWidth" :key="3" :offset="cardOffset">
				<el-card class="box-card">
					<div slot="header" class="clearfix">
						<span>第一财经&nbsp;&nbsp;
							<el-switch
									class="setting-switch"
									v-model="dycj.enable"
									:active-value="true"
									:inactive-value="false"
									active-color="#13ce66"
							>
							</el-switch>
						</span>
					</div>
					<diV>
						<div class="text item">
							<el-row>
								<label>定时刷新频率(秒)</label>
								<el-input class="setting-input" :disabled="!dycj.enable" size="mini" v-model.number.lazy="dycj.setInterval_time" placeholder="请输入内容"></el-input>
							</el-row>
						</div>
						<br/>
						<div class="text item">
							<el-row>
								<label>通知开关</label>
								<el-switch class="setting-switch" :disabled="!dycj.enable" v-model="dycj.enableNotice" :active-value="true" :inactive-value="false"></el-switch>
							</el-row>
						</div>
					</diV>
				</el-card>
			</el-col>
		</el-row>

		<el-row>
			<el-col :span="cardWidth" :key="4" :offset="cardOffset">
				<el-card class="box-card">
					<div slot="header" class="clearfix">
						<span>选股宝&nbsp;&nbsp;
							<el-switch
									class="setting-switch"
									v-model="xuangubao.enable"
									:active-value="true"
									:inactive-value="false"
									active-color="#13ce66"
							>
							</el-switch>
						</span>
					</div>
					<diV>
						<div class="text item">
							<el-row>
								<label>定时刷新频率(秒)</label>
								<el-input class="setting-input" size="mini" :disabled="!xuangubao.enable" v-model.number.lazy="xuangubao.setInterval_time" placeholder="请输入内容"></el-input>
							</el-row>
						</div>
						<br/>
						<div class="text item">
							<el-row>
								<label>通知开关</label>
								<el-switch class="setting-switch" :disabled="!xuangubao.enable" v-model="xuangubao.enableNotice" :active-value="true" :inactive-value="false"></el-switch>
							</el-row>
						</div>
					</diV>
				</el-card>
			</el-col>
		</el-row>

		<el-row>
			<el-col :span="cardWidth" :key="5" :offset="cardOffset">
				<el-card class="box-card">
					<div slot="header" class="clearfix">
						<span>云财经&nbsp;&nbsp;
							<el-switch
									class="setting-switch"
									v-model="yuncaijing.enable"
									:active-value="true"
									:inactive-value="false"
									active-color="#13ce66"
							>
							</el-switch>
						</span>
					</div>
					<diV>
						<div class="text item">
							<el-row>
								<label>定时刷新频率(秒)</label>
								<el-input class="setting-input" :disabled="!yuncaijing.enable" v-model.number.lazy="yuncaijing.setInterval_time" placeholder="请输入内容"></el-input>
							</el-row>
						</div>
						<br/>
						<div class="text item">
							<el-row>
								<label>通知开关</label>
								<el-switch class="setting-switch" :disabled="!yuncaijing.enable" v-model="yuncaijing.enableNotice" :active-value="true" :inactive-value="false"></el-switch>
							</el-row>
						</div>
					</diV>
				</el-card>
			</el-col>
		</el-row>

		<el-row>
			<el-col :span="cardWidth" :key="2" :offset="cardOffset">
				<el-card class="box-card">
					<div slot="header" class="clearfix">
						<span>
							深交所互动易问答&nbsp;&nbsp;
							<el-switch class="setting-switch" v-model="hdy.enable" :active-value="true" :inactive-value="false" active-color="#13ce66">
							</el-switch>
						</span>
					</div>
					<diV>
						<div class="text item">
							<el-row>
								<label>定时刷新频率(秒)</label>
								<el-input class="setting-input" :disabled="!hdy.enable" v-model.number.lazy="hdy.setInterval_time" placeholder="请输入内容"></el-input>
							</el-row>
						</div>
						<br/>
						<div class="text item">
							<el-row>
								<label>通知开关</label>
								<el-switch class="setting-switch" :disabled="!hdy.enable" v-model="hdy.enableNotice" :active-value="true" :inactive-value="false"></el-switch>
							</el-row>
						</div>
					</diV>
				</el-card>
			</el-col>
		</el-row>

		<el-row>
			<el-col :span="cardWidth" :key="2" :offset="cardOffset">
				<el-card class="box-card">
					<div slot="header" class="clearfix">
						<span>
							上证E互动&nbsp;&nbsp;
							<el-switch class="setting-switch" v-model="edy.enable" :active-value="true" :inactive-value="false" active-color="#13ce66">
							</el-switch>
						</span>
					</div>
					<diV>
						<div class="text item">
							<el-row>
								<label>定时刷新频率(秒)</label>
								<el-input class="setting-input" :disabled="!edy.enable" v-model.number.lazy="edy.setInterval_time" placeholder="请输入内容"></el-input>
							</el-row>
						</div>
						<br/>
						<div class="text item">
							<el-row>
								<label>通知开关</label>
								<el-switch class="setting-switch" :disabled="!edy.enable" v-model="edy.enableNotice" :active-value="true" :inactive-value="false"></el-switch>
							</el-row>
						</div>
					</diV>
				</el-card>
			</el-col>
		</el-row>
		<!--</el-dialog>-->
	</div>

</template>

<script>

    const packageInfo = require('../../../package.json');
    import configData from "./data_handler/config_data"
    import keywordData from "./data_handler/keyword_subscription_data"
    import filterData from "./data_handler/filter_data"

    let vue = null

    export default {
        name: "setting",
        data() {
            return {
                filterData: filterData,
                keywordData: keywordData,
                common: configData.common,
	            cls: configData.cls,
                hdy: configData.hdy,
                dycj: configData.dycj,
                xuangubao: configData.xuangubao,
                yuncaijing: configData.yuncaijing,
                edy: configData.ehd,
                version: packageInfo.version,
                cardWidth: 20,
                cardOffset: 2,
            }
        },
        computed: {
        },
        watch: {
        },
        props: {
        },
        created() {
            vue = this
        },
        mounted() {
        },
        methods: {
        },
    }
</script>

<style scoped>
	.el-select {
		float: right !important;
		width: 66%;
	}

	.version {
		margin-right: 16px;
		margin-left: 12px;
		margin-bottom: 13px;
	}

	.setting-switch{
		float: right;
		margin-right: 70%;
	}

	.setting-input{
		float: right;
		width: 66%;
		margin-right: 10%;
	}
</style>
