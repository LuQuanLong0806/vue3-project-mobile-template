<template>
  <div class="about">
    <van-cell-group>
      <van-cell 
        title="关于项目" 
        value="Vue3移动端应用"
        icon="info-o"
        size="large"
      />
    </van-cell-group>
    
    <van-cell-group title="项目信息">
      <van-cell title="项目名称" value="Vue3移动端模板" />
      <van-cell title="版本" value="1.0.0" />
      <van-cell title="框架" value="Vue 3.4+" />
      <van-cell title="构建工具" value="Vite 5+" />
      <van-cell title="语言" value="TypeScript" />
      <van-cell title="UI框架" value="Vant UI" />
      <van-cell title="状态管理" value="Pinia" />
      <van-cell title="路由" value="Vue Router 4" />
    </van-cell-group>
    
    <div class="tech-stack">
      <van-divider content-position="left">技术栈</van-divider>
      <div class="tech-grid">
        <van-tag
          v-for="tech in techStack"
          :key="tech.name"
          :type="tech.type"
          size="large"
          class="tech-tag"
        >
          {{ tech.name }}
        </van-tag>
      </div>
    </div>
    
    <div class="project-info">
      <van-divider content-position="left">项目结构</van-divider>
      <van-collapse v-model="activeNames">
        <van-collapse-item 
          v-for="folder in projectStructure" 
          :key="folder.id"
          :title="folder.name" 
          :name="folder.id"
        >
          <van-cell-group>
            <van-cell 
              v-for="file in folder.children" 
              :key="file.id"
              :title="file.name"
              :label="file.children ? `${file.children.length} 个文件` : '文件'"
              icon="description"
            >
              <template #right-icon v-if="file.children">
                <van-icon name="arrow" />
              </template>
            </van-cell>
          </van-cell-group>
        </van-collapse-item>
      </van-collapse>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface TechItem {
  name: string
  type: 'primary' | 'success' | 'warning' | 'danger'
}

interface TreeNode {
  id: string
  name: string
  children?: TreeNode[]
}

const activeNames = ref(['1'])

const techStack: TechItem[] = [
  { name: 'Vue 3', type: 'primary' },
  { name: 'TypeScript', type: 'primary' },
  { name: 'Vite', type: 'success' },
  { name: 'Vant UI', type: 'success' },
  { name: 'Pinia', type: 'warning' },
  { name: 'Vue Router', type: 'warning' },
  { name: 'PostCSS', type: 'primary' },
  { name: '移动端适配', type: 'danger' }
]

const projectStructure: TreeNode[] = [
  {
    id: '1',
    name: 'src/',
    children: [
      {
        id: '2',
        name: 'components/',
        children: [
          { id: '3', name: 'HelloWorld.vue' }
        ]
      },
      {
        id: '4',
        name: 'views/',
        children: [
          { id: '5', name: 'Home.vue' },
          { id: '6', name: 'About.vue' },
          { id: '7', name: 'Counter.vue' },
          { id: '8', name: 'BigScreen.vue' },
          { id: '9', name: 'LessDemo.vue' },
          { id: '10', name: 'NotFound.vue' }
        ]
      },
      {
        id: '11',
        name: 'stores/',
        children: [
          { id: '12', name: 'counter.ts' },
          { id: '13', name: 'user.ts' },
          { id: '14', name: 'index.ts' }
        ]
      },
      {
        id: '15',
        name: 'router/',
        children: [
          { id: '16', name: 'index.ts' }
        ]
      },
      { id: '17', name: 'App.vue' },
      { id: '18', name: 'main.ts' }
    ]
  }
]
</script>

<style scoped>
.about {
  background-color: #f7f8fa;
  min-height: 100vh;
  padding-bottom: 20px;
}

.tech-stack {
  margin: 16px 0;
  padding: 0 16px;
}

.tech-grid {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin-top: 12px;
}

.tech-tag {
  cursor: default;
  border-radius: 16px;
  font-weight: 500;
}

.project-info {
  margin: 16px 0;
}

/* Vant组件样式调整 */
:deep(.van-cell-group) {
  margin-bottom: 16px;
  border-radius: 8px;
  overflow: hidden;
}

:deep(.van-cell-group__title) {
  padding: 16px 16px 8px;
  color: #323233;
  font-size: 14px;
  font-weight: 600;
}

:deep(.van-cell) {
  background-color: white;
}

:deep(.van-cell:first-child) {
  background: linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%);
}

:deep(.van-cell:first-child .van-cell__title) {
  font-size: 18px;
  font-weight: 600;
  color: #333;
}

:deep(.van-divider) {
  margin: 16px 0 8px;
}

:deep(.van-divider__content) {
  color: #323233;
  font-weight: 600;
  font-size: 14px;
}

:deep(.van-collapse-item__content) {
  padding: 0;
}

:deep(.van-collapse-item__title) {
  font-weight: 500;
  color: #1989fa;
}

@media (max-width: 768px) {
  .tech-grid {
    gap: 6px;
  }
  
  .tech-tag {
    font-size: 12px;
  }
}
</style>
