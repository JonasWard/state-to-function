// The single source of colours and font stacks: antd tokens, CSS variables and the PDF all read from here.
export const palette = {
  accent50: '#f7f7fd',
  accent100: '#efeffa',
  accent200: '#dedef4',
  accent300: '#bcbce8',
  accent500: '#7a77c2',
  accent700: '#4b4794',
  accent800: '#3a3778',
  ink: '#1c1b29',
  inkMuted: '#5f5d73',
  inkSubtle: '#8b89a0',
  line: '#dcdbe8',
  lineStrong: '#c4c3d6',
  surface: '#ffffff',
  surfaceAlt: '#fafafe',
  danger: '#b42318',
  dangerBg: '#fef3f2',
  warning: '#b54708',
  warningBg: '#fffaeb',
  success: '#067647'
} as const;

export const fonts = {
  ui: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
  math: "'STIX Two Text', 'Cambria Math', Cambria, 'Times New Roman', serif",
  mono: "'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace"
} as const;
