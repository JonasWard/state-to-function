import { upgradeLegacy } from '../legacy';
import { decodeApplet, encodeApplet } from '../model/appletSchema';
import { decodeDefinition, encodeDefinition, QR_BASE } from '../model/codec';
import { DEFAULT_DEFINITION } from '../model/defaults';
import { useDocumentStore } from './documentStore';
import { formatHash, formatQrUrl, parseHash, parseLocation, ParsedHash } from './hash';
import { notify } from './notify';
import { useUIStore } from './uiStore';

const UNREADABLE = 'This link could not be read, showing the example instead.';

/** Loads the state a hash describes. Resolves to false when the hash should be left untouched (legacy chunk failed). */
const loadFromHash = async (
  { view, definition, applet, encoding }: ParsedHash,
  mode: 'reset' | 'push'
): Promise<boolean> => {
  const base = encoding === 'qr' ? QR_BASE : undefined;
  const doc = useDocumentStore.getState();
  const setView = () => useUIStore.getState().setView(view ?? (applet ? 'applet' : 'edit'));
  if (!definition) {
    if (mode === 'reset') doc.load(DEFAULT_DEFINITION, [], 'reset');
    setView();
    return true;
  }
  const decoded = decodeDefinition(definition, base);
  if (decoded.ok) {
    const { ok, overrides } = decodeApplet(decoded.definition, applet ?? '', base);
    if (!ok) notify.warning('The applet values in this link no longer match its definition and were reset.');
    doc.load(decoded.definition, overrides, mode);
    setView();
    return true;
  }
  if (decoded.reason === 'legacy') {
    doc.setStatus('upgrading');
    try {
      const result = await upgradeLegacy(definition, applet ?? undefined);
      if (result.ok) {
        doc.load(result.definition, result.overrides, mode);
        notify.info('Link upgraded from an older version.');
        if (!result.appletOk) notify.warning('The applet values in this link could not be read and were reset.');
      } else {
        notify.warning(UNREADABLE);
        doc.load(DEFAULT_DEFINITION, [], mode);
      }
      setView();
      return true;
    } catch (e) {
      console.error(e);
      notify.error('Could not load the converter for this older link. Check your connection and reload.');
      return false;
    } finally {
      doc.setStatus('ready');
    }
  }
  // random strings often read as a high version number, so a "newer" link is only a possibility
  notify.warning(
    decoded.reason === 'newer-version'
      ? 'This link could not be read; it may come from a newer version of the app. Showing the example instead.'
      : UNREADABLE
  );
  doc.load(DEFAULT_DEFINITION, [], mode);
  setView();
  return true;
};

const currentHash = () => {
  const { defString, appletString } = useDocumentStore.getState();
  return formatHash(useUIStore.getState().view, defString, appletString);
};

const BASE = import.meta.env.BASE_URL;
const isCanonical = (hash: string) => window.location.pathname === BASE && window.location.hash === hash;

let booting = false;

/** Reads the initial location (hash, or a QR link's path) into the stores and rewrites it in canonical form. */
export const bootstrap = async () => {
  booting = true;
  const keep = await loadFromHash(parseLocation(window.location.pathname, window.location.hash, BASE), 'reset');
  booting = false;
  if (keep) history.replaceState(null, '', BASE + currentHash());
};

/**
 * Keeps the hash in sync with the stores: view changes add a browser history entry, edits replace it
 * (undo/redo covers edits). Back/forward and pasted links are loaded into the undo timeline.
 */
export const startHashSync = () => {
  let lastView = useUIStore.getState().view;
  let replaceNext = false;
  let hold = false;

  const write = () => {
    const view = useUIStore.getState().view;
    const viewChanged = view !== lastView;
    lastView = view;
    if (hold || booting || useDocumentStore.getState().status === 'upgrading') return;
    const hash = currentHash();
    if (isCanonical(hash)) return;
    if (viewChanged && !replaceNext) history.pushState(null, '', BASE + hash);
    else history.replaceState(null, '', BASE + hash);
    replaceNext = false;
  };

  const onHashChange = async () => {
    if (window.location.hash === currentHash()) return;
    replaceNext = true;
    hold = true;
    const keep = await loadFromHash(parseHash(window.location.hash), 'push');
    hold = false;
    lastView = useUIStore.getState().view;
    if (keep) write();
  };

  const unsubscribeDoc = useDocumentStore.subscribe(write);
  const unsubscribeUI = useUIStore.subscribe(write);
  window.addEventListener('hashchange', onHashChange);
  return () => {
    unsubscribeDoc();
    unsubscribeUI();
    window.removeEventListener('hashchange', onHashChange);
  };
};

/** Link to the current state; help is shared as the editor. */
export const buildShareUrl = () => {
  const { defString, appletString } = useDocumentStore.getState();
  const view = useUIStore.getState().view;
  const hash = formatHash(view === 'help' ? (appletString ? 'applet' : 'edit') : view, defString, appletString);
  return `${window.location.origin}${BASE}${hash}`;
};

/** The current state as an all-uppercase QR link, e.g. `HTTPS://JONASWARD.GITHUB.IO/STATE-TO-FUNCTION/Q/…`. */
export const buildQrUrl = () => {
  const { definition, overrides } = useDocumentStore.getState();
  return formatQrUrl(
    window.location.origin,
    BASE,
    encodeDefinition(definition, QR_BASE),
    encodeApplet(definition, overrides, QR_BASE)
  );
};
