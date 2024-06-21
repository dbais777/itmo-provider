<template>
  <div class="description">
    <div class="line line-1"></div>
    <div class="line line-2"></div>
    <div class="line line-3"></div>
  </div>
</template>

<style scoped lang="scss">
.description .line {
  background: #bdbdbd;
  border-radius: 10px;
  height: 10px;
  margin: 10px 0;
  overflow: hidden;
  position: relative;
}

.description .line::before,
.btns .btn::before {
  position: absolute;
  content: "";
  height: 100%;
  width: 100%;
  background-image: linear-gradient(
    to right,
    #bdbdbd 0%,
    rgba(0, 0, 0, 0.289) 20%,
    #bdbdbd 40%,
    #bdbdbd 100%
  );
  background-repeat: no-repeat;
  background-size: 450px 400px;
  animation: shimmer 1s linear infinite;
}
.description .line-1 {
  width: calc(100% - 15%);
}
.description .line-3 {
  width: calc(100% - 40%);
}
@keyframes shimmer {
  0% {
    background-position: -450px 0;
  }
  100% {
    background-position: 450px 0;
  }
}
</style>
