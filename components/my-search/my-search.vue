<template>
  <view class="my-search-container">
    <!-- 搜索框 -->
    <!-- 具备能力：输入框样式、不能输入、placeholder由父组件指定 -->
    <view class="my-search-box">
      <image class="icon" src="@/static/images/search.png" mode="scaleToFill" />
      <text class="placeholder">{{ placeholderText }}</text>
    </view>
  </view>
</template>

<script>
export default {
  name: "my-search",
  props: {
    placeholderText: {
      type: String,
      default: "搜索",
    },
  },
  data() {
    return {};
  },
};
</script>

<style lang="scss" scoped>
.my-search-container {
  display: flex;
  align-items: center;
  .my-search-bar {
    width: 100%;
  }
  .my-search-box {
    height: 36px;
    background-color: #ffffff;
    border-radius: 15px;
    border: 1px solid #c9c9c9;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 0 $uni-spacing-row-base;

    .icon {
      width: $uni-img-size-sm;
      height: $uni-img-size-sm;
    }

    .placeholder {
      font-size: $uni-font-size-sm;
      margin-left: $uni-spacing-row-sm;
      color: #454545;
    }
  }
}
</style>
