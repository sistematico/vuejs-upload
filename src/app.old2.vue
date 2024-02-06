<script setup lang="ts">
import { ref } from 'vue'

interface Queue {
  file: File;
  size: number;
  name: string;
}

const url = 'http://localhost:3000/upload'
const queue = ref<Queue[]>([])
const status = ref('')

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

  queue.value = []
}

async function uploadChunk(queue: Queue) {
  const formData = new FormData()
  const file = queue.file
  const name = queue.name
  const chunkSize = 1024 * 1024 // size of each chunk (1MB)
  // const totalChunks = queue.file.byteLength / CHUNK_SIZE;
  const totalChunks = queue.size / chunkSize;
  let start = 0

  console.log("Total Chunks", totalChunks)
 

  //while (start < file.size) {
  for (let chunk = 0; chunk < totalChunks + 1; chunk++) {
    // let CHUNK = content.slice(chunk * CHUNK_SIZE, (chunk + 1) * CHUNK_SIZE)
    const CHUNK = file.slice(start, start + chunkSize)
    formData.append('files', CHUNK)

    // console.log(start)
    
    status.value = await (await fetch(url + '/' + name, { 
      method: 'POST', 
      body: formData 
    })).text()

    start += chunkSize

    console.log(`Current Chunk ${chunk}, Slice: ${start}`)
  }
}


                    



// for (let chunk = 0; chunk < totalChunks + 1; chunk++) {
//     let CHUNK = content.slice(chunk * CHUNK_SIZE, (chunk + 1) * CHUNK_SIZE)

//     await fetch('/upload?fileName=' + fileName, {
//         'method' : 'POST',
//         'headers' : {
//             'content-type' : "application/octet-stream",
//             'content-length' : CHUNK.length
//         },
//         'body' : CHUNK
//     })
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
