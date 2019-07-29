<template>

	<el-card :body-style="{ padding: '0px' }" class="box-card" key="99999998" style="cursor:pointer; margin-bottom: 5px" >
		<div slot="header" class="clearfix">
			<span :style="{color: lableColor}" v-text="title"></span>&nbsp;&nbsp;
			<el-tag
					:key="tag"
					v-for="tag in keywords"
					closable
					:disable-transitions="false"
					@close="handleClose(tag)">
				{{tag}}
			</el-tag>
			<span>
				<el-input
					class="input-new-tag"
					v-if="inputVisible"
					v-model="inputValue"
					ref="saveTagInput"
					size="small"
					@keyup.enter.native="handleInputConfirm"
					@blur="handleInputConfirm"
			></el-input>
				<el-button v-else class="button-new-tag" size="small" @click="showInput">+ 添 加 </el-button>
			</span>
		</div>
	</el-card>

</template>

<script>
    export default {
        name: "keyword-subscription",
	    props:{
            lableColor: String,
            title: String,
            keywords: Array,
	    },
        data() {
            return {
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
	.el-card__body {
		padding: 0px !important;
	}
</style>
