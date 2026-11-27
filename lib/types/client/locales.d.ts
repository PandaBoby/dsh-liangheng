/**
 * Browser-half copy: zh-first dictionary with an English counterpart. The zh
 * side is the key-set source of truth; `packages/dsh-i18n` mirrors the keys
 * into the centralized ru dictionary and `pnpm i18n:check` enforces parity.
 */
/** Locale namespace this half owns. */
export declare const NS = "liangheng";
/** Browser-half copy, key source of truth. */
export declare const zh: {
    'lever.name': string;
    'burst.line1': string;
    'burst.line2': string;
    'settings.title': string;
    'settings.description': string;
    'settings.enabled': string;
    'settings.enabledHint': string;
    'settings.announceToAgent': string;
    'settings.announceToAgentHint': string;
    'settings.presentation': string;
    'settings.presentationHint': string;
    'settings.dispatcher': string;
    'settings.dispatcherHint': string;
    'settings.pagedToolPatterns': string;
    'settings.pagedToolPatternsHint': string;
    'settings.pagedToolPatternsInvalid': string;
    'settings.idleReclaimSteps': string;
    'settings.idleReclaimStepsHint': string;
    'settings.idleReclaimStepsInvalid': string;
    'settings.on': string;
    'settings.off': string;
    'settings.inherit': string;
    'settings.overridden': string;
    'settings.reset': string;
    'settings.notExposed': string;
    'settings.readOnly': string;
    'settings.expand': string;
    'settings.collapse': string;
    'settings.saveFailed': string;
    'settings.invalidValue': string;
    'presentation.ptc': string;
    'presentation.native': string;
    'diagram.graph': string;
    'diagram.code': string;
    'diagram.copy': string;
    'diagram.copied': string;
    'diagram.zoom': string;
    'diagram.close': string;
    'queue.count': string;
    'queue.expand': string;
    'queue.collapse': string;
    'queue.edit': string;
    'queue.editUnsupported': string;
    'queue.remove': string;
    'queue.removeThis': string;
    'queue.removeHint': string;
    'queue.more': string;
    'queue.steer': string;
    'queue.steerUnavailable': string;
    'queue.sending': string;
    'queue.pullingBack': string;
    'queue.image': string;
    'queue.file': string;
    'queue.pullBackFailed': string;
    'queue.pullBackLocked': string;
    'queue.removeFailed': string;
    'queue.steerFailed': string;
};
/** English counterpart; the key set mirrors {@link zh} exactly. */
export declare const en: Record<keyof typeof zh, string>;
/** Every key in the locale catalog. */
export type LiangShenKey = keyof typeof zh;
//# sourceMappingURL=locales.d.ts.map