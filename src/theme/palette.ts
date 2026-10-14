// The single source of colours and font stacks: CSS variables and the PDF all read from here.
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
  success: '#067647',
  // the app icon (public/favicon.svg); not used in the UI chrome
  brandInk: '#111111',
  brandAccent: '#FF5A1F'
} as const;

export const fonts = {
  ui: "system-ui, -apple-system, 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
  math: "'STIX Two Text', 'Cambria Math', Cambria, 'Times New Roman', serif",
  mono: "'JetBrains Mono', ui-monospace, Menlo, Consolas, monospace"
} as const;

export const type = {
  xs: '0.6875rem', // labels, gutters
  sm: '0.8125rem', // meta, hints, empty states
  md: '0.875rem', // body, fields
  lg: '1rem', // results
  xl: '1.375rem' // page title
} as const;

export const space = { 1: '2px', 2: '4px', 3: '8px', 4: '12px', 5: '16px', 6: '24px', 7: '32px', 8: '48px' } as const;

export const symbolSize = { sm: '1.05rem', md: '1.3rem', lg: '1.6rem' } as const;

export const radius = 3;
export const rowHeight = '36px';
