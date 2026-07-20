<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from "vue";
import type { WidgetDisplay, WidgetHandle, WidgetMode } from "@/types";

function vidget() {
  if (!window.Vidget) {
    throw new Error(
      'Vidget bundle not loaded. Run "pnpm build:widget" or "pnpm dev" first.',
    );
  }
  return window.Vidget;
}

type SectionId =
  | "overview"
  | "customization"
  | "modes"
  | "display"
  | "api"
  | "config"
  | "playground"
  | "tooling";

const sections: Array<{ id: SectionId; label: string }> = [
  { id: "overview", label: "Overview" },
  { id: "customization", label: "Customization" },
  { id: "modes", label: "Mount modes" },
  { id: "display", label: "Display layouts" },
  { id: "api", label: "Public API" },
  { id: "config", label: "Configuration" },
  { id: "playground", label: "Live playground" },
  { id: "tooling", label: "Tooling" },
];

const mode = ref<WidgetMode>("floating");
const display = ref<WidgetDisplay>("bubble");
const position = ref<"right" | "left">("right");
const title = ref("Widget");
const subtitle = ref("Replace this panel with your own content");
const apiBase = ref("/api");
const bundleVersion = ref("—");

const overlayHandle = ref<WidgetHandle | null>(null);
const inlineHandle = ref<WidgetHandle | null>(null);

const scriptSnippet = computed(() => {
  const closeTag = "</" + "script>";
  return `<script
  src="https://cdn.example.com/vidget.js"
  data-vidget
  data-mode="floating"
  data-display="bubble"
  data-api-base="/api"
  data-trigger-selector="#open-support"
>${closeTag}`;
});

const initSnippet = computed(
  () => `window.Vidget.init({
  mode: "${mode.value}",
  display: "${display.value}",
  position: "${position.value}",
  title: "${title.value}",
  subtitle: "${subtitle.value}",
  apiBase: "${apiBase.value}",
  triggerSelector: "#open-support",
  container: "#inline-slot",
});`,
);

function destroyHandles() {
  overlayHandle.value?.destroy();
  inlineHandle.value?.destroy();
  overlayHandle.value = null;
  inlineHandle.value = null;
}

function mountOverlayDemo() {
  destroyHandles();
  if (mode.value === "inline") return;

  overlayHandle.value = vidget().init({
    mode: mode.value,
    display: display.value,
    position: position.value,
    title: title.value,
    subtitle: subtitle.value,
    apiBase: apiBase.value,
    triggerSelector: mode.value === "trigger" ? "#pg-trigger-btn" : null,
  });
}

function mountInlineDemo() {
  inlineHandle.value?.destroy();
  inlineHandle.value = vidget().init({
    mode: "inline",
    container: "#inline-slot",
    title: title.value,
    subtitle: subtitle.value,
    apiBase: apiBase.value,
  });
}

function remountAll() {
  mountOverlayDemo();
  mountInlineDemo();
}

function openOverlay() {
  overlayHandle.value?.open();
}

function closeOverlay() {
  overlayHandle.value?.close();
}

function toggleOverlay() {
  overlayHandle.value?.toggle();
}

onMounted(() => {
  bundleVersion.value = vidget().version;
  remountAll();
});

onBeforeUnmount(() => {
  destroyHandles();
});
</script>

<template>
  <div class="pg-layout">
    <aside class="pg-sidebar">
      <h1 class="pg-brand">
        Vidget
      </h1>
      <p class="pg-tagline">
        Vue 3 embeddable widget boilerplate · bundle v{{ bundleVersion }}
      </p>
      <nav class="pg-nav">
        <a
          v-for="section in sections"
          :key="section.id"
          :href="`#${section.id}`"
        >
          {{ section.label }}
        </a>
      </nav>
    </aside>

    <main class="pg-main">
      <section
        id="overview"
        class="pg-section"
      >
        <h2>Overview</h2>
        <p>
          The playground loads the production bundle from
          <code>dist/vidget.js</code> and <code>dist/vidget.css</code>, the same files
          you ship to host pages.
        </p>
        <p>
          The widget shell, mount modes, and display layouts are fully implemented.
          Panel content is a placeholder — replace it with your own UI.
        </p>
        <div class="pg-card">
          <strong>Quick start</strong>
          <pre class="pg-pre">
            pnpm install
            pnpm dev
          </pre>
        </div>
      </section>

      <section
        id="customization"
        class="pg-section"
      >
        <h2>Customization</h2>
        <p>
          Vidget provides the embed shell, mount modes, and display layouts. Replace the
          placeholder panel with your own UI.
        </p>
        <table class="pg-table">
          <thead>
            <tr>
              <th>Goal</th>
              <th>File</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Implement widget UI</td>
              <td><code>src/components/WidgetPanel.vue</code></td>
            </tr>
            <tr>
              <td>Adjust monochrome styling</td>
              <td><code>src/styles.css</code></td>
            </tr>
            <tr>
              <td>Read backend URL inside the panel</td>
              <td><code>useWidgetConfig()</code> → <code>config.apiBase</code></td>
            </tr>
            <tr>
              <td>Change defaults and script-tag parsing</td>
              <td><code>src/config.ts</code>, <code>src/types.ts</code></td>
            </tr>
          </tbody>
        </table>
        <p>
          Access configuration inside components via
          <code>useWidgetConfig()</code> from
          <code>src/composables/useWidgetShell.ts</code>.
        </p>
      </section>

      <section
        id="modes"
        class="pg-section"
      >
        <h2>Mount modes</h2>
        <table class="pg-table">
          <thead>
            <tr>
              <th>Mode</th>
              <th>Description</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="pg-badge">floating</span></td>
              <td>Built-in launcher button opens the widget shell.</td>
            </tr>
            <tr>
              <td><span class="pg-badge">trigger</span></td>
              <td>
                Host elements matched by <code>triggerSelector</code> open the shell.
              </td>
            </tr>
            <tr>
              <td><span class="pg-badge">inline</span></td>
              <td>Permanent embed inside <code>container</code>. No overlay.</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section
        id="display"
        class="pg-section"
      >
        <h2>Display layouts</h2>
        <p>
          Applies to <code>floating</code> and <code>trigger</code> only. Ignored by
          <code>inline</code>.
        </p>
        <table class="pg-table">
          <thead>
            <tr>
              <th>Display</th>
              <th>Behavior</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td><span class="pg-badge">bubble</span></td>
              <td>Fixed panel near the bottom corner (380×520px). No backdrop.</td>
            </tr>
            <tr>
              <td><span class="pg-badge">sidebar</span></td>
              <td>Full-height drawer from the left or right edge.</td>
            </tr>
            <tr>
              <td><span class="pg-badge">dialog</span></td>
              <td>Centered modal with backdrop.</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section
        id="api"
        class="pg-section"
      >
        <h2>Public API</h2>
        <pre class="pg-pre">
          window.Vidget.init(partialConfig?) =&gt; WidgetHandle
          window.Vidget.open()
          window.Vidget.close()
          window.Vidget.toggle()
          window.Vidget.version
          window.Vidget.destroy()
        </pre>
      </section>

      <section
        id="config"
        class="pg-section"
      >
        <h2>Configuration</h2>
        <p>
          Merge order: defaults → script <code>data-*</code> →
          <code>window.VidgetConfig</code> → <code>Vidget.init()</code>.
        </p>
        <h3>Script tag example</h3>
        <pre>{{ scriptSnippet }}</pre>
        <h3>Programmatic example</h3>
        <pre>{{ initSnippet }}</pre>
        <h3>Supported options</h3>
        <table class="pg-table">
          <thead>
            <tr>
              <th>Option</th>
              <th>Type</th>
              <th>Default</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>mode</td>
              <td>floating | trigger | inline</td>
              <td>floating</td>
            </tr>
            <tr>
              <td>display</td>
              <td>dialog | sidebar | bubble</td>
              <td>bubble</td>
            </tr>
            <tr>
              <td>position</td>
              <td>right | left</td>
              <td>right</td>
            </tr>
            <tr>
              <td>title</td>
              <td>string</td>
              <td>Widget</td>
            </tr>
            <tr>
              <td>subtitle</td>
              <td>string</td>
              <td>Replace this panel with your own content</td>
            </tr>
            <tr>
              <td>apiBase</td>
              <td>string</td>
              <td>/api</td>
            </tr>
            <tr>
              <td>container</td>
              <td>selector | HTMLElement</td>
              <td>null</td>
            </tr>
            <tr>
              <td>triggerSelector</td>
              <td>CSS selector</td>
              <td>null</td>
            </tr>
            <tr>
              <td>autoInit</td>
              <td>boolean</td>
              <td>true</td>
            </tr>
            <tr>
              <td>launcherLabel</td>
              <td>string</td>
              <td>Open widget</td>
            </tr>
          </tbody>
        </table>
      </section>

      <section
        id="playground"
        class="pg-section"
      >
        <h2>Live playground</h2>
        <div class="pg-card">
          <div class="pg-grid">
            <div class="pg-field">
              <label for="mode">Mount mode</label>
              <select
                id="mode"
                v-model="mode"
              >
                <option value="floating">
                  floating
                </option>
                <option value="trigger">
                  trigger
                </option>
                <option value="inline">
                  inline (overlay hidden)
                </option>
              </select>
            </div>
            <div class="pg-field">
              <label for="display">Display layout</label>
              <select
                id="display"
                v-model="display"
                :disabled="mode === 'inline'"
              >
                <option value="bubble">
                  bubble
                </option>
                <option value="sidebar">
                  sidebar
                </option>
                <option value="dialog">
                  dialog
                </option>
              </select>
            </div>
            <div class="pg-field">
              <label for="position">Position</label>
              <select
                id="position"
                v-model="position"
              >
                <option value="right">
                  right
                </option>
                <option value="left">
                  left
                </option>
              </select>
            </div>
            <div class="pg-field">
              <label for="title">Title</label>
              <input
                id="title"
                v-model="title"
                type="text"
              >
            </div>
            <div class="pg-field">
              <label for="subtitle">Subtitle</label>
              <input
                id="subtitle"
                v-model="subtitle"
                type="text"
              >
            </div>
            <div class="pg-field">
              <label for="apiBase">apiBase</label>
              <input
                id="apiBase"
                v-model="apiBase"
                type="text"
              >
            </div>
          </div>

          <div class="pg-actions">
            <button
              type="button"
              class="pg-btn"
              @click="remountAll"
            >
              Apply
            </button>
            <button
              id="pg-trigger-btn"
              type="button"
              class="pg-btn pg-btn--ghost"
            >
              Trigger button
            </button>
            <button
              type="button"
              class="pg-btn pg-btn--ghost"
              @click="openOverlay"
            >
              Open
            </button>
            <button
              type="button"
              class="pg-btn pg-btn--ghost"
              @click="closeOverlay"
            >
              Close
            </button>
            <button
              type="button"
              class="pg-btn pg-btn--ghost"
              @click="toggleOverlay"
            >
              Toggle
            </button>
          </div>
        </div>

        <h3>Inline container demo</h3>
        <div
          id="inline-slot"
          class="pg-inline-demo"
        />
      </section>

      <section
        id="tooling"
        class="pg-section"
      >
        <h2>Tooling</h2>
        <ul>
          <li><strong>Husky</strong> — pre-commit and commit-msg hooks</li>
          <li><strong>lint-staged</strong> — format and lint staged files</li>
          <li><strong>Commitlint</strong> — conventional commits</li>
          <li><strong>ESLint + Prettier + cspell</strong> — code quality</li>
          <li><strong>Vitest + vue-tsc</strong> — tests and type checking</li>
          <li><strong>Changesets</strong> — version management</li>
          <li><strong>GitHub Actions</strong> — CI on pull requests</li>
        </ul>
        <pre class="pg-pre">
          pnpm check
          pnpm build
          pnpm test
          pnpm preview
        </pre>
      </section>
    </main>
  </div>
</template>
