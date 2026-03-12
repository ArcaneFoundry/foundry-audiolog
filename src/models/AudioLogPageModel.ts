/**
 * Theme identifiers for audio log visual treatments.
 */
export const AUDIO_LOG_THEMES = [
  "generic",
  "fantasy",
  "steampunk",
  "cyberpunk",
  "modern",
  "futuristic",
] as const;

export type AudioLogTheme = (typeof AUDIO_LOG_THEMES)[number];

/**
 * Factory that creates the AudioLogPageModel class at runtime.
 * Must be called inside the `init` hook — Foundry globals are not
 * available at ES module parse time.
 */
export function createAudioLogPageModel() {
  const fields = foundry.data.fields;

  // TypeDataModel requires Schema and Parent type args at compile time;
  // the actual schema is defined in defineSchema() at runtime.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return class AudioLogPageModel extends (foundry.abstract.TypeDataModel as any) {
    static defineSchema() {
      return {
        audioPath: new fields.FilePathField({
          required: false,
          categories: ["AUDIO"],
        }),
        imagePath: new fields.FilePathField({
          required: false,
          categories: ["IMAGE"],
        }),
        theme: new fields.StringField({
          required: true,
          initial: "generic",
          choices: AUDIO_LOG_THEMES.reduce(
            (acc, t) => ({ ...acc, [t]: `AUDIOLOG.themes.${t}` }),
            {} as Record<string, string>,
          ),
        }),
        transcript: new fields.HTMLField({
          required: false,
          blank: true,
        }),
        controls: new fields.SchemaField({
          play: new fields.BooleanField({ initial: true }),
          pause: new fields.BooleanField({ initial: true }),
          stop: new fields.BooleanField({ initial: true }),
        }),
      };
    }
  };
}
