import { AUDIO_LOG_THEMES } from "../models/AudioLogPageModel.js";

export const MODULE_ID = "foundry-audiolog";

/**
 * Factory that creates the AudioLogPageSheet class at runtime.
 * Must be called inside the `init` hook.
 */
export function createAudioLogPageSheet() {
  // fvtt-types V13 stubs for JournalEntryPageHandlebarsSheet are incomplete ("TODO: Stub").
  // Cast to `any` to allow class extension without type errors.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const BaseSheet = foundry.applications.sheets.journal
    .JournalEntryPageHandlebarsSheet as any;

  return class AudioLogPageSheet extends BaseSheet {
    static DEFAULT_OPTIONS = {
      classes: ["audiolog-page-sheet"],
      form: {
        submitOnChange: true,
      },
    };

    static PARTS = {
      content: {
        template: `modules/${MODULE_ID}/templates/stub-view.hbs`,
      },
    };

    async _prepareContext(options: object) {
      // fvtt-types stub for super._prepareContext may not accept `object` — cast to suppress.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const context = await super._prepareContext(options as any);

      // `this.document` is typed as the base Document; cast to access `.system`
      // which is populated at runtime by the registered TypeDataModel.
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const page = this.document as any;

      // `isView` distinguishes the view (player) vs. edit (GM) render mode.
      // It exists at runtime on JournalEntryPageSheet but is absent from fvtt-types stubs.
      const isView = (this as any).isView ?? true;

      return {
        ...context,
        system: page.system,
        isView,
        themeChoices: Object.fromEntries(
          AUDIO_LOG_THEMES.map((t) => [
            t,
            // `game.i18n` is always defined inside `init` and later hooks at runtime;
            // fvtt-types marks it as potentially undefined — cast to suppress.
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (game.i18n as any).localize(`AUDIOLOG.themes.${t}`),
          ]),
        ),
      };
    }
  };
}
