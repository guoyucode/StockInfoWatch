<template>
	<div style="margin-bottom: 15px; ">
		<label style="color: #393939">关键词订阅: </label>
		<el-tag
				:key="tag"
				v-for="tag in keywords"
				closable
				:disable-transitions="false"
				@close="handleClose(tag)">
			{{tag}}
		</el-tag>
		<el-input
				class="input-new-tag"
				v-if="inputVisible"
				v-model="inputValue"
				ref="saveTagInput"
				size="small"
				@keyup.enter.native="handleInputConfirm"
				@blur="handleInputConfirm"
		>
		</el-input>
		<el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添 加 </el-button>
	</div>
</template>

<script>

	import keywordData from "./js/keyword_subscription_data"

    export default {
        name: "keyword-subscription",
        data() {
            return {
                keywords: keywordData.data,
                inputVisible: false,
                inputValue: ''
            };
        },
        methods: {
            handleClose(tag) {
                this.keywords.splice(this.keywords.indexOf(tag), 1);
            },

            showInput() {
                this.inputVisible = true;
                this.$nextTick(_ => {
                    this.$refs.saveTagInput.$refs.input.focus();
                });
            },

            handleInputConfirm() {
                let inputValue = this.inputValue;
                if (inputValue) {
                    this.keywords.push(inputValue);
                }
                this.inputVisible = false;
                this.inputValue = '';
            }
        }
    }
</script>

<style scoped>
	.el-tag + .el-tag {
		margin-left: 10px;
	}
	.button-new-tag {
		margin-left: 10px;
		height: 32px;
		line-height: 30px;
		padding-top: 0;
		padding-bottom: 0;
	}
	.input-new-tag {
		width: 90px;
		margin-left: 10px;
		vertical-align: bottom;
	}
</style>
