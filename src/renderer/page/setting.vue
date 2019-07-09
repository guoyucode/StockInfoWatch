<template>
	<div>

		<el-collapse class="version" >
			<el-collapse-item  name="1"><!--style="max-height: 260px; overflow-y: auto;"-->
				<template slot="title">
					版本信息: {{version}}
				</template>

				<div style="color: green">当前版本更新: </div>
				<div>修复bug: 互动易不能保存通知开关的问题</div>
				<div>修复bug: 财联社电报通知开关保存后依然无效的问题</div>

<!--				<div>新增功能: 关键词订阅功能, 只有订阅的栏目数据才进行推送</div>
-->

				<br/>
				<div style="color: blue">近期版本更新: </div>

				<div>新增功能: 完成快捷键设置, 数据条数等各种开关设置功能</div>
				<div>新增功能: 完成快捷键设置, 数据条数等各种开关设置功能</div>
				<div>新增功能: 完成快捷键设置, 数据条数等各种开关设置功能</div>
				<div>新增功能: 完成快捷键设置, 数据条数等各种开关设置功能</div>
				<div>新增功能: 完成快捷键设置, 数据条数等各种开关设置功能</div>

				<div>新增功能: 完成快捷键设置, 数据条数等各种开关设置功能</div>
				<div>新增功能: 新一财经,选股宝,云财经数据展示,及定时器定时拉取新数据</div>
				<div>新增功能: 财联社电报,深交所互动易问答 数据展示,及定时器定时拉取新数据</div>
				<div></div>

				<br/>
				<div style="color: darkviolet">程序说明: </div>
				<div>实时查看股票行信息数据</div>
				<div>程序设置理念：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
				<div></div>

			</el-collapse-item>
		</el-collapse>

		<el-row>
			<el-col :span="cardWidth" :key="0" :offset="cardOffset">
				<el-card class="box-card">
					<div slot="header" class="clearfix">
						<span>公共配置</span>
					</div>

					<diV v-if="enableTab.cls">
						<div class="text item">
							<el-row>
								<label>刷新快捷键</label>
								<el-select v-model="hotKey" placeholder="快捷键选择">
									<el-option
											style="float: right;"
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
								<el-input style="float: right; width: 66%;" size="mini" v-model="dataLimit"  placeholder="功能暂时没有实现"></el-input>
							</el-row>
						</div>
					</diV>
				</el-card>
			</el-col>
			<el-col :span="cardWidth" :key="1" :offset="cardOffset">
				<el-card class="box-card">
					<div slot="header" class="clearfix">
						<span>
							财联社电报&nbsp;&nbsp;
							<el-switch v-model="enableTab.cls" :active-value="true" :inactive-value="false" active-color="#13ce66" inactive-color="#ff4949">
							</el-switch>
						</span>
					</div>
					<diV v-if="enableTab.cls">
						<div class="text item">
							<el-row>
								<label>定时刷新频率(秒)</label>
								<el-input style="float: right; width: 66%;" size="mini" v-model="refs.cls.setInterval_time" placeholder="请输入内容"></el-input>
							</el-row>
						</div>
						<br/>
						<div class="text item">
							<el-row>
								<label>通知开关</label>
								<el-switch style="margin-left: 16%;" v-model="refs.cls.enableNotice" :active-value="true" :inactive-value="false"></el-switch>
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
							互动易问答&nbsp;&nbsp;
							<el-switch v-model="enableTab.hdy" :active-value="true" :inactive-value="false" active-color="#13ce66" inactive-color="#ff4949">
							</el-switch>
						</span>
					</div>
					<diV v-if="enableTab.hdy">
						<div class="text item">
							<el-row>
								<label>定时刷新频率(秒)</label>
								<el-input style="float: right; width: 66%;" size="mini" v-model="refs.hdy.setInterval_time" placeholder="请输入内容"></el-input>
							</el-row>
						</div>
						<br/>
						<div class="text item">
							<el-row>
								<label>通知开关</label>
								<el-switch style="margin-left: 16%;" v-model="refs.hdy.enableNotice" :active-value="true" :inactive-value="false"></el-switch>
							</el-row>
						</div>
					</diV>
				</el-card>
			</el-col>
			<el-col :span="cardWidth" :key="3" :offset="cardOffset">
				<el-card class="box-card">
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
					<diV v-if="enableTab.dycj">
						<div class="text item">
							<el-row>
								<label>定时刷新频率(秒)</label>
								<el-input style="float: right; width: 66%;" size="mini" v-model="refs.dycj.setInterval_time" placeholder="请输入内容"></el-input>
							</el-row>
						</div>
						<br/>
						<div class="text item">
							<el-row>
								<label>通知开关</label>
								<el-switch style="margin-left: 16%;" v-model="refs.dycj.enableNotice" :active-value="true" :inactive-value="false"></el-switch>
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
									v-model="enableTab.xuangubao"
									:active-value="true"
									:inactive-value="false"
									active-color="#13ce66"
									inactive-color="#ff4949">
							</el-switch>
						</span>
					</div>
					<diV v-if="enableTab.xuangubao">
						<div class="text item">
							<el-row>
								<label>定时刷新频率(秒)</label>
								<el-input style="float: right; width: 66%;" size="mini" v-model="refs.xuangubao.setInterval_time" placeholder="请输入内容"></el-input>
							</el-row>
						</div>
						<br/>
						<div class="text item">
							<el-row>
								<label>通知开关</label>
								<el-switch style="margin-left: 16%;" v-model="refs.xuangubao.enableNotice" :active-value="true" :inactive-value="false"></el-switch>
							</el-row>
						</div>
					</diV>
				</el-card>
			</el-col>
			<el-col :span="cardWidth" :key="5" :offset="cardOffset">
				<el-card class="box-card">
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
					<diV v-if="enableTab.yuncaijing">
						<div class="text item">
							<el-row>
								<label>定时刷新频率(秒)</label>
								<el-input style="float: right; width: 66%;" size="mini" v-model="refs.yuncaijing.setInterval_time" placeholder="请输入内容"></el-input>
							</el-row>
						</div>
						<br/>
						<div class="text item">
							<el-row>
								<label>通知开关</label>
								<el-switch style="margin-left: 16%;" v-model="refs.yuncaijing.enableNotice" :active-value="true" :inactive-value="false"></el-switch>
							</el-row>
						</div>
					</diV>
				</el-card>
			</el-col>
		</el-row>
	</div>
</template>

<script>

    const packageInfo = require('../../../package.json');
    const fs = require('fs');

    import {getDBStore} from "./js/db";
    import {mapActions} from "vuex"
    import {config, delayer} from "./js/utils"

    let vue = null

    export default {
        name: "setting",
        data() {
            return {
                version: packageInfo.version,
                hotKey: "无",
                cardWidth: 11,
                cardOffset: 1,
                dataLimit: config.dataLimit,
            }
        },
	    watch: {
            dataLimit: delayer(cur =>{
                if(isNaN(cur)) {
                    vue.dataLimit = 500
	                return
                }
                config.dataLimit = cur
                vue.dbStore.push("dataLimit", cur)
            }),
            hotKey: function (cur) {
                console.log("watch.hotKey", cur)
                vue.setHotKey(cur)
	            vue.dbStore.push("hotKey", cur)
            }
	    },
        props: {
            refs: Object,
            enableTab: Object, // {cls: true, dycj: true, ...}
        },
	    created() {
          vue = this
	    },
        mounted() {
            //console.log("设置页-refs", this.refs)

            /*fs.readFile("version", function (err, v) {
	            vue.version = v;
            })*/

            //获得数据库
            getDBStore(dbStore => {
                vue.dbStore = dbStore
                vue.hotKey = vue.$store.getters.getHotKey
                dbStore.select("hotKey", v =>  {
                    if(v != undefined) vue.hotKey = v
                })
                dbStore.select("dataLimit", v => {
                    if(v != undefined) vue.dataLimit = v
                })
            })
        },
	    methods: {
            ...mapActions(["setHotKey"]),
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
		margin-left: 40px;
		margin-bottom: 13px;
	}
</style>
