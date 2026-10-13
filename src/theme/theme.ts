import type { ThemeConfig } from 'antd';
import { fonts, palette, radius, type } from './palette';

export const getTheme = (reducedMotion: boolean): ThemeConfig => ({
  token: {
    colorPrimary: palette.accent700,
    colorInfo: palette.accent700,
    colorLink: palette.accent700,
    colorText: palette.ink,
    colorTextSecondary: palette.inkMuted,
    colorTextTertiary: palette.inkSubtle,
    colorBorder: palette.lineStrong,
    colorBorderSecondary: palette.line,
    colorSplit: palette.line,
    colorFillTertiary: palette.accent50,
    colorFillSecondary: palette.accent100,
    colorBgLayout: palette.surfaceAlt,
    colorError: palette.danger,
    colorWarning: palette.warning,
    colorSuccess: palette.success,
    borderRadius: radius,
    borderRadiusSM: radius,
    borderRadiusLG: radius,
    fontSize: parseFloat(type.md) * 16,
    colorBgTextHover: palette.accent100,
    colorBgTextActive: palette.accent200,
    controlOutline: palette.accent200,
    controlHeight: 30,
    fontFamily: fonts.ui,
    fontFamilyCode: fonts.mono,
    wireframe: true,
    motion: !reducedMotion,
    motionDurationMid: '0.15s'
  },
  components: {
    InputNumber: { fontFamily: fonts.mono },
    Segmented: { trackBg: palette.accent100, itemSelectedBg: palette.surface, itemColor: palette.inkMuted },
    Button: { primaryShadow: 'none', defaultShadow: 'none', dangerShadow: 'none' },
    Tooltip: { colorBgSpotlight: palette.ink },
    Slider: { railBg: palette.line, railHoverBg: palette.lineStrong, trackBg: palette.accent500, trackHoverBg: palette.accent700 },
    Table: { headerBg: palette.surfaceAlt, headerColor: palette.inkMuted, cellPaddingBlockSM: 4 }
  }
});
