import {useNavigation} from '@react-navigation/native';
import React, {useState, forwardRef, useImperativeHandle} from 'react';
import {
  StyleSheet,
  Dimensions,
  View,
  Pressable,
  Text,
  TouchableOpacity,
} from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';
import FontFamily from '../assets/typography';
import {AppColors} from '../constants/colors';

const {width, height} = Dimensions.get('window');
const botSize = {width: 120, height: 120};

const MAX_SPEED = 19;
const MAX_FORCE = 0.2;
const FRICTION = 0.99;
export const BotAssistant = forwardRef(
  (
    {
      content,
      propWidth = width / 2,
      propHeight = height / 2,
      label,
      label2,
      onPress,
    },
    ref,
  ) => {
    const posX = useSharedValue(propWidth);
    const posY = useSharedValue(propHeight);
    const velocityX = useSharedValue(0);
    const velocityY = useSharedValue(0);

    const [popupVisible, setPopupVisible] = useState(false);
    const flying = useSharedValue(true);

    // useDerivedValue(() => {
    //   if (!flying.value) return;

    //   const steerX = (Math.random() - 0.5) * MAX_FORCE;
    //   const steerY = (Math.random() - 0.5) * MAX_FORCE;

    //   velocityX.value += steerX;
    //   velocityY.value += steerY;

    //   const speed = Math.sqrt(velocityX.value ** 2 + velocityY.value ** 2);
    //   if (speed > MAX_SPEED) {
    //     velocityX.value = (velocityX.value / speed) * MAX_SPEED;
    //     velocityY.value = (velocityY.value / speed) * MAX_SPEED;
    //   }

    //   velocityX.value *= FRICTION;
    //   velocityY.value *= FRICTION;

    //   posX.value += velocityX.value;
    //   posY.value += velocityY.value;

    //   if (posX.value < 0) {
    //     posX.value = 0;
    //     velocityX.value = -velocityX.value;
    //   } else if (posX.value > width - botSize.width) {
    //     posX.value = width - botSize.width;
    //     velocityX.value = -velocityX.value;
    //   }
    //   if (posY.value < 0) {
    //     posY.value = 0;
    //     velocityY.value = -velocityY.value;
    //   } else if (posY.value > height - botSize.height) {
    //     posY.value = height - botSize.height;
    //     velocityY.value = -velocityY.value;
    //   }
    // });

    const animatedStyle = useAnimatedStyle(() => ({
      transform: [{translateX: posX.value}, {translateY: posY.value}],
    }));

    // Expose openPopup method to parent
    useImperativeHandle(ref, () => ({
      openPopup: () => {
        flying.value = false;
        posX.value = withTiming(width / 2, {duration: 500});
        posY.value = withTiming(height / 2, {duration: 500}, finished => {
          if (finished) {
            runOnJS(setPopupVisible)(true);
          }
        });
      },
      closePopup: () => {
        setPopupVisible(false);
        flying.value = true;
      },
    }));

    // Optional: You can keep the tap open behavior or remove it if triggering only from parent
    const onBotPress = () => {
      if (!popupVisible) {
        // Trigger openPopup
        flying.value = false;
        //   posX.value = withTiming(width / 2, {duration: 500});
        //   posY.value = withTiming(height / 2, {duration: 500}, finished => {
        //     if (finished) {
        //       setPopupVisible(true);
        //       flying.value = false;
        //     }
        posX.value = withTiming(width / 2, {duration: 500});
        posY.value = withTiming(height / 2, {duration: 500}, finished => {
          if (finished) {
            runOnJS(setPopupVisible)(true);
          }
        });

        //   });
      }
    };

    const nav = useNavigation();
    const closePopup = () => {
      setPopupVisible(false);

      flying.value = true;
      nav.goBack();
    };
    const closeBot = () => {
      setPopupVisible(false);

      flying.value = true;
    };

    const handlePress = () => {
      onPress();
      closePopup();
    };
    return (
      <>
        <Animated.View style={[styles.container, animatedStyle]}>
          <Animated.Image
            //   source={require('../assets/onboard/robot.png')}
            source={
              popupVisible
                ? require('../assets/robo.gif')
                : require('../assets/onboard/robot.png')
            }
            style={styles.image}
          />
        </Animated.View>

        {popupVisible && (
          <View style={styles.popupContainer}>
            <View style={styles.popup}>
              {label && label2 && onPress && (
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={closePopup}>
                  <Text style={styles.closeButtonText}>×</Text>
                </TouchableOpacity>
              )}

              <Text
                style={{
                  fontSize: 18,
                  marginBottom: 10,
                  top: 5,
                  fontFamily: FontFamily.ROKKIT_BOLD,
                }}>
                {content}
              </Text>
            </View>
            {label && label2 && onPress && (
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                }}>
                <Pressable
                  style={styles.confirmBtn}
                  onPress={() => {
                    closePopup();
                  }}>
                  <Text style={styles.confirmText}>{label2}</Text>
                </Pressable>
                <Pressable style={styles.confirmBtn} onPress={handlePress}>
                  <Text style={styles.confirmText}>{label}</Text>
                </Pressable>
              </View>
            )}
          </View>
        )}
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
  confirmBtn: {
    backgroundColor: AppColors.action,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    margin: 5,
  },
  confirmText: {
    color: '#fff',
    fontWeight: '600',
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
  popupContainer: {
    position: 'absolute',
    top: height / 3,
    left: width / 2 - 150,
    width: 300,
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 15,
    zIndex: 200,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: {width: 0, height: 4},
    shadowRadius: 10,
    elevation: 10,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: -16,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#eee',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    fontSize: 18,
    lineHeight: 18,
    color: '#333',
  },
  popup: {
    width: '100%',
    alignItems: 'center',
  },
});
