<template>
  <view class="hot-container">
    <image class="logo" src="@/static/images/logo.png" mode="aspectFit" />
    <view class="search-box">
      <my-search placeholderText="uni-app 自定义组件"></my-search>
    </view>
    <!-- vue中 :listData="tabList" === 小程序中 listData="{{tabList}}" -->
    <!-- uni-app父传值给子遵循vue -->
    <my-tabs
      :tabData="tabData"
      :defaultIndex="0"
      @tabClick="onTabClick"
    ></my-tabs>
    <!-- 实现list的六步骤： 
    1、使用mock数据构建list基本功能 
    2、美化样式
    3、根据tab切换，获取真实数据
      my-tabs组件切换tab向父组件hot传递切换事件
      hot组件根据切换事件参数index，获取接口数据
    4、list可以左右切换 
      通过swiper改造
    5、list与tabs联动 -->
    <swiper class="swiper" :current="currentIndex">
      <swiper-item
        class="swiper-item"
        v-for="(tabItem, tabIndex) in tabData"
        :key="tabIndex"
      >
        <view>
          <!-- 加载动画 -->
          <uni-load-more status="loading" v-if="isLoading" />
          <block v-else>
            <hot-list-item
              v-for="(item, index) in listData[currentIndex]"
              :key="index"
              :ranking="index + 1"
              :data="item"
            ></hot-list-item>
          </block>
        </view>
      </swiper-item>
    </swiper>
  </view>
</template>

<script>
import { getHotTabs, getHotListFromTabType } from 'api/hot'
export default {
  data() {
    return {
      tabData: [],
      currentIndex: 0,
      isLoading: false,
      listData: []
    }
  },
  // 在实例创建完成后被立即调用
  created() {
    this.getHotTabs()
  },
  methods: {
    // 获取热搜标题数据
    async getHotTabs() {
      const { data: res } = await getHotTabs()
      this.tabData = res.list
      this.loadHotListFromTab()
    },
    onTabClick(index) {
      this.currentIndex = index
      this.loadHotListFromTab()
    },
    /* 获取列表数据需要做：
      没获取到数据时，展示loading
      获取到数据存储在本地
      获取到数据后，不展示loading */
    /* 被调用的两个地方：
      切换tab时候
      tabData数据获取到之后 */
    async loadHotListFromTab() {
      if (!this.listData[this.currentIndex]) {
        this.isLoading = true
        const id = this.tabData[this.currentIndex].id
        const { data: res } = await getHotListFromTabType(id)
        this.listData[this.currentIndex] = res.list
        this.isLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.hot-container {
  background-color: $uni-bg-color;
  .logo {
    width: 100%;
    height: 80px;
  }
  .search-box {
    padding: 0 16px;
    margin-bottom: $uni-spacing-col-base;
  }
}
</style>
