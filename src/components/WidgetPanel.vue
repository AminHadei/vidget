<script setup lang="ts">
import { useWidgetConfig } from "../composables/useWidgetShell";
import IconClose from "./icons/IconClose.vue";

const props = defineProps<{
  showClose?: boolean;
}>();

const emit = defineEmits<{
  close: [];
}>();

const config = useWidgetConfig();
</script>

<template>
  <div class="vd-panel">
    <header class="vd-header">
      <div class="vd-header-text">
        <span class="vd-title">{{ config.title }}</span>
        <span class="vd-subtitle">{{ config.subtitle }}</span>
      </div>
      <div class="vd-header-actions">
        <button
          v-if="props.showClose"
          type="button"
          class="vd-icon-btn"
          title="Close"
          aria-label="Close"
          @click="emit('close')"
        >
          <IconClose icon-class="vd-icon" />
        </button>
      </div>
    </header>

    <div class="vd-content">
      <p class="vd-content-lead">
        Your widget content goes here.
      </p>
      <p>
        Edit <code class="vd-code">src/components/WidgetPanel.vue</code> to implement
        your UI. The shell, mount logic, and public API stay unchanged.
      </p>
      <p>
        Use <code class="vd-code">config.apiBase</code> (currently
        <code class="vd-code">{{ config.apiBase }}</code>) for backend requests. Configure it via
        <code class="vd-code">Vidget.init()</code>,
        <code class="vd-code">window.VidgetConfig</code>, or
        <code class="vd-code">data-api-base</code> on the script tag.
      </p>
      <p>
        Adjust layout and monochrome styling in
        <code class="vd-code">src/styles.css</code>.
      </p>
    </div>
  </div>
</template>
