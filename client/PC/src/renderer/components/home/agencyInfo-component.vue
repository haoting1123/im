<template>
  <div class="agency-info-component">
    <div class="main-section">
      <h1>{{ agencyInfo.treeName }}</h1>
      <h2>{{ agencyInfo.label }}</h2>
    </div>
  </div>
</template>

<script>
  export default {
    props: ['agencyInfo'],
    data () {
      return {}
    },
    methods: {}
  }
</script>

<style lang="scss">
  .agency-info-component {
    position: relative;
    height: 100%;
    .main-section {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translateX(-50%) translateY(-50%);
      h1, h2 {
        font-weight: normal;
        text-align: center;
      }
      h1 {
        color: #4eb7ea;
      }
      h2 {
        font-size: 24px;
      }
    }
  }
</style>
