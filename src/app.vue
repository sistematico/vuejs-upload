<script setup lang="ts">
import { ref } from 'vue'

interface Queue {
  file: Blob;
  size: number;
  name: string;
}

const url = 'http://localhost:3000/upload'
const queue = ref<Queue[]>([])
const status = ref('')

// function handleFileUpload(event: Event) {
//   const files = (event.target as HTMLInputElement).files
//   if (!files) return

//   const chunkSize = 1024 * 1024 // size of each chunk (1MB)
//   let start = 0

//   for (const file of files) {
//     while (start < file.size) {
//       uploadChunk(file.slice(start, start + chunkSize))
//       start += chunkSize
//     }
//   }
// }

function addQueue(event: Event) {
  const files = (event.target as HTMLInputElement).files
  if (!files) return

  for (const file of files) {
    queue.value.push({ file, name: file.name, size: file.size })
  }
}

function uploadFiles() {
  if (queue.value.length === 0) return
  const files = queue.value
  
  for (const file of files) {
    uploadChunk(file)
  }
}

async function uploadChunk(file: Queue) {
  const formData = new FormData()
  // const headers = new Headers()

  const chunkSize = 1024 * 1024 // size of each chunk (1MB)
  let start = 0

  while (start < file.file.size) {
    const chunk = file.file.slice(start, start + chunkSize)
    formData.append('files', chunk)
    status.value = await (await fetch(url, { method: 'POST', body: formData })).text()
    start += chunkSize
  }
}
</script>
<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Upload</h1>
      <p class="subtitle">Vue.js Upload Chunks</p>
      <p class="subtitle">{{ status }}</p>
      
      <div class="field">
        <div class="file">
          <label class="file-label">
            <input class="file-input" type="file" name="resume" @change="addQueue" />
            <span class="file-cta">
              <span class="file-icon">
                <i class="fas fa-upload"></i>
              </span>
              <span class="file-label"> Escolha um arquivo... </span>
            </span>
          </label>
        </div>
      </div>
      <div class="field" v-for="q in queue" v-if="queue.length > 0">
        <div class="tile notification is-primary">
          <p class="subtitle">{{ q.name }}</p>
        </div>
      </div>
      <div class="field is-grouped">
        <div class="control">
          <button class="button is-link" @click="uploadFiles">Enviar</button>
        </div>
        <div class="control">
          <button class="button is-link is-light">Cancel</button>
        </div>
      </div>
    </div>
  </section>
</template>
