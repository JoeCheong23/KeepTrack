<template>
    <div class="header">
    <div class="p-d-md-inline">
      <div class="p-grid p-ai-center vertical-container">
        <h2 class="p-col p-ml-6 p-mr-0">KeepTrack</h2>
        <div class="p-col p-d-flex p-formgrid p-fluid">  
          <div class="p-mx-5">
            <Button label="Home" class="p-button-text"></Button>
          </div>
          <div class="p-mx-5">
            <Button label="Statistics" class="p-button-secondary p-button-text"></Button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
    name: 'MainHeader'
};
</script>

<style scoped>
.header {
    background-color: lightblue
}
</style>