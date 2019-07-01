<template>
  <div class="first_screen" :class="osStr" v-html="html">
    hello word
  </div>
</template>


<script>

  import { caiLianSheRequest } from './js/api'

  export default {
    name: 'index',
    data () {
      return {
        html: 'data > hello word'
      }
    },
    mounted () {
      this.requestData()
    },
    methods: {
      requestData () {
        const self = this
        caiLianSheRequest(function (data) {
          self.html = data
        })
      }
    }
  }
</script>

<style scoped>

</style>
