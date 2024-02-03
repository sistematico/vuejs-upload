<script setup lang="ts">
const url = 'http://localhost:3000/upload';
const fileInput = document.getElementById('file-upload') as HTMLElement;

fileInput.addEventListener('change', handleFileUpload);

function handleFileUpload(event: Event) {
  const files = (event.target as HTMLInputElement).files;
  if (!files) return;

  const chunkSize = 1024 * 1024; // size of each chunk (1MB)
  let start = 0;

  for (const file of files) {
    while (start < file.size) {
      uploadChunk(file.slice(start, start + chunkSize));
      start += chunkSize;
    }
  }
}

function uploadChunk(chunk: string | Blob) {
  const formData = new FormData();
  formData.append('file', chunk);
  fetch(url, { method: 'POST', body: formData });
}
</script>
<template>
  <section class="section">
    <div class="container">
      <h1 class="title">Upload</h1>
      <p class="subtitle">Vue.js Upload Chunks</p>
      <div class="file">
        <label class="file-label">
          <input
            class="file-input"
            type="file"
            name="resume"
            @change="handleFileUpload"
          />
          <span class="file-cta">
            <span class="file-icon">
              <i class="fas fa-upload"></i>
            </span>
            <span class="file-label"> Choose a file… </span>
          </span>
        </label>
      </div>
    </div>
  </section>
</template>
