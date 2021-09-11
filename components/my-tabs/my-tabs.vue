<template>
  <!-- 具备的能力：父组件指定样式、父组件指定内容、父组件指定索引 -->
  <view class="tab-container">
    <view class="tab-box">
      <scroll-view
        :scroll-left="scrollLeft"
        scroll-x
        class="scroll-view"
        scroll-with-animation
      >
        <view class="scroll-content">
          <view class="tab-item-box">
            <!-- vue中 v-for="(item, index) in arr" :key="index" -->
            <!-- 小程序中 wx:for="{{arr}}" 默认index item -->
            <!-- uni-app遵循vue (block+v-for) -->
            <block v-for="(item, index) in tabData" :key="index">
              <view
                :id="'_tab_' + index"
                class="tab-item"
                :class="{ 'tab-item-active': activeIndex === index }"
                @click="tabClick(index)"
                :style="{
                  color: activeIndex === index ? defaultConfig.activeTextColor : defaultConfig.textColor
                }"
                >{{ item.label || item }}</view
              >
              <!-- 滑块 -->
              <view
                class="underLine"
                :style="{
                  transform: 'translateX(' + slider.left + 'px)',
                  width: defaultConfig.underLineWidth + 'px',
                  height: defaultConfig.underLineHeight + 'px',
                  backgroundColor: defaultConfig.underLineColor,
                }"
              />
            </block>
          </view>
        </view>
      </scroll-view>
    </view>
  </view>
</template>

<script>
export default {
  name: "my-tabs",
  props: {
    // 默认值是复杂数据类型时，需要指定一个函数为value,通过返回值的形式执行默认值
    // 配置项（样式）
    config: {
      type: Object,
      default: () => {
        return {};
      },
    },
    // tabs数据
    tabData: {
      type: Array,
      default: () => {
        return [];
      },
    },
    // tabs索引
    defaultIndex: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {
      // 当前激活项的 index
      activeIndex: -1,
      tabList: [],
      // 滑块对象配置
      slider: {
        left: 0,
      },
      // 默认配置
      defaultConfig: {
        // 默认的字体颜色
        textColor: "#333333",
        // 高亮字体颜色
        activeTextColor: "#f94d2a",
        // 下划线宽度 px
        underLineWidth: 24,
        // 下划线高度 px
        underLineHeight: 2,
        // 下划线颜色
        underLineColor: "#f94d2a",
      },
      scrollLeft: 0,
    };
  },
  watch: {
    /* 这种设置配置项的方法，可兼容父组件只传了defaultConfig的
    部分对象的值，也可以解决复用子组件，props不更新的问题 */
    config: {
      handler(val) {
        this.defaultConfig = {...this.defaultConfig, ...val};
      },
      immediate: true,
    },
    defaultIndex: {
      handler(val) {
        this.activeIndex = val;
      },
      immediate: true,
    },
    tabData: {
      handler(val) {
        this.tabList = val;
        // uni中，需要dom渲染之后执行的推荐用setTimeout
        setTimeout(() => {
          this.updateTabWidth();
        }, 0);
      },
      immediate: true,
    },
  },
 
  methods: {
    tabClick(index) {
      this.activeIndex = index;
      this.tabToIndex();
      this.$emit("tabClick", index);
    },
    updateTabWidth() {
      let data = this.tabList;
      if (data.length == 0) return false;

      // uni获取 dom 的固定写法
      const query = uni.createSelectorQuery().in(this);
      data.forEach((item, index) => {
        // 获取 dom 的固定写法
        query
          .select("#_tab_" + index)
          .boundingClientRect((res) => {
            item._slider = {
              left:
                res.left + (res.width - this.defaultConfig.underLineWidth) / 2,
            };
            if (data.length - 1 === index) {
              this.tabToIndex();
            }
          })
          .exec();
      });
    },
    tabToIndex() {
      const index = this.activeIndex;
      this.slider = {
        left: this.tabList[index]._slider.left,
      };
      this.scrollLeft = index * this.defaultConfig.underLineWidth;
    },
  },
};
</script>

<style lang="scss">
.tab-container {
  font-size: $uni-font-size-base;
  height: 45px;
  line-height: 45px;
  background-color: $uni-bg-color;
  .tab-box {
    width: 100%;
    height: 45px;
    display: flex;
    position: relative;
    .scroll-view {
      white-space: nowrap;
      width: 100%;
      height: 100%;
      box-sizing: border-box;
      .scroll-content {
        width: 100%;
        height: 100%;
        position: relative;

        .tab-item-box {
          height: 100%;
          .tab-item {
            height: 100%;
            display: inline-block;
            text-align: center;
            padding: 0 15px;
            position: relative;
            text-align: center;
            color: $uni-text-color;

            &-active {
              color: $uni-text-color-hot;
            }
          }
        }
        .underLine {
          height: 2px;
          width: 25px;
          background-color: #f01414;
          border-radius: 3px;
          transition: 0.5s;
          position: absolute;
          bottom: 0;
        }
      }
    }
  }
}
</style>
/* 滑块滚动实现逻辑：
  1、滚动时机
    1.1点击tab时滚动
    1.2初始化时滑块在默认位置
  2、滚动距离
    left=tabItem.left+(tabItem.width-slider.width)/2
  实现：
    监听tabData的变化，赋值给tabList，在dom渲染完成之后，
    通过updateTabWidth()为tabList的每个item维护一个slider对象
    记录每个滑块的要滑动的距离left：
      _slider：{
        left：xxx
      }
    维护完就调用tabToIndex(),通过activeIndex，计算滑块的滚动位置
    slider.left，并在滑块的元素动态绑定style，设置移动位置为slider.left */
/* scroll-view的点击位移
  <scroll-view>绑定scroll-left
  简单的算法：
    this.scrollLeft = this.activeIndex * this.defaultConfig.underLineWidth */
/* tab组件的满足需求：
  1、可以在父组件中定义my-tabs的样式
  2、可以在父组件中设置展示数据
  3、可以在父组件中设置默认的激活项 */