<template>
    <div class="imgbox">
        <img :src="banner" :alt="alt" class="banner"/>
    </div>
</template>

<script setup lang="ts">
    const alt = "Garry's Mod Banner";
    const banner = new URL('../assets/images/loadingscreen/ttt.png', import.meta.url).href;
</script>

<style scoped>
* {
    margin: 0;
    padding: 0;
}
.imgbox {
    width: 100%;
    height: 100%;
}
.banner {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>