// components/BackgroundVideo.vue
<template>
  <div class="video-container">
    <video
      autoplay
      loop
      muted
      class="background-video"
    >
      <source src="../assets/videos/blur.mp4" type="video/mp4">
    </video>
  </div>
</template>

<style scoped>
.video-container {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}

.background-video {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 100%;
  min-height: 100%;
  width: auto;
  height: auto;
  object-fit: cover;
  z-index: 1;
}
</style>