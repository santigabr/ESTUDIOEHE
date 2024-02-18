<script setup lang="ts">
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import { BubbleMenu, FloatingMenu } from '@tiptap/vue-3'

const props = defineProps<{ modelValue: string, image?: boolean }>()

const emit = defineEmits(['update:modelValue'])

const editor = useEditor({
  content: props.modelValue,
  extensions: [StarterKit, Image],
  onUpdate: ({ editor }) => {
    emit('update:modelValue', editor.getHTML())
  },
})

const fileInput = ref<HTMLInputElement | null>(null)

function addImage() {
  fileInput.value?.click()
}

function onFileChange(e: Event) {
  const file = (e.target as HTMLInputElement).files?.[0]
  if (file && editor.value) {
    const reader = new FileReader()
    reader.onload = function (e) {
      const result = e.target?.result
      if (typeof result === 'string')
        editor.value?.chain().focus().setImage({ src: result }).run()
    }
    reader.readAsDataURL(file)
  }
}
</script>

<template>
  <div class="z-0 flex items-center">
    <div class="w-full bg-gris-900/30 shadow-sm rounded-md border border-gris-900">
      <BubbleMenu
        v-if="editor"
        :editor="editor"
        :tippy-options="{ duration: 100 }"
        class="bg-white text-zinc-700 flex items-center p-2 rounded-3xl border-zinc-200 shadow-2xl"
      >
        <button class="flex items-center text-sm border-r p-2 rounded-sm mx-1 border-none" :class="{ 'bg-slate-200': editor.isActive('bold') }" @click="editor.chain().focus().toggleBold().run()">
          <UnoIcon class="i-ooui-bold-b w-1em h-1em" />
        </button>
        <button class="flex items-center text-sm border-r p-2 rounded-sm mx-1 border-none" :class="{ 'bg-slate-200': editor.isActive('italic') }" @click="editor.chain().focus().toggleItalic().run()">
          <UnoIcon class="i-ooui-italic-i w-1em h-1em" />
        </button>
        <button class="flex items-center text-sm border-r p-2 rounded-sm mx-1 border-none" :class="{ 'bg-slate-200': editor.isActive('strike') }" @click="editor.chain().focus().toggleStrike().run()">
          <UnoIcon class="i-ooui-strikethrough-s w-1em h-1em" />
        </button>
      </BubbleMenu>
      <FloatingMenu v-if="editor" :editor="editor" :tippy-options="{ duration: 100 }" class="bg-white text-zinc-700 flex items-center p-2 rounded-md left-20">
        <button class="flex items-center bg-gris-500 text-white text-sm border-r p-2 rounded-sm mx-1" :class="{ 'bg-slate-200': editor.isActive('heading', { level: 2 }) }" @click="editor.chain().focus().toggleHeading({ level: 2 }).run()">
          <UnoIcon class="i-bi-type-h2 w-1em h-1em" />
        </button>
        <button class="flex items-center bg-gris-500 text-white text-sm border-r p-2 rounded-sm mx-1" :class="{ 'bg-slate-200': editor.isActive('heading', { level: 3 }) }" @click="editor.chain().focus().toggleHeading({ level: 3 }).run()">
          <UnoIcon class="i-bi-type-h3 w-1em h-1em" />
        </button>
        <button class="flex items-center bg-gris-500 text-white text-sm border-r p-2 rounded-sm mx-1" :class="{ 'bg-slate-200': editor.isActive('bulletList') }" @click="editor.chain().focus().toggleBulletList().run()">
          <UnoIcon class="i-bi-list-ul w-1em h-1em" />
        </button>
        <button class="flex items-center bg-gris-500 text-white text-sm border-r p-2 rounded-sm mx-1" :class="{ 'bg-slate-200': editor.isActive('orderedList') }" @click="editor.chain().focus().toggleOrderedList().run()">
          <UnoIcon class="i-bi-list-ol w-1em h-1em" />
        </button>
        <button v-if="props.image" class="flex items-center bg-gris-500 text-white text-sm border-r p-2 rounded-sm mx-1" @click="addImage">
          <UnoIcon class="i-bi-image w-1em h-1em" />
        </button>
        <input v-if="props.image" ref="fileInput" type="file" class="hidden" @change="onFileChange">
      </FloatingMenu>
      <div class="px-4 prose lg:prose-md max-w-full">
        <TiptapEditorContent :editor="editor" />
      </div>
    </div>
  </div>
</template>

<style>
.ProseMirror{
  outline: none;
  min-height: 400px;
}
</style>
