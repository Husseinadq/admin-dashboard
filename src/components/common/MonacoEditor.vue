<template>
  <div ref="editorContainer" class="monaco-editor-container" :style="{ height: height, width: width }"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import * as monaco from 'monaco-editor'
import loader from '@monaco-editor/loader'

// Props
interface Props {
  modelValue: string
  language?: string
  theme?: string
  height?: string
  width?: string
  readonly?: boolean
  options?: monaco.editor.IStandaloneEditorConstructionOptions
}

const props = withDefaults(defineProps<Props>(), {
  language: 'html',
  theme: 'vs',
  height: '400px',
  width: '100%',
  readonly: false,
  options: () => ({})
})

// Emits
const emit = defineEmits<{
  'update:modelValue': [value: string]
  'change': [value: string]
  'focus': []
  'blur': []
}>()

// Refs
const editorContainer = ref<HTMLElement>()
let editor: monaco.editor.IStandaloneCodeEditor | null = null

// Monaco Editor setup
const initializeEditor = async () => {
  if (!editorContainer.value) return

  try {
    // Configure Monaco loader
    loader.config({ monaco })
    
    // Create editor
    editor = monaco.editor.create(editorContainer.value, {
      value: props.modelValue,
      language: props.language,
      theme: props.theme,
      readOnly: props.readonly,
      automaticLayout: true,
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      wordWrap: 'on',
      lineNumbers: 'on',
      glyphMargin: false,
      folding: false,
      lineDecorationsWidth: 0,
      lineNumbersMinChars: 3,
      renderLineHighlight: 'none',
      scrollbar: {
        vertical: 'auto',
        horizontal: 'auto',
        verticalScrollbarSize: 8,
        horizontalScrollbarSize: 8
      },
      fontSize: 14,
      fontFamily: 'Monaco, Menlo, "Ubuntu Mono", monospace',
      ...props.options
    })

    // Listen for content changes
    editor.onDidChangeModelContent(() => {
      const value = editor?.getValue() || ''
      emit('update:modelValue', value)
      emit('change', value)
    })

    // Listen for focus/blur events
    editor.onDidFocusEditorText(() => {
      emit('focus')
    })

    editor.onDidBlurEditorText(() => {
      emit('blur')
    })

  } catch (error) {
    console.error('Failed to initialize Monaco Editor:', error)
  }
}

// Watch for prop changes
watch(() => props.modelValue, (newValue) => {
  if (editor && editor.getValue() !== newValue) {
    editor.setValue(newValue)
  }
})

watch(() => props.language, (newLanguage) => {
  if (editor) {
    const model = editor.getModel()
    if (model) {
      monaco.editor.setModelLanguage(model, newLanguage)
    }
  }
})

watch(() => props.theme, (newTheme) => {
  if (editor) {
    monaco.editor.setTheme(newTheme)
  }
})

watch(() => props.readonly, (newReadonly) => {
  if (editor) {
    editor.updateOptions({ readOnly: newReadonly })
  }
})

// Lifecycle
onMounted(async () => {
  await nextTick()
  await initializeEditor()
})

onUnmounted(() => {
  if (editor) {
    editor.dispose()
    editor = null
  }
})

// Expose editor instance for parent components
defineExpose({
  getEditor: () => editor,
  focus: () => editor?.focus(),
  blur: () => editor?.getAction('editor.action.blur')?.run()
})
</script>

<style scoped>
.monaco-editor-container {
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  overflow: hidden;
  background: rgba(255, 255, 255, 0.7);
  backdrop-filter: blur(8px);
}

.monaco-editor-container :deep(.monaco-editor) {
  background: transparent !important;
}

.monaco-editor-container :deep(.monaco-editor .margin) {
  background: transparent !important;
}

.monaco-editor-container :deep(.monaco-editor .monaco-editor-background) {
  background: transparent !important;
}
</style>