import { AUDIO_LOG_THEMES } from "../models/AudioLogPageModel.js";

export const MODULE_ID = "foundry-audiolog";

/**
 * Factory that creates the AudioLogPageSheet class at runtime.
 * Must be called inside the `init` hook — Foundry globals are not
 * available at ES module parse time.
 */
export function createAudioLogPageSheet() {
  // fvtt-types V13 stubs for JournalEntryPageHandlebarsSheet are incomplete ("TODO: Stub").
  // Cast to `any` to allow class extension without type errors.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const BaseSheet = foundry.applications.sheets.journal
    .JournalEntryPageHandlebarsSheet as any;

  class AudioLogPageSheet extends BaseSheet {
    /**
     * Currently playing Sound instance, or null if nothing is playing.
     * Used by pause/stop handlers and cleaned up on close().
     */
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    _currentSound: any = null;

    static DEFAULT_OPTIONS = {
      classes: ["audiolog-page-sheet"],
      form: {
        submitOnChange: true,
      },
      actions: {} as Record<string, Function>,
    };

    /**
     * Edit mode parts: parent header + our content + parent footer.
     * Follows the same pattern as JournalEntryPageImageSheet etc.
     */
    static EDIT_PARTS = {
      header: (BaseSheet as any).EDIT_PARTS.header,
      content: {
        template: `modules/${MODULE_ID}/templates/audio-log-edit.hbs`,
        classes: ["standard-form"],
      },
      footer: (BaseSheet as any).EDIT_PARTS.footer,
    };

    /**
     * View mode parts: just our content template.
     */
    static VIEW_PARTS = {
      content: {
        template: `modules/${MODULE_ID}/templates/audio-log-view.hbs`,
        scrollable: [".audiolog-view"],
      },
    };

    async _prepareContext(options: object) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const context = await super._prepareContext(options as any);

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const page = this.document as any;
      const isView = (this as any).isView ?? true;

      return {
        ...context,
        system: page.system,
        isView,
        hasAudio: !!page.system.audioPath,
        imageSrc: page.system.imagePath || null,
        themeChoices: Object.fromEntries(
          AUDIO_LOG_THEMES.map((t) => [
            t,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (game.i18n as any).localize(`AUDIOLOG.themes.${t}`),
          ]),
        ),
      };
    }

    // --- Action Handlers ---
    // Static methods referenced by DEFAULT_OPTIONS.actions.
    // In ApplicationV2, action handlers receive (event, target) and `this`
    // is the application instance.

    /**
     * Play audio. Resumes if paused, otherwise starts fresh.
     */
    static async onPlay(this: InstanceType<typeof AudioLogPageSheet>, _event: Event, _target: HTMLElement) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const page = this.document as any;
      const audioPath = page.system.audioPath;
      if (!audioPath) return;

      // If we have a paused sound, resume it.
      // Sound.paused is a boolean getter in Foundry V13.
      if (this._currentSound && this._currentSound.paused) {
        this._currentSound.play();
        return;
      }

      // Start fresh playback
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const volume = (game.settings as any).get("core", "globalInterfaceVolume");
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this._currentSound = await (foundry.audio as any).AudioHelper.play({
        src: audioPath,
        volume: volume ?? 0.5,
        loop: false,
      });
    }

    /**
     * Pause the currently playing sound.
     */
    static onPause(this: InstanceType<typeof AudioLogPageSheet>, _event: Event, _target: HTMLElement) {
      if (!this._currentSound) return;
      this._currentSound.pause();
    }

    /**
     * Stop the currently playing sound and clear the reference.
     */
    static onStop(this: InstanceType<typeof AudioLogPageSheet>, _event: Event, _target: HTMLElement) {
      if (!this._currentSound) return;
      this._currentSound.stop();
      this._currentSound = null;
    }

    /**
     * Open a FilePicker for audio file selection.
     */
    static onBrowseAudio(this: InstanceType<typeof AudioLogPageSheet>, _event: Event, _target: HTMLElement) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const page = this.document as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new (FilePicker as any)({
        type: "audio",
        current: page.system.audioPath ?? "",
        callback: (path: string) => {
          page.update({ "system.audioPath": path });
        },
      }).render(true);
    }

    /**
     * Open a FilePicker for image file selection.
     */
    static onBrowseImage(this: InstanceType<typeof AudioLogPageSheet>, _event: Event, _target: HTMLElement) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const page = this.document as any;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      new (FilePicker as any)({
        type: "image",
        current: page.system.imagePath ?? "",
        callback: (path: string) => {
          page.update({ "system.imagePath": path });
        },
      }).render(true);
    }

    /**
     * Stop any playing audio before the sheet closes.
     */
    async close(options?: object) {
      this._currentSound?.stop();
      this._currentSound = null;
      return super.close(options);
    }
  }

  // Assign actions after class definition — self-references like
  // AudioLogPageSheet.onPlay don't work inside the class expression body
  // because the class name isn't bound until the expression completes.
  Object.assign(AudioLogPageSheet.DEFAULT_OPTIONS.actions, {
    play: AudioLogPageSheet.onPlay,
    pause: AudioLogPageSheet.onPause,
    stop: AudioLogPageSheet.onStop,
    browseAudio: AudioLogPageSheet.onBrowseAudio,
    browseImage: AudioLogPageSheet.onBrowseImage,
  });

  return AudioLogPageSheet;
}
