/**
 * Host half of the session-copy-plus bundle.
 *
 * The feature is browser-only: it reads the finalized answer already rendered
 * in the Chat DOM and writes a PNG or rich-text HTML flavour to the clipboard.
 * No Host service, route, or session read is needed, so this half only keeps
 * the bundle row mountable.
 */

/** Loader row name. */
export const name = 'session-copy-plus'

/** Mount the bundle row. */
export function apply() {}
