<template>
  <div class="sprite absolute" :style="{
    width: width + 'px',
    height: height + 'px',
    animation: `playv ${time}s steps(${vCount * 1 - 1}) ${loop}, playh ${time / hCount
      }s steps(${hCount * 1 - 1}) ${loop}`,
    background: `url(${imgObj.src}) no-repeat`,
    backgroundSize: `${imgWidth}px ${imgHeight}px`,
    zIndex: 90,
    position: 'absolute',
    top: y + 'px',
    left: x + 'px',
  }"></div>
</template>

<script setup>
const props = defineProps({
  img: {
    type: String,
    required: true,
  },
  x: {
    type: [Number, String],
    required: true,
  },
  y: {
    type: [Number, String],
    required: true,
  },
  width: {
    type: [Number, String],
    required: true,
  },
  height: {
    type: [Number, String],
    required: true,
  },
  vCount: {
    type: [Number, String],
    default: 1,
  },
  hCount: {
    type: [Number, String],
    required: true,
  },
  loop: {
    type: [Number, String],
    default: 1,
  },
  time: {
    type: [Number, String],
    default: 0.5,
  },
});

const imgWidth = ref(0);
const imgHeight = ref(0);

const imgObj = new Image();
imgObj.onload = function () {
  imgWidth.value = this.width * (props.width / (this.width / props.hCount));
  imgHeight.value = this.height * (props.height / (this.height / props.vCount));
};
imgObj.src = "/_nuxt/" + props.img;
</script>

<style>
@keyframes playv {
  from {
    background-position: 0 0;
  }

  to {
    background-position: 0 100%;
  }
}

@keyframes playh {
  from {
    background-position: 0 0;
  }

  to {
    background-position: 100% 0;
  }
}
</style>
