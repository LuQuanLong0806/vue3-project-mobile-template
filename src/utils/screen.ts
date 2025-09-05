/**
 * 大屏适配工具函数
 */

// 设计稿尺寸（可根据实际设计稿调整）
export const DESIGN_WIDTH = 1920
export const DESIGN_HEIGHT = 1080

/**
 * 获取缩放比例
 */
export function getScale(): { scaleX: number; scaleY: number; scale: number } {
  const clientWidth = window.innerWidth
  const clientHeight = window.innerHeight
  
  const scaleX = clientWidth / DESIGN_WIDTH
  const scaleY = clientHeight / DESIGN_HEIGHT
  
  // 取较小的缩放比例，保证内容完整显示
  const scale = Math.min(scaleX, scaleY)
  
  return {
    scaleX,
    scaleY,
    scale
  }
}

/**
 * 设置容器缩放
 * @param container 容器元素
 * @param options 配置选项
 */
export function setContainerScale(
  container: HTMLElement,
  options: {
    width?: number
    height?: number
    mode?: 'scale' | 'scaleX' | 'scaleY' | 'none'
  } = {}
) {
  const { width = DESIGN_WIDTH, height = DESIGN_HEIGHT, mode = 'scale' } = options
  
  const clientWidth = window.innerWidth
  const clientHeight = window.innerHeight
  
  const scaleX = clientWidth / width
  const scaleY = clientHeight / height
  const scale = Math.min(scaleX, scaleY)
  
  let transform = ''
  
  switch (mode) {
    case 'scale':
      transform = `scale(${scale})`
      break
    case 'scaleX':
      transform = `scaleX(${scaleX})`
      break
    case 'scaleY':
      transform = `scaleY(${scaleY})`
      break
    case 'none':
      transform = 'none'
      break
  }
  
  container.style.transform = transform
  container.style.transformOrigin = 'top left'
  
  // 设置容器尺寸
  if (mode === 'scale') {
    container.style.width = `${width}px`
    container.style.height = `${height}px`
  }
}

/**
 * 响应式字体大小计算
 * @param size 基础字体大小
 * @param min 最小字体大小
 * @param max 最大字体大小
 */
export function getResponsiveFontSize(size: number, min = 12, max = 48): number {
  const { scale } = getScale()
  const fontSize = size * scale
  return Math.max(min, Math.min(max, fontSize))
}

/**
 * 防抖函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout | null = null
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      timeout = null
      func(...args)
    }
    
    if (timeout) {
      clearTimeout(timeout)
    }
    timeout = setTimeout(later, wait)
  }
}

/**
 * 获取屏幕类型
 */
export function getScreenType(): 'mobile' | 'tablet' | 'desktop' | 'large' {
  const width = window.innerWidth
  
  if (width < 768) {
    return 'mobile'
  } else if (width < 1024) {
    return 'tablet'
  } else if (width < 1920) {
    return 'desktop'
  } else {
    return 'large'
  }
}

/**
 * 屏幕适配类
 */
export class ScreenAdapter {
  private container: HTMLElement | null = null
  private resizeHandler: () => void
  
  constructor() {
    this.resizeHandler = debounce(() => {
      this.resize()
    }, 100)
  }
  
  /**
   * 初始化适配器
   * @param selector 容器选择器或元素
   * @param options 配置选项
   */
  init(
    selector: string | HTMLElement,
    options: {
      width?: number
      height?: number
      mode?: 'scale' | 'scaleX' | 'scaleY' | 'none'
      autoResize?: boolean
    } = {}
  ) {
    this.container = typeof selector === 'string' 
      ? document.querySelector(selector) 
      : selector
    
    if (!this.container) {
      console.warn('ScreenAdapter: 容器元素未找到')
      return
    }
    
    const { autoResize = true } = options
    
    // 初始化缩放
    this.resize(options)
    
    // 自动监听窗口大小变化
    if (autoResize) {
      window.addEventListener('resize', this.resizeHandler)
    }
  }
  
  /**
   * 重新计算缩放
   */
  resize(options: {
    width?: number
    height?: number
    mode?: 'scale' | 'scaleX' | 'scaleY' | 'none'
  } = {}) {
    if (!this.container) return
    
    setContainerScale(this.container, options)
  }
  
  /**
   * 销毁适配器
   */
  destroy() {
    window.removeEventListener('resize', this.resizeHandler)
    this.container = null
  }
}
