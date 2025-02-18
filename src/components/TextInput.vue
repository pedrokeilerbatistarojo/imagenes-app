<template>
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
