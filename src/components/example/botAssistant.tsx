// import React from 'react';
// import {StyleSheet, Dimensions, Pressable, Text, View} from 'react-native';
// import Animated, {
//   useSharedValue,
//   useAnimatedStyle,
//   useAnimatedGestureHandler,
//   withTiming,
// } from 'react-native-reanimated';
// import {
//   GestureHandlerRootView,
//   PanGestureHandler,
//   PanGestureHandlerGestureEvent,
// } from 'react-native-gesture-handler';
// import Ionicons from '@react-native-vector-icons/ionicons';

// const {width, height} = Dimensions.get('window');
// const botSize = {height: 120, width: 120};
// const gap = 15;

// type BotAssistantProps = {
//   onPress?: (isOpen: boolean) => void;
//   children: React.ReactNode;
// };

// export const BotAssistant: React.FC<BotAssistantProps> = ({
//   onPress,
//   children,
// }) => {
//   const translateX = useSharedValue(width / 1.2);
//   const translateY = useSharedValue(height / 2);
//   const rotation = useSharedValue(-45);
//   const isCentered = useSharedValue(false);
//   const modalVisible = useSharedValue(0);

//   const animatedStyle = useAnimatedStyle(() => ({
//     transform: [{translateX: translateX.value}, {translateY: translateY.value}],
//   }));

//   const imageAnimatedStyle = useAnimatedStyle(() => ({
//     transform: [{rotateZ: `${rotation.value}deg`}],
//   }));

//   const modalStyle = useAnimatedStyle(() => ({
//     opacity: withTiming(modalVisible.value, {duration: 300}),
//     transform: [
//       {
//         scale: withTiming(modalVisible.value ? 1 : 0.8, {duration: 300}),
//       },
//     ],
//     display: modalVisible.value === 0 ? 'none' : 'flex',
//   }));

//   const handlePress = () => {
//     const willOpen = !isCentered.value;

//     if (willOpen) {
//       translateX.value = withTiming(width / 2);
//       translateY.value = withTiming(height / 2);
//       rotation.value = withTiming(0);
//       modalVisible.value = 1;
//     } else {
//       translateX.value = withTiming(width / 1.2);
//       translateY.value = withTiming(height / 2);
//       rotation.value = withTiming(-45);
//       modalVisible.value = 0;
//     }

//     isCentered.value = willOpen;
//     onPress?.(willOpen);
//   };

//   const gestureHandler = useAnimatedGestureHandler<
//     PanGestureHandlerGestureEvent,
//     {startX: number; startY: number}
//   >({
//     onStart: (_, ctx) => {
//       ctx.startX = translateX.value;
//       ctx.startY = translateY.value;
//     },
//     onActive: (event, ctx) => {
//       const newX = ctx.startX + event.translationX;
//       const newY = ctx.startY + event.translationY;

//       translateX.value = newX;
//       translateY.value = newY;

//       const cornerThreshold = 80;

//       if (newX < cornerThreshold) {
//         // Near left edge
//         rotation.value = withTiming(45);
//       } else if (newX > width - botSize.width - cornerThreshold) {
//         // Near right edge
//         rotation.value = withTiming(-45);
//       } else {
//         // Center-ish
//         rotation.value = withTiming(0);
//       }
//     },
//   });

//   return (
//     <GestureHandlerRootView style={StyleSheet.absoluteFill}>
//       <PanGestureHandler onGestureEvent={gestureHandler}>
//         <Animated.View style={[styles.container, animatedStyle]}>
//           <Pressable onPress={handlePress}>
//             <Animated.Image
//               source={require('../../assets/onboard/robot.png')}
//               style={[styles.image, imageAnimatedStyle]}
//             />
//           </Pressable>
//         </Animated.View>
//       </PanGestureHandler>

//       <Animated.View style={[styles.modal, modalStyle]}>
//         <Pressable style={styles.closeButton} onPress={handlePress}>
//           <Ionicons name="close" />
//         </Pressable>
//         <View>{children}</View>
//       </Animated.View>
//     </GestureHandlerRootView>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     position: 'absolute',
//     width: botSize.width,
//     height: botSize.height,
//     zIndex: 100,
//   },
//   image: {
//     width: '100%',
//     height: '100%',
//     resizeMode: 'contain',
//   },
//   modal: {
//     position: 'absolute',
//     top: height / 3.5,
//     left: width / 2 - 150,
//     width: 300,
//     height: 120,
//     padding: 20,
//     backgroundColor: 'white',
//     borderRadius: 20,
//     zIndex: 200,
//     shadowColor: '#000',
//     shadowOffset: {width: 0, height: 2},
//     shadowOpacity: 0.25,
//     shadowRadius: 4,
//     elevation: 5,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   closeButton: {
//     position: 'absolute',
//     top: 10,
//     right: 10,
//     zIndex: 999,
//     backgroundColor: '#eee',
//     width: 30,
//     height: 30,
//     borderRadius: 15,
//     alignItems: 'center',
//     justifyContent: 'center',
//   },
//   closeText: {
//     fontSize: 18,
//     color: '#333',
//   },
// });

import React, {forwardRef, useImperativeHandle, useRef} from 'react';
import {StyleSheet, Dimensions, Pressable, View} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedGestureHandler,
  withTiming,
} from 'react-native-reanimated';
import {
  GestureHandlerRootView,
  PanGestureHandler,
  PanGestureHandlerGestureEvent,
} from 'react-native-gesture-handler';
import Ionicons from '@react-native-vector-icons/ionicons';
import {BotBottomSheetHandle} from '../BotBottomSheet';

const {width, height} = Dimensions.get('window');
const botSize = {height: 120, width: 120};

export type BotAssistantRef = {
  open: () => void;
  close: () => void;
  toggle: () => void;
  resetPosition: () => void;
};

type BotAssistantProps = {
  onPress?: (isOpen: boolean) => void;
  children: React.ReactNode;
  botttomRef: BotBottomSheetHandle;
};

export const BotAssistant = forwardRef<BotAssistantRef, BotAssistantProps>(
  ({onPress, children, botttomRef}, ref) => {
    const translateX = useSharedValue(width / 1.2);
    const translateY = useSharedValue(height / 1.4);
    const rotation = useSharedValue(-45);
    const isCentered = useSharedValue(false);
    const modalVisible = useSharedValue(0);

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [
        {translateX: translateX.value},
        {translateY: translateY.value},
      ],
    }));

    const imageAnimatedStyle = useAnimatedStyle(() => ({
      transform: [{rotateZ: `${rotation.value}deg`}],
    }));

    const modalStyle = useAnimatedStyle(() => ({
      opacity: withTiming(modalVisible.value, {duration: 300}),
      transform: [
        {
          scale: withTiming(modalVisible.value ? 1 : 0.8, {duration: 300}),
        },
      ],
      display: modalVisible.value === 0 ? 'none' : 'flex',
    }));

    const open = () => {
      translateX.value = withTiming(width / 2);
      translateY.value = withTiming(height / 2.34);
      rotation.value = withTiming(0);
      modalVisible.value = 1;
      isCentered.value = true;
      onPress?.(true);

      botttomRef?.open();
    };

    const close = () => {
      translateX.value = withTiming(width / 1.2);
      translateY.value = withTiming(height / 1.4);
      rotation.value = withTiming(-45);
      modalVisible.value = 0;
      isCentered.value = false;
      onPress?.(false);
    };

    const toggle = () => {
      isCentered.value ? close() : open();
    };

    const resetPosition = () => {
      translateX.value = withTiming(width / 1.2);
      translateY.value = withTiming(height / 1.4);
    };

    useImperativeHandle(ref, () => ({
      open,
      close,
      toggle,
      resetPosition,
    }));

    const gestureHandler = useAnimatedGestureHandler<
      PanGestureHandlerGestureEvent,
      {startX: number; startY: number}
    >({
      onStart: (_, ctx) => {
        ctx.startX = translateX.value;
        ctx.startY = translateY.value;
      },
      onActive: (event, ctx) => {
        const newX = ctx.startX + event.translationX;
        const newY = ctx.startY + event.translationY;

        translateX.value = newX;
        translateY.value = newY;

        const cornerThreshold = 80;

        if (newX < cornerThreshold) {
          rotation.value = withTiming(45);
        } else if (newX > width - botSize.width - cornerThreshold) {
          rotation.value = withTiming(-45);
        } else {
          rotation.value = withTiming(0);
        }
      },
    });

    return (
      <>
        <PanGestureHandler onGestureEvent={gestureHandler}>
          <Animated.View style={[styles.container, animatedStyle]}>
            <Pressable onPress={toggle}>
              <Animated.Image
                source={
                  !isCentered.value
                    ? require('../../assets/robo.gif')
                    : require('../../assets/onboard/robot.png')
                }
                style={[styles.image, imageAnimatedStyle]}
              />
            </Pressable>
          </Animated.View>
        </PanGestureHandler>

        <Animated.View style={[styles.modal, modalStyle, styles.content]}>
          <Pressable style={styles.closeButton} onPress={toggle}>
            <Ionicons name="close" />
          </Pressable>
          <View>{children}</View>
        </Animated.View>
      </>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: botSize.width,
    height: botSize.height,
    zIndex: 100,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  modal: {
    position: 'absolute',
    top: height / 6,
    left: width / 2 - 150,
    width: 300,
    height: 120,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    zIndex: 200,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: -5,
    right: -5,
    zIndex: 999,
    backgroundColor: '#E4E1E1FF',
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    elevation: 4, // for shadow on Android
    shadowColor: '#000', // iOS shadow
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    height: 180,
  },
});
