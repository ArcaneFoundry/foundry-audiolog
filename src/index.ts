/**
 * Foundry Audiology — Audio Logs for Foundry VTT
 *
 * Registers a custom "audiolog" JournalEntryPage type with themed visual
 * treatments, audio playback controls, and optional transcripts.
 */

import "./styles/index.css";
import { createAudioLogPageModel, DEFAULT_THEME_IMAGES } from "./models/AudioLogPageModel.js";
import { createAudioLogPageSheet, MODULE_ID } from "./sheets/AudioLogPageSheet.js";

const PAGE_TYPE = `${MODULE_ID}.audiolog`;

/**
 * Auto-set the default theme image when a GM changes the theme
 * and the imagePath field is currently empty.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
Hooks.on("preUpdateJournalEntryPage", (page: any, changes: any, _options: any, _userId: any) => {
  // Only act on our page type
  if (page.type !== PAGE_TYPE) return;

  // Only act when theme is changing
  const newTheme = changes?.system?.theme;
  if (!newTheme) return;

  const changesImagePath = changes?.system?.imagePath;
  const currentImage = page.system.imagePath;
  const defaultImages = new Set(Object.values(DEFAULT_THEME_IMAGES));
  const isDefault = defaultImages.has(currentImage);
  const defaultImage = DEFAULT_THEME_IMAGES[newTheme as keyof typeof DEFAULT_THEME_IMAGES];

  // If the GM is explicitly setting a custom (non-default) image, don't interfere.
  if (changesImagePath && !defaultImages.has(changesImagePath)) return;

  // If the current imagePath is a custom GM-provided image and not being changed, leave it.
  if (currentImage && !isDefault && !changesImagePath) return;

  if (defaultImage) {
    changes.system.imagePath = defaultImage;
  }
});

Hooks.once("init", () => {
  console.log(`${MODULE_ID} | Initializing`);

  // Create classes (runtime resolution of Foundry globals)
  const AudioLogPageModel = createAudioLogPageModel();
  const AudioLogPageSheet = createAudioLogPageSheet();

  // Register the audiolog page type data model
  // Cast to `any` because the factory returns a class extending `TypeDataModel as any`,
  // which doesn't satisfy the strict CONFIG.JournalEntryPage.dataModels index type.
  (CONFIG.JournalEntryPage.dataModels as any)[PAGE_TYPE] = AudioLogPageModel;

  // Register the sheet as the default for audiolog pages.
  // Cast sheet to `any` because fvtt-types expects a specific ApplicationV2 subtype
  // that our factory-returned class doesn't statically satisfy.
  foundry.applications.apps.DocumentSheetConfig.registerSheet(
    JournalEntryPage as any,
    MODULE_ID,
    AudioLogPageSheet as any,
    {
      types: [PAGE_TYPE],
      makeDefault: true,
      label: "AUDIOLOG.pageType",
    }
  );

  // Preload templates
  foundry.applications.handlebars.loadTemplates([
    `modules/${MODULE_ID}/templates/audio-log-view.hbs`,
    `modules/${MODULE_ID}/templates/audio-log-edit.hbs`,
  ]);
});

Hooks.once("ready", () => {
  console.log(`${MODULE_ID} | Ready`);
});
