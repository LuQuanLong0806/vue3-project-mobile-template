<template>
  <div class="less-demo">
    <div class="container">
      <h1 class="page-title">Less 预处理器演示</h1>
      <p class="description">
        展示Less的变量、混合器、嵌套、函数等强大功能
      </p>

      <!-- 变量演示 -->
      <section class="demo-section">
        <h2 class="section-title">变量使用演示</h2>
        <div class="color-palette">
          <div class="color-item primary">
            <div class="color-block"></div>
            <span class="color-name">主色调</span>
          </div>
          <div class="color-item success">
            <div class="color-block"></div>
            <span class="color-name">成功色</span>
          </div>
          <div class="color-item warning">
            <div class="color-block"></div>
            <span class="color-name">警告色</span>
          </div>
          <div class="color-item danger">
            <div class="color-block"></div>
            <span class="color-name">危险色</span>
          </div>
        </div>
      </section>

      <!-- 混合器演示 -->
      <section class="demo-section">
        <h2 class="section-title">混合器使用演示</h2>
        <div class="mixins-demo">
          <div class="card-demo hover-card">
            <h3>悬停效果卡片</h3>
            <p>使用了hover-effect混合器</p>
          </div>
          <div class="card-demo glass-card">
            <h3>毛玻璃效果卡片</h3>
            <p>使用了glass-effect混合器</p>
          </div>
          <div class="card-demo gradient-card">
            <h3>渐变背景卡片</h3>
            <p>使用了gradient-bg混合器</p>
          </div>
        </div>
      </section>

      <!-- 嵌套演示 -->
      <section class="demo-section">
        <h2 class="section-title">嵌套语法演示</h2>
        <div class="nested-demo">
          <ul class="nested-list">
            <li class="list-item">
              <span class="item-text">第一级项目</span>
              <ul class="sub-list">
                <li class="sub-item active">活跃的子项目</li>
                <li class="sub-item">普通子项目</li>
                <li class="sub-item disabled">禁用的子项目</li>
              </ul>
            </li>
            <li class="list-item">
              <span class="item-text">第二级项目</span>
            </li>
          </ul>
        </div>
      </section>

      <!-- 响应式演示 -->
      <section class="demo-section">
        <h2 class="section-title">响应式设计演示</h2>
        <div class="responsive-demo">
          <div class="responsive-card">
            <h3 class="responsive-title">响应式标题</h3>
            <p class="responsive-text">
              这段文字会根据屏幕大小自动调整字体大小，使用了clamp函数和vw单位。
            </p>
            <div class="responsive-buttons">
              <button class="btn primary">主要按钮</button>
              <button class="btn secondary">次要按钮</button>
            </div>
          </div>
        </div>
      </section>

      <!-- 动画演示 -->
      <section class="demo-section">
        <h2 class="section-title">动画效果演示</h2>
        <div class="animation-demo">
          <div class="animation-item bounce">弹跳效果</div>
          <div class="animation-item rotate">旋转效果</div>
          <div class="animation-item scale">缩放效果</div>
          <div class="animation-item slide">滑动效果</div>
        </div>
      </section>

      <!-- Less功能列表 -->
      <section class="demo-section">
        <h2 class="section-title">Less 功能特性</h2>
        <div class="features-grid">
          <div class="feature-item" v-for="feature in lessFeatures" :key="feature.title">
            <div class="feature-icon">{{ feature.icon }}</div>
            <h3 class="feature-title">{{ feature.title }}</h3>
            <p class="feature-desc">{{ feature.description }}</p>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'

interface Feature {
  title: string
  description: string
  icon: string
}

const lessFeatures: Feature[] = reactive([
  {
    title: '变量',
    description: '使用@符号定义变量，提高代码复用性和维护性',
    icon: '📝'
  },
  {
    title: '混合器',
    description: '创建可重用的样式组合，支持参数和条件逻辑',
    icon: '🔧'
  },
  {
    title: '嵌套',
    description: '支持CSS规则嵌套，使代码结构更清晰',
    icon: '🎯'
  },
  {
    title: '函数',
    description: '内置数学、字符串、颜色处理等函数',
    icon: '⚙️'
  },
  {
    title: '导入',
    description: '模块化管理样式文件，支持文件拆分',
    icon: '📦'
  },
  {
    title: '运算',
    description: '支持数学运算，动态计算样式值',
    icon: '🧮'
  }
])
</script>

<style lang="less" scoped>
// 导入Less变量和混合器
@import '@/styles/variables.less';
@import '@/styles/mixins.less';

.less-demo {
  padding: @spacing-lg 0;
  min-height: 100vh;
  background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 @spacing-lg;
  }

  .page-title {
    .text(@font-size-extra-large * 1.5, @text-color-primary, @font-weight-bold);
    .text-center();
    margin-bottom: @spacing-md;
    .text-shadow();
  }

  .description {
    .text(@font-size-medium, @text-color-secondary);
    .text-center();
    margin-bottom: @spacing-xxl;
    line-height: @line-height-large;
  }

  // 演示区域
  .demo-section {
    margin-bottom: @spacing-xxl * 2;
    
    .section-title {
      .text(@font-size-large, @text-color-primary, @font-weight-medium);
      margin-bottom: @spacing-lg;
      padding-bottom: @spacing-sm;
      .border-bottom(2px, solid, @primary-color);
      position: relative;
      
      &::after {
        content: '';
        position: absolute;
        bottom: -2px;
        left: 0;
        width: 50px;
        height: 2px;
        background: @primary-light-2;
      }
    }
  }

  // 颜色面板
  .color-palette {
    .flex(row, space-around, center, wrap);
    gap: @spacing-lg;
    
    .color-item {
      .flex(column, center, center);
      gap: @spacing-sm;
      
      .color-block {
        .size(80px);
        .border-radius(@border-radius-medium);
        .box-shadow();
        .transition();
        
        &:hover {
          .transform(scale(1.1));
        }
      }
      
      .color-name {
        .text(@font-size-small, @text-color-regular);
        font-weight: @font-weight-medium;
      }
      
      // 使用嵌套和父选择器
      &.primary .color-block { background: @primary-color; }
      &.success .color-block { background: @success-color; }
      &.warning .color-block { background: @warning-color; }
      &.danger .color-block { background: @danger-color; }
    }
  }

  // 混合器演示
  .mixins-demo {
    .responsive-grid(300px, @spacing-lg);
    
    .card-demo {
      padding: @spacing-lg;
      .border-radius(@border-radius-large);
      .text-center();
      .transition();
      min-height: 150px;
      .flex(column, center, center);
      
      h3 {
        .text(@font-size-medium, @white, @font-weight-medium);
        margin-bottom: @spacing-sm;
      }
      
      p {
        .text(@font-size-small, rgba(255, 255, 255, 0.8));
      }
      
      // 使用混合器
      &.hover-card {
        background: @primary-color;
        .hover-effect(1.05);
      }
      
      &.glass-card {
        .glass-effect(15px, 0.2);
        color: @text-color-primary;
        border: 1px solid rgba(255, 255, 255, 0.3);
        
        h3, p {
          color: @text-color-primary;
        }
      }
      
      &.gradient-card {
        .gradient-bg(@success-color, @primary-color);
      }
    }
  }

  // 嵌套演示
  .nested-demo {
    .nested-list {
      list-style: none;
      
      .list-item {
        .border(@border-width-base, solid, @border-color-light);
        .border-radius(@border-radius-base);
        margin-bottom: @spacing-sm;
        
        .item-text {
          display: block;
          padding: @spacing-md;
          .text(@font-size-medium, @text-color-primary, @font-weight-medium);
          background: @background-color-light;
          .border-radius(@border-radius-base @border-radius-base 0 0);
        }
        
        .sub-list {
          list-style: none;
          
          .sub-item {
            padding: @spacing-sm @spacing-md;
            .border-top(@border-width-base, solid, @border-color-lighter);
            .text(@font-size-small, @text-color-regular);
            .transition(background-color);
            
            &:hover {
              background: @background-color-base;
            }
            
            &.active {
              background: @primary-light-9;
              color: @primary-color;
              font-weight: @font-weight-medium;
            }
            
            &.disabled {
              color: @text-color-placeholder;
              cursor: not-allowed;
            }
          }
        }
      }
    }
  }

  // 响应式演示
  .responsive-demo {
    .responsive-card {
      .card();
      .text-center();
      
      .responsive-title {
        .responsive-font(18px, 32px, 3vw);
        margin-bottom: @spacing-md;
      }
      
      .responsive-text {
        .responsive-font(14px, 18px, 2vw);
        margin-bottom: @spacing-lg;
        line-height: @line-height-large;
      }
      
      .responsive-buttons {
        .flex(row, center, center, wrap);
        gap: @spacing-md;
        
        .btn {
          padding: @spacing-sm @spacing-lg;
          .border-radius(@border-radius-base);
          border: none;
          .text(@font-size-base, @white, @font-weight-medium);
          cursor: pointer;
          .transition();
          
          &.primary {
            background: @primary-color;
            
            &:hover {
              background: @primary-dark-1;
            }
          }
          
          &.secondary {
            background: @info-color;
            
            &:hover {
              background: darken(@info-color, 10%);
            }
          }
        }
      }
    }
  }

  // 动画演示
  .animation-demo {
    .flex(row, space-around, center, wrap);
    gap: @spacing-lg;
    
    .animation-item {
      .size(120px, 80px);
      .center-flex();
      .border-radius(@border-radius-medium);
      background: @primary-color;
      color: @white;
      .text(@font-size-small, @white, @font-weight-medium);
      cursor: pointer;
      
      &.bounce {
        &:hover {
          animation: bounce 0.6s ease-in-out;
        }
      }
      
      &.rotate {
        .transition(transform, 0.5s);
        
        &:hover {
          .rotate(360deg);
        }
      }
      
      &.scale {
        .transition(transform);
        
        &:hover {
          .scale(1.2);
        }
      }
      
      &.slide {
        .transition(transform);
        
        &:hover {
          .translate(20px, 0);
        }
      }
    }
  }

  // 功能特性网格
  .features-grid {
    .responsive-grid(250px, @spacing-lg);
    
    .feature-item {
      .card();
      .text-center();
      .transition();
      
      &:hover {
        .transform(translateY(-8px));
        .box-shadow(@box-shadow-dark);
      }
      
      .feature-icon {
        font-size: @font-size-extra-large * 2;
        margin-bottom: @spacing-md;
      }
      
      .feature-title {
        .text(@font-size-medium, @text-color-primary, @font-weight-medium);
        margin-bottom: @spacing-sm;
      }
      
      .feature-desc {
        .text(@font-size-small, @text-color-secondary);
        line-height: @line-height-large;
      }
    }
  }
}

// 关键帧动画
@keyframes bounce {
  0%, 20%, 53%, 80%, 100% {
    .transform(translateY(0));
  }
  40%, 43% {
    .transform(translateY(-20px));
  }
  70% {
    .transform(translateY(-10px));
  }
  90% {
    .transform(translateY(-4px));
  }
}

// 响应式设计
.mobile({
  .less-demo {
    .animation-demo {
      .flex(column, center, center);
    }
    
    .color-palette {
      .flex(column, center, center);
    }
  }
});
</style>
