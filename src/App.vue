<template>
  <router-view></router-view>
</template>

<script>
export default {
  name: 'App',
  data: () => ({
    //
  })
}
</script>
<style>
::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
::-webkit-scrollbar-thumb {
  border-radius: 6px;
  -webkit-box-shadow: inset 0 0 6px rgb(193,193,193);
  background: rgb(193,193,193);
}
::-webkit-scrollbar-track {
  border-radius: 0;
  -webkit-box-shadow: inset 0 0 6px rgba(241,241,241,0);
  background: rgba(241,241,241,0);
}
</style>
