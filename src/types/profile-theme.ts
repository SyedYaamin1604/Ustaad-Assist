/**
 * theme.ts
 * Central design tokens for the More & Settings screen so every
 * component references the same palette, radii and spacing instead
 * of repeating literal values inline.
 */

export const colors = {
  screenBg: "#F4F5F9",
  cardBg: "#FFFFFF",
  textPrimary: "#111114",
  textSecondary: "#6B7078",
  divider: "#EEEFF3",

  iconLavenderBg: "#EEEBFB",
  iconLavenderFg: "#5B4FCF",

  iconCreamBg: "#FBF3DA",
  iconCreamFg: "#B4901F",

  iconGrayBg: "#F1F1F4",
  iconGrayFg: "#3D3F45",

  iconRoseBg: "#FCE9EA",
  iconRoseFg: "#D0473F",

  badgeActiveBg: "#EEEFF3",
  badgeActiveFg: "#3D3F45",

  black: "#111114",
  white: "#FFFFFF",
} as const;

export const radii = {
  card: 24,
  pill: 999,
  iconWrap: 20,
};