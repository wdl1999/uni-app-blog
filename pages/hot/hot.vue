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
      问题：
        ①swiper高度问题
          原因：swiper高度不确定，取决于当前的list有高
          解决：在list渲染完成后，获取list下所有元素并叠加计算list的高度，
          swiper动态绑定高度此高度
        ②解决tab切换卡顿问题
          原因，点击tab切换时，swiper绑定的currentIndex更新，
          swiper切换动画和获取数据渲染dom同时进行
          解决：swiper动画完成之后再获取数据渲染dom
    5、list与tabs联动 -->
    <swiper
      class="swiper"
      :current="currentIndex"
      :style="{ height: currentSwiperHeight + 'px' }"
      @animationfinish="onSwiper"
    >
      <swiper-item
        class="swiper-item"
        v-for="(tabItem, tabIndex) in tabData"
        :key="tabIndex"
      >
        <view>
          <!-- 加载动画 -->
          <uni-load-more status="loading" v-if="isLoading"></uni-load-more>
          <block v-else>
            <hot-list-item
              :class="'hot-list-item-' + tabIndex"
              v-for="(item, index) in listData[tabIndex]"
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
      listData: [],
      // 当前swiper-item的高度
      currentSwiperHeight: 0,
      // 用于缓存所有swiper-item的高度
      swiperHeightData: {}
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
    },
    onSwiper() {
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
        // 渲染完成之后再计算高度
        setTimeout(async () => {
          this.currentSwiperHeight = await this.getCurrentSwiperHeight()
          this.swiperHeightData[this.currentIndex] = this.currentSwiperHeight
        }, 0)
      }
    },
    // 计算当前swiper-item的高度
    getCurrentSwiperHeight() {
      return new Promise((resolve) => {
        let sum = 0
        const query = uni.createSelectorQuery().in(this)
        query
          .selectAll(`.hot-list-item-${this.currentIndex}`)
          // res为节点(子节点)的布局位置信息
          .boundingClientRect((res) => {
            res.forEach((item) => {
              sum += item.height
            })
            resolve(sum)
          })
          .exec()
      })
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
  .tab-sticky {
    position: -webkit-sticky;
    position: sticky;
    z-index: 99;
    /* #ifndef H5 */
    top: 0;
    /* #endif */
    /* #ifdef H5 */
    top: 44px;
    /* #endif */
  }
}
</style>
