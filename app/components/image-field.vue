<script setup>
const props = defineProps({ modelValue: { type: String, default: "" } });
const emit = defineEmits(["update:modelValue"]);

const archivo = ref(null);
const cargando = ref(false);
const error = ref("");

async function onFile(e) {
  const file = e.target.files[0];
  if (!file) return;

  cargando.value = true;
  error.value = "";
  try {
    const url = await useSubirImagen(file); 
    emit("update:modelValue", url);
  } catch (err) {
    error.value = err.message;
  } finally {
    cargando.value = false;
    e.target.value = "";
  }
}
</script>

<template>
  <div>
    <div style="display: flex; gap: 8px">
      <input
        type="text"
        placeholder="https://..."
        :value="modelValue"
        @input="emit('update:modelValue', $event.target.value)"
        style="flex: 1"
      />
      <button type="button" :disabled="cargando" @click="archivo.click()">
        {{ cargando ? "Subiendo..." : "Subir imagen" }}
      </button>
    </div>

    <input ref="archivo" type="file" accept="image/*" hidden @change="onFile" />

    <p v-if="error" style="color: red">{{ error }}</p>
    <img v-if="modelValue" :src="modelValue" style="max-width: 160px; margin-top: 8px" />
  </div>
</template>