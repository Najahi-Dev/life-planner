import React, { forwardRef, useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetBackdropProps,
  BottomSheetView,
  BottomSheetProps,
} from '@gorhom/bottom-sheet';
import { useTheme } from '@/hooks/useTheme';

export interface SheetProps extends Omit<BottomSheetProps, 'children'> {
  children: React.ReactNode;
  snapPoints?: (string | number)[];
  onClose?: () => void;
  enablePanDownToClose?: boolean;
}

export const Sheet = forwardRef<BottomSheet, SheetProps>(
  (
    {
      children,
      snapPoints = ['50%', '85%'],
      onClose,
      enablePanDownToClose = true,
      ...props
    },
    ref,
  ) => {
    const theme = useTheme();

    const renderBackdrop = useCallback(
      (backdropProps: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...backdropProps}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.6}
          pressBehavior="close"
        />
      ),
      [],
    );

    return (
      <BottomSheet
        ref={ref}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={enablePanDownToClose}
        onClose={onClose}
        backdropComponent={renderBackdrop}
        backgroundStyle={{
          backgroundColor: theme.colors.sheetBackground,
          borderTopLeftRadius: theme.radius.sheet,
          borderTopRightRadius: theme.radius.sheet,
        }}
        handleIndicatorStyle={{
          backgroundColor: theme.colors.sheetHandle,
          width: 40,
          height: 4,
          borderRadius: 2,
        }}
        {...props}
      >
        <BottomSheetView style={[styles.content, { paddingHorizontal: theme.spacing.screenPadding }]}>
          {children}
        </BottomSheetView>
      </BottomSheet>
    );
  },
);

Sheet.displayName = 'Sheet';

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingBottom: 24,
  },
});
