/**
 * Loop timing constants.
 *
 * Two separate cadences (CLAUDE.md non-negotiable):
 *  - LOGIC_TICK_MS drives the Decimal balance accrual on the JS thread.
 *  - UI_REFRESH_MS drives how often the on-screen numbers re-render. It is
 *    deliberately slower so we never re-render the tree every logic tick.
 */
export const LOGIC_TICK_MS = 250;
export const UI_REFRESH_MS = 500;
export const AUTOSAVE_MS = 15_000;

/**
 * Clamp for a single foreground tick's delta. Guards against a stalled JS
 * thread awarding a huge jump; genuine long gaps (app backgrounded) are handled
 * separately by the offline-earnings calculation.
 */
export const MAX_TICK_SECONDS = 1;
