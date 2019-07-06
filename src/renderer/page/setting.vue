<template>
	<div>
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
											v-for="item in ['F1', 'F2', 'F3', 'F4', 'F5','F6','F7','F8','F9','F10','F11','F12']"
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
								<el-input style="float: right; width: 66%;" size="mini"  placeholder="功能暂时没有实现"></el-input>
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
	import {getDBStore} from "./js/db";

    let vue = null

    export default {
        name: "setting",
        data() {
            return {
                cardWidth: 11,
                cardOffset: 1,
            }
        },
        props: {
            refs: Object,
            enableTab: Object, // {cls: true, dycj: true, ...}
            setShortKey: Function,
        },
	    created() {
          vue = this
	    },
        mounted() {
            //console.log("设置页-refs", this.refs)
            //获得数据库
            getDBStore(function (dbStore) {
                vue.dbStore = dbStore

            })
        },
	    methods: {

	    }
    }
</script>

<style scoped>
.el-select{
	float: right !important;
	width: 66%;
}
</style>
