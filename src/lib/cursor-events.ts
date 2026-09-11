// Custom event dispatched (bubbling) by any control that wants
// FocusIndicator to replay its press-shrink pulse on activation, even
// when the activation doesn't change that control's data-cursor value
// (e.g. re-clicking a "copy" button while it's still showing "copied") —
// a data-cursor mutation observer alone would miss that case, since
// nothing actually mutated.
export const CURSOR_PULSE_EVENT = "cursor-pulse";
