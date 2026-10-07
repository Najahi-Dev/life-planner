import React, { forwardRef, useCallback, useImperativeHandle, useRef, useState } from 'react';
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
      onChange,
      enablePanDownToClose = true,
      ...props
    },
    ref,
  ) => {
    const theme = useTheme();
    const internalRef = useRef<BottomSheet>(null);
    const [isOpen, setIsOpen] = useState(false);

    useImperativeHandle(ref, () => ({
      snapToIndex: (index: number, animationConfigs?: any) => {
        if (index >= 0) setIsOpen(true);
        else setIsOpen(false);
        internalRef.current?.snapToIndex(index, animationConfigs);
      },
      snapToPosition: (position: string | number, animationConfigs?: any) => {
        setIsOpen(true);
        internalRef.current?.snapToPosition(position, animationConfigs);
      },
      expand: (animationConfigs?: any) => {
        setIsOpen(true);
        internalRef.current?.expand(animationConfigs);
      },
      collapse: (animationConfigs?: any) => {
        bottomSheetCollapse(animationConfigs);
      },
      close: (animationConfigs?: any) => {
        setIsOpen(false);
        internalRef.current?.close(animationConfigs);
      },
      forceClose: (animationConfigs?: any) => {
        setIsOpen(false);
        internalRef.current?.forceClose(animationConfigs);
      },
    } as BottomSheet));

    const bottomSheetCollapse = (animationConfigs?: any) => {
      internalRef.current?.collapse(animationConfigs);
    };

    const handleChange = useCallback(
      (index: number, position: number, type: any) => {
        const open = index >= 0;
        setIsOpen(open);
        onChange?.(index, position, type);
        if (index === -1) {
          onClose?.();
        }
      },
      [onChange, onClose],
    );

    const renderBackdrop = useCallback(
      (backdropProps: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...backdropProps}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          opacity={0.6}
          pressBehavior="close"
          style={[
            backdropProps.style,
            { pointerEvents: isOpen ? 'auto' : 'none' },
          ]}
        />
      ),
      [isOpen],
    );

    return (
      <BottomSheet
        ref={internalRef}
        index={-1}
        snapPoints={snapPoints}
        enablePanDownToClose={enablePanDownToClose}
        onClose={onClose}
        onChange={handleChange}
        backdropComponent={renderBackdrop}
        containerStyle={{
          pointerEvents: isOpen ? 'auto' : 'none',
        }}
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
        <BottomSheetView
          style={[styles.content, { paddingHorizontal: theme.spacing.screenPadding }]}
        >
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
