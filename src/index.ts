/**
 * Foundry Audiology — Audio Logs for Foundry VTT
 *
 * Registers a custom "audiolog" JournalEntryPage type with themed visual
 * treatments, audio playback controls, and optional transcripts.
 */

import { createAudioLogPageModel } from "./models/AudioLogPageModel.js";
import { createAudioLogPageSheet, MODULE_ID } from "./sheets/AudioLogPageSheet.js";

const PAGE_TYPE = `${MODULE_ID}.audiolog`;

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
  loadTemplates([`modules/${MODULE_ID}/templates/stub-view.hbs`]);
});

Hooks.once("ready", () => {
  console.log(`${MODULE_ID} | Ready`);
});
