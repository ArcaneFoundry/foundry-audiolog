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

  // If imagePath is being explicitly set/cleared in this same update, don't interfere
  const imageInChanges = "imagePath" in (changes?.system ?? {});
  if (imageInChanges) return;

  // Only act when the document's current imagePath is empty
  if (page.system.imagePath) return;

  // newTheme being truthy guarantees changes.system exists
  const defaultImage = DEFAULT_THEME_IMAGES[newTheme as keyof typeof DEFAULT_THEME_IMAGES];
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

  // Register the stub sheet as the default for audiolog pages.
  // Cast sheet to `any` because fvtt-types expects a specific ApplicationV2 subtype
  // that our factory-returned class doesn't statically satisfy.
  // Cast JournalEntryPage to `any` because the global may not be typed in fvtt-types.
  DocumentSheetConfig.registerSheet(
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
  loadTemplates([
    `modules/${MODULE_ID}/templates/audio-log-view.hbs`,
    `modules/${MODULE_ID}/templates/audio-log-edit.hbs`,
  ]);
});

Hooks.once("ready", () => {
  console.log(`${MODULE_ID} | Ready`);
});
