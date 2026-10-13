import type { MessageInstance } from 'antd/es/message/interface';

type Level = 'info' | 'success' | 'warning' | 'error';
type Api = Pick<MessageInstance, Level>;

let api: Api | null = null;
const pending: [Level, string][] = [];

/** Bound once antd's App context exists; messages raised earlier (e.g. while reading the URL) are queued. */
export const bindNotify = (a: Api) => {
  api = a;
  pending.splice(0).forEach(([level, text]) => a[level](text));
};

const send = (level: Level) => (text: string) => (api ? api[level](text) : pending.push([level, text]));

export const notify = { info: send('info'), success: send('success'), warning: send('warning'), error: send('error') };
