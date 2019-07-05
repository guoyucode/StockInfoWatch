<template>
	<div>
		设置页
	</div>
</template>

<script>
    export default {
        name: "setting",
	    props: {
            refs: Object,
	    },
	    mounted() {
            console.log("设置页-refs", this.refs)
        }
    }
</script>

<style scoped>

</style>
