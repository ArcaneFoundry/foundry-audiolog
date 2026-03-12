/**
 * Foundry Audiology — Audio Logs for Foundry VTT
 *
 * Registers a custom "audiolog" JournalEntryPage type with themed visual
 * treatments, audio playback controls, and optional transcripts.
 */

const MODULE_ID = "foundry-audiolog";

Hooks.once("init", () => {
  console.log(`${MODULE_ID} | Initializing`);

  // TODO: Register audiolog JournalEntryPage data model
  // TODO: Register audiolog JournalPageSheet
  // TODO: Register module settings
  // TODO: Preload Handlebars templates
});

Hooks.once("ready", () => {
  console.log(`${MODULE_ID} | Ready`);

  // TODO: Any post-initialization setup
});
