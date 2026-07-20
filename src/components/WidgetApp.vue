<script setup lang="ts">
import { useWidgetShell } from "../composables/useWidgetShell";
import IconLauncher from "./icons/IconLauncher.vue";
import IconClose from "./icons/IconClose.vue";
import WidgetPanel from "./WidgetPanel.vue";

const { config, open, shellClass, backdropClass, launcherClass, close, openWidget } =
  useWidgetShell();
</script>

<template>
  <div v-if="config.mode === 'inline'" class="vd-inline">
    <WidgetPanel :show-close="false" />
  </div>

  <template v-else>
    <button
      v-if="config.mode === 'floating'"
      type="button"
      :class="launcherClass"
      :aria-label="config.launcherLabel"
      @click="openWidget"
    >
      <IconLauncher icon-class="vd-launcher-icon" />
    </button>

    <div :class="backdropClass" aria-hidden="true" @click="close" />

    <aside
      :class="shellClass"
      role="dialog"
      :aria-modal="config.display !== 'bubble'"
      :aria-hidden="!open"
    >
      <WidgetPanel show-close @close="close" />
    </aside>

    <button
      v-if="config.mode === 'floating' && open"
      type="button"
      class="vd-launcher vd-launcher--close"
      aria-label="Close widget"
      @click="close"
    >
      <IconClose icon-class="vd-launcher-icon" />
    </button>
  </template>
</template>
