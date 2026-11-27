/**
 * Parser for the `check` fence: a compact verification ledger.
 *
 * The wire format is one check per line, `✓ key: value`, where the leading mark
 * may be `✓`/`✗`/`·` and the separator may be ASCII `:` or full-width `：`.
 * A line without a separator is a value-only row (an empty key keeps the value
 * column aligned), and blank lines are ignored so the fence can be spaced out
 * for readability in the source.
 *
 * The fallback matters: a client without this plugin renders the fence as a
 * plain code block, so the line text must stay readable on its own — that is
 * why the mark and the key stay in the text instead of living in markup.
 */
/** One row's verdict. `info` is the neutral note row (no mark, or `·`). */
export type CheckStatus = 'pass' | 'fail' | 'info';
/** One parsed ledger row. */
export interface CheckItem {
    readonly status: CheckStatus;
    readonly key: string;
    readonly value: string;
}
/** A parsed fence plus whether any row failed. */
export interface CheckList {
    readonly items: readonly CheckItem[];
    readonly failed: boolean;
}
/**
 * Parse one `check` fence body.
 * @param code - the fence's raw text.
 * @returns the parsed rows in source order, and whether any row is a failure.
 */
export declare function parseCheckLines(code: string): CheckList;
//# sourceMappingURL=check-list.d.ts.map