import { useSafeAreaInsets } from "react-native-safe-area-context";

// Geometry of the floating tab bar in app/(tabs)/_layout.tsx:
// 8px padding top/bottom + 10px button padding top/bottom + 20px icon row.
export const TAB_BAR_HEIGHT = 56;
export const TAB_BAR_BOTTOM_GAP = 20;

/**
 * Distance from the bottom of the screen to the top edge of the floating tab
 * bar. Tab screens add this to their scroll content's bottom padding (and to
 * any bottom-pinned UI) so nothing ends up hidden behind the bar.
 */
export function useTabBarInset() {
    const insets = useSafeAreaInsets();
    return insets.bottom + TAB_BAR_BOTTOM_GAP + TAB_BAR_HEIGHT;
}
