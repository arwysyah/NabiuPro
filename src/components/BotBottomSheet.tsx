import React, {forwardRef, useImperativeHandle, useMemo, useRef} from 'react';
import {StyleSheet} from 'react-native';
import {
  BottomSheetBackdrop,
  BottomSheetModal,
  BottomSheetView,
} from '@gorhom/bottom-sheet';

type BotBottomSheetProps = {
  children: React.ReactNode;
  onDismiss?: () => void; // ✅ Optional onDismiss
};

export type BotBottomSheetHandle = {
  open: () => void;
  close: () => void;
  isOpen: () => boolean;
};

export const BotBottomSheet = forwardRef<
  BotBottomSheetHandle,
  BotBottomSheetProps
>(({children, onDismiss}, ref) => {
  const snapPoints = useMemo(() => ['42%', '70%'], []);
  const modalRef = useRef<BottomSheetModal>(null);
  const isPresentedRef = useRef(false);

  // Expose methods to parent
  useImperativeHandle(ref, () => ({
    open: () => {
      modalRef.current?.present();
      isPresentedRef.current = true;
    },
    close: () => {
      modalRef.current?.dismiss();
      isPresentedRef.current = false;
    },
    isOpen: () => isPresentedRef.current,
  }));

  const handleDismiss = () => {
    isPresentedRef.current = false;
    if (onDismiss) {
      onDismiss(); // ✅ Call if provided
    }
  };

  return (
    <BottomSheetModal
      ref={modalRef}
      index={0}
      onDismiss={handleDismiss}
      snapPoints={snapPoints}
      backdropComponent={props => (
        <BottomSheetBackdrop
          {...props}
          disappearsOnIndex={1}
          appearsOnIndex={0}
        />
      )}>
      <BottomSheetView style={styles.contentContainer}>
        {children}
      </BottomSheetView>
    </BottomSheetModal>
  );
});

const styles = StyleSheet.create({
  contentContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
});

export default BotBottomSheet;
