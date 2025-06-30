import React, {useEffect, useRef, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Switch,
  Platform,
  Linking,
  Alert,
  // Switch,
} from 'react-native';
import Icon from '@react-native-vector-icons/ionicons';

import {SafeAreaView} from 'react-native-safe-area-context';
import FontFamily from '../assets/typography';

import {useUserQuery} from '../hooks/useUserQueryDb';
import {CustomAvatar} from '../components/Avatar';
import {useTranslation} from 'react-i18next';
import BotBottomSheet, {
  BotBottomSheetHandle,
} from '../components/BotBottomSheet';
import {OptionChoice} from '../components/OptionChoice';
import {BotAssistantRef} from '../components/example/botAssistant';
import {useCurrency} from '../context/CurrencyContext';
import FeatureNotAvailableModal, {
  FeatureNotAvailableModalRef,
} from '../components/Popup';

import {useNavigation} from '@react-navigation/native';
import {useDatabaseSize} from '../hooks/useDatabaseSize';

import {trakteer_URL} from '../constants/trakteer';
import {getVersion} from 'react-native-device-info';

const Settings = () => {
  return (
    <View style={{flex: 1, backgroundColor: 'white'}}>
      <SafeAreaView />
      <UserProfile />
    </View>
  );
};

const UserProfile = () => {
  const {user, loading, error} = useUserQuery();
  const currentVersion = getVersion();
  const {t, i18n} = useTranslation();
  const bottomSheetRef = useRef<BotBottomSheetHandle>(null);
  const modalRef = useRef<FeatureNotAvailableModalRef>(null);
  const handleOpenSheet = () => {
    bottomSheetRef.current?.open();
  };
  const nav = useNavigation();
  // const version = useVersionRealtime();

  const sendEmail = async ({
    to = 'support@nabiu.app',
    subject = 'Feedback from Nabiu user',
    body = 'Hello, I would like to share some feedback...',
  }: {
    to?: string;
    subject?: string;
    body?: string;
  }) => {
    const emailUrl = `mailto:${to}?subject=${encodeURIComponent(
      subject,
    )}&body=${encodeURIComponent(body)}`;

    const canOpen = await Linking.canOpenURL(emailUrl);

    if (canOpen) {
      try {
        await Linking.openURL(emailUrl);
        return;
      } catch (err) {
        console.error('openURL error:', err);
      }
    }

    // Android fallback to Gmail intent
    if (Platform.OS === 'android') {
      const gmailUrl = `googlegmail://co?to=${to}&subject=${encodeURIComponent(
        subject,
      )}&body=${encodeURIComponent(body)}`;

      const canOpenGmail = await Linking.canOpenURL(gmailUrl);
      if (canOpenGmail) {
        try {
          await Linking.openURL(gmailUrl);
          return;
        } catch (err) {
          console.error('openURL Gmail intent error:', err);
        }
      }
    }

    // If all fails
    Alert.alert(
      'No Email App Found',
      'Please install or configure an email app (like Gmail or Outlook) to send feedback.',
    );
  };
  useEffect(() => {
    // async function getDb() {
    //   const res = getDbSize();
    //   console.log(res);
    // }
    // getDb();
  }, []);
  const isEnglish = i18n.language === 'en';
  const {currencyCode, setCurrencyCode} = useCurrency();
  const botRef = useRef<BotAssistantRef>(null);
  const {size, loading: load, error: err, refresh} = useDatabaseSize();

  const settingsSections = [
    {
      id: '1',
      title: null,
      data: [
        // {
        //   id: 'account',
        //   title: t('settings.account'),
        //   icon: 'key-outline',
        //   onPress: () => {
        //     modalRef.current?.show();
        //     // router.push("/account");
        //   },
        // },
        {
          id: 'avatar',
          title: t('settings.currency'),
          icon: 'cash-outline',
          onPress: () => {
            handleOpenSheet();
          },
        },
      ],
    },
    {
      id: '3',
      title: null,
      data: [
        {
          id: 'privacy',
          title: t('settings.privacy'),
          icon: 'lock-closed-outline',
          onPress: async () => {
            try {
              nav.navigate('WebView', {
                url: `https://www.nabiu.site/privacy?lang=${
                  isEnglish ? 'en' : 'id'
                }`,
              });
              // await dropAllTables();
              // eslint-disable-next-line no-catch-shadow
            } catch (error) {
              console.log(error);
            }
            // modalRef.current?.show();
            // router.push("/account");
          },
        },
        {
          id: 'terms',
          title: t('settings.terms'),
          icon: 'desktop-outline',
          onPress: () => {
            nav.navigate('WebView', {
              url: `https://www.nabiu.site/terms?lang=${
                isEnglish ? 'en' : 'id'
              }`,
            });
            // router.push("/account");
          },
        },
        // {
        //   id: 'notifications',
        //   title: t('settings.notifications'),
        //   icon: 'notifications-outline',
        //   onPress: () => {
        //     modalRef.current?.show();
        //     // router.push("/account");
        //   },
        // },
        // {
        //   id: 'storage',
        //   title: t('settings.storage'),
        //   icon: 'swap-vertical-outline',
        //   onPress: () => {
        //     // modalRef.current?.show();
        //     // router.push("/account");
        //     modalRef.current?.show();
        //   },
        // },

        {
          id: 'contactUs',
          title: t('settings.contactUs'),
          icon: 'mail-outline',
          onPress: () => {
            sendEmail({
              to: 'arwysyahputrasiregar@gmail.com',
              subject: t('email.subject'),
              body: t('email.body'),
            });
          },
        },
        {id: 'version', title: t('settings.version'), icon: 'apps'},
        {
          id: 'supportUs',
          title: t('settings.supportUs'),
          icon: 'heart-circle-outline',
          onPress: async () => {
            const canOpen = await Linking.canOpenURL(trakteer_URL);

            if (canOpen) {
              try {
                await Linking.openURL(trakteer_URL);
                // eslint-disable-next-line no-catch-shadow
              } catch (errs) {
                console.log('openURL error:', errs);
              }
            }
          },
        },
      ],
    },
  ];

  const renderUserHeader = () => (
    <View style={styles.userContainer}>
      <CustomAvatar uri={'Guest'} size={60} />
      <View style={styles.userInfo}>
        {!error && !loading && <Text style={styles.userName}>{'Guest'}</Text>}
      </View>
      <TouchableOpacity style={styles.qrButton}>
        <Icon name="qr-code-outline" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );

  // const appVersion = Constants.manifest.version;
  const renderItem = ({item}) => (
    <TouchableOpacity
      style={styles.listItem}
      onPress={() => {
        item.onPress ? item.onPress() : () => {};
      }}>
      <Icon
        name={item.icon}
        size={22}
        color={item.id === 'supportUs' ? '#FA8383FF' : '#555'}
        style={styles.itemIcon}
      />
      <Text
        style={item.id === 'supportUs' ? styles.itemTexts : styles.itemText}>
        {item.title}
      </Text>
      {item.id === 'version' ? (
        <Text
          // eslint-disable-next-line react-native/no-inline-styles
          style={{
            // color: theme.usernameAvatar,
            fontFamily: FontFamily.ROKKIT_BOLD,
            fontSize: 18,
            // paddingRight: 15,
          }}>
          v.{currentVersion}
        </Text>
      ) : (
        <Icon name="chevron-forward" size={20} color={'#555'} />
      )}
    </TouchableOpacity>
  );

  const renderLanguageToggle = () => {
    const isEnglish = i18n.language === 'en';

    const toggleLanguage = () => {
      const newLang = isEnglish ? 'id' : 'en';
      i18n.changeLanguage(newLang);
    };

    return (
      <View style={styles.languageToggle}>
        <Text style={styles.label}>
          {isEnglish ? 'English' : 'Bahasa Indonesia'}
        </Text>
        <FeatureNotAvailableModal
          ref={modalRef}
          label={t('warning.title')}
          desc={t('warning.desc')}
        />
        <BotBottomSheet ref={bottomSheetRef}>
          <OptionChoice
            initialValue={currencyCode}
            options={[
              {
                label: 'Indonesia (Rp)',
                value: 'IDR',
                route: '',
              },
              {
                label: 'US Dollar ($)',
                value: 'USD',
                route: '',
              },
              {
                label: 'Euro (€)',
                value: 'EUR',
                route: '',
              },
            ]}
            onSubmit={(value: any) => {
              setCurrencyCode(value);
              bottomSheetRef?.current?.close();
            }}
            // botRef={botRef}
          />
        </BotBottomSheet>
        <Switch
          value={isEnglish}
          onValueChange={toggleLanguage}
          thumbColor={Platform.OS !== 'android' ? '#0E7CF1FF' : '#3D9AFDFF'}
          trackColor={{true: '#ccc', false: '#ccc'}}
        />
      </View>
    );
  };

  return (
    <View style={styles.container}>
      {renderUserHeader()}

      <FlatList
        data={settingsSections.flatMap(section => section.data)}
        renderItem={renderItem}
        keyExtractor={item => item.id}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        contentContainerStyle={{paddingBottom: 30}}
        ListFooterComponent={renderLanguageToggle}
      />
      <View style={{alignSelf: 'center', marginBottom: 10}}></View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FDFCFCE0',
  },
  bannerContainer: {
    position: 'relative',
    alignItems: 'center',
    marginVertical: 10,
  },
  closeButton: {
    position: 'absolute',
    top: 2,
    right: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    zIndex: 10,
  },
  userContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    margin: 5,
    backgroundColor: '#fff',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 15,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#000',
  },
  userSubtitle: {
    fontSize: 14,
    color: '#555',
  },
  qrButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#007AFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  itemIcon: {
    marginRight: 20,
  },
  itemText: {
    fontSize: 18,
    flex: 1,
    color: '#000',
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
  itemTexts: {
    fontSize: 18,
    flex: 1,
    color: '#FA8383FF',
    fontFamily: FontFamily.ROKKIT_BOLD,
  },
  itemTextVersion: {
    fontSize: 18,
    flex: 1,
    color: '#000',
    fontFamily: FontFamily.KAUSHAN_REGULAR,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginHorizontal: 20,
  },
  themeToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 20,
    backgroundColor: '#fff',
  },
  languageToggle: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
  },

  label: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
});

export default Settings;
