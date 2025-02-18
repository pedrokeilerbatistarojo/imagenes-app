<template>
<!--  <q-input-->
<!--    rounded-->
<!--    outlined-->
<!--    dense-->
<!--    :disable="disable"-->
<!--    v-model="textValue"-->
<!--    type="text"-->
<!--    :maxlength="maxSpaces"-->
<!--  />-->

  <q-input
    bottom-slots
    v-model="textValue"
    counter
    dense
    rounded
    outlined
    :disable="disable"
    :maxlength="maxSpaces"
  >
    <template v-slot:prepend>
      <q-icon name="search" />
    </template>
    <template v-slot:append>
      <q-icon name="close" @click="textValue = ''" class="cursor-pointer" />
    </template>

    <template v-slot:hint>
      Inserte las palabras claves para buscar imágenes
    </template>
  </q-input>
</template>

<script setup>
import {computed} from 'vue';

const props = defineProps({
  modelValue: [String, Number],
  disable: {
    type: Boolean,
    default: false,
  },
  maxSpaces: {
    type: Number,
    default: 60
  }
});

const emit = defineEmits(['update:modelValue']);

const textValue = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});
</script>
