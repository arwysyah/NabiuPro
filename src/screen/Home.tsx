import React, {useCallback, useEffect, useRef, useState} from 'react';
import {
  // BackHandler,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import BalanceCard from '../components/BalancedCard';
import {SafeAreaView} from 'react-native-safe-area-context';
import RecentTransactions from '../components/example/recent';
import {
  BotAssistant,
  BotAssistantRef,
} from '../components/example/botAssistant';
import BotBottomSheet, {
  BotBottomSheetHandle,
} from '../components/BotBottomSheet';
import {RNText} from '../components/Text';
import {OptionChoice} from '../components/OptionChoice';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {useTransactions} from '../hooks/useGetTransactions';
import {formatCurrency} from '../lib/currency_formatter';
import QuickActionButtons from '../components/example/quick';
// import LinearProgressBar from '../components/LinearProgress';
import {useTranslation} from 'react-i18next';
import FontFamily from '../assets/typography';
import FeatureNotAvailableModal, {
  FeatureNotAvailableModalRef,
} from '../components/Popup';
import {useCurrency} from '../context/CurrencyContext';
// import Icon from '@react-native-vector-icons/ionicons';
import dayjs from 'dayjs';
// import {useVersionRealtime} from '../hooks/useVersion';
import * as RNLocalize from 'react-native-localize';

import 'dayjs/locale/id';
import 'dayjs/locale/en';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useDailyReset} from '../hooks/useReset';
// import HabitHeatmap from '../components/HabitHeatMap';
import {useRateApp} from '../hooks/useRateApp';
export const dayFormatter = date => {
  return dayjs(date).format('DD MMM YYYY');
};

const Home = () => {
  useFocusEffect(
    useCallback(() => {
      refresh();
    }, []),
  );
  useDailyReset();
  // const [showBannerAd, setShowBannerAd] = useState(true);
  const {hasRated, requestReview} = useRateApp();
  const insets = useSafeAreaInsets();

  const bottomSheetRef = useRef<BotBottomSheetHandle>(null);
  const botRef = useRef<BotAssistantRef>(null);

  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const country = RNLocalize.getCountry(); // e.g. "ID"

  const navigation = useNavigation();
  const {t} = useTranslation();
  const [isAppOutdated, setIsAppOutdated] = useState(false);

  const handleOpenSheet = async () => {
    if (bottomSheetRef.current?.isOpen()) {
      bottomSheetRef.current.close();
      setIsSheetOpen(false);
    } else {
      bottomSheetRef.current?.open();
      setIsSheetOpen(true);
    }
  };

  const handleBoth = () => {
    handleOpenSheet();
    botRef.current?.open();
  };

  // useEffect(() => {
  //   const checkVersion = async () => {
  //     const latestVersion = await fetchVersion();
  //     const currentVersion = getVersion();

  //     if (latestVersion !== currentVersion) {
  //       versionModalRef.current?.show();
  //       setIsAppOutdated(true);
  //     }
  //   };

  //   checkVersion();
  // }, []);

  const {
    transactions,
    loading: _Load,
    error: _err,
    refresh,
  } = useTransactions();
  // useEffect(() => {
  //   const backHandler = BackHandler.addEventListener(
  //     'hardwareBackPress',
  //     () => true,
  //   );
  //   return () => backHandler.remove();
  // }, []);

  useEffect(() => {}, []);
  useFocusEffect(
    useCallback(() => {
      navigation.setOptions({
        gestureEnabled: false,
        headerLeft: () => null,
      });

      return () => {
        navigation.setOptions({
          gestureEnabled: true,
          headerLeft: undefined,
        });
      };
    }, [navigation]),
  );

  let trxMapped = transactions
    .map(item => ({
      id: item?.id ?? '',
      title: item?.title ?? 'NO',
      date: item.date,
      amount: item.amount,
      color: item.type !== 'income' ? 'red' : 'green',
      icon: '',
      created_at: item.created_at,
      symbol: item.type !== 'income' ? '-' : '+',
    }))
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    );

  const totalBalance = transactions.reduce((sum, item) => {
    if (item.type === 'income' || item.type === 'saving') {
      return sum + Number(item.amount);
    } else if (item.type === 'expense') {
      return sum - Number(item.amount);
    }
    return sum; // in case other types exist
  }, 0);

  const totalExpense = (transactions ?? [])
    .filter(item => {
      const isExpense = item.type !== 'income';
      const itemDate = dayFormatter(item.created_at);
      const isToday = itemDate === dayFormatter(new Date());
      return isExpense && isToday;
    })
    .reduce((sum, item) => sum + Number(item.amount || 0), 0);

  const recentIncome = (transactions ?? [])
    .filter(item => {
      const isIncome = item.type === 'income';

      const itemDate = dayFormatter(item.created_at);

      const isToday = itemDate === dayFormatter(new Date());
      return isIncome && isToday;
    })
    .sort(
      (a, b) =>
        new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
    )[0];

  const modalRef = useRef<FeatureNotAvailableModalRef>(null);
  const versionModalRef = useRef<FeatureNotAvailableModalRef>(null);
  const balanceDay = dayjs().format('dddd, D MMM YYYY');

  const actions = [
    {
      icon: 'file-tray-full',
      label: t('home.popUp.income'),
      screen: 'Plan',
      onPress: () => {
        navigation.navigate('Expenses', {type: 'income'});
        //   return;
        // }
        // versionModalRef?.current?.show();
      },
    },
    {
      icon: 'fast-food',
      label: t('home.popUp.expense'),
      screen: 'Plan',
      onPress: () => {
        navigation.navigate('Expenses', {type: 'expense'});
        //   return;
        // }
        // versionModalRef?.current?.show();
      },
    },

    {
      icon: 'wallet',
      label: t('home.actions.plan'),
      screen: 'Plan',
      onPress: () => {
        navigation.navigate('Plan');
        //   return;
        // }
        // versionModalRef?.current?.show();
      },
    },
    {
      icon: 'receipt',
      label: t('home.popUp.ledger'),
      screen: 'Wallet',
      onPress: () => {
        // modalRef.current?.show();
        navigation.navigate('Ledger');
      },
    },
    {
      icon: 'calculator',
      label: t('home.actions.calculator'),
      screen: 'Calculator',
      onPress: () => {
        navigation.navigate('Calculator');
      },
    },
    {
      icon: 'cash-outline',
      label: t('home.popUp.debt'),
      screen: 'Tax',
      onPress: () => {
        navigation.navigate('DebtList');
      },
    },
    {
      icon: 'logo-firebase',
      label: t('home.popUp.receivable'),
      screen: 'Tax',
      onPress: () => {
        navigation.navigate('DebtList', {type: 'receivable'});
      },
    },

    {
      icon: 'calendar',
      label: t('home.actions.calendar'),
      screen: 'Calendar',
      onPress: () => {
        navigation.navigate('Calendar');
      },
    },

    // {
    //   icon: 'document-text',
    //   label: t('home.actions.tax'),
    //   screen: 'Tax',
    //   onPress: () => {
    //     modalRef.current?.show();
    //   },
    // },
  ];
  const newActions =
    country === 'ID'
      ? actions
      : actions.filter(item => item.screen !== 'Calendar'); // hide Calendar for others

  const {currencyCode, locale} = useCurrency();
  // const [showBannerAd, setShowBannerAd] = useState(true);

  // const segments = [30, 60, 90, 120, 240, 360]; // Dynamic 6 segments
  // const progress = 60;
  // const rankIcons = [
  //   require('../assets/badge/Badge_01.png'),
  //   require('../assets/badge/Badge_02.png'),
  //   require('../assets/badge/Badge_03.png'),
  //   require('../assets/badge/Badge_04.png'),
  //   require('../assets/badge/Badge_05.png'),
  // ];
  // const adUnitId = __DEV__
  //   ? TestIds.BANNER
  //   : 'ca-app-pub-8396662544871841/7522878126';

  const {i18n} = useTranslation();
  const currentLang = i18n.language; // e.g., 'id' or 'en'
  const dummyData = {
    '2025-06-24': {workout: 2, read: 1},
    '2025-06-25': {workout: 4},
    '2025-02-14': {read: 3},
  };
  dayjs.locale(currentLang === 'id' ? 'id' : 'en');
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      {isAppOutdated && (
        <View style={{backgroundColor: 'rgba(44,87,65,0.2)', padding: 10}}>
          <Text
            style={{
              fontFamily: FontFamily.ROKKIT_BOLD,
              color: '#de1f0d',
              textAlign: 'center',
            }}>
            {t('versionOff')}
          </Text>
        </View>
      )}

      <ScrollView
        pointerEvents={isAppOutdated ? 'none' : 'auto'}
        style={{flex: 1, backgroundColor: 'white'}}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!isSheetOpen}>
        <TouchableOpacity
          onPress={async () => {
            const res = await requestReview();
            console.log('Res', res);
          }}></TouchableOpacity>
        <BalanceCard
          label={t('home.yourWallet')}
          balance={formatCurrency(totalBalance, locale, currencyCode)}
          income={formatCurrency(
            recentIncome?.amount ?? 0,
            locale,
            currencyCode,
          )}
          spend={formatCurrency(totalExpense, locale, currencyCode)}
          date={balanceDay}
          logoUrl="https://img.icons8.com/color/48/visa.png"
          onPress={() => console.log('BalanceCard pressed!')}
        />

        <FeatureNotAvailableModal
          ref={modalRef}
          label={t('warning.title')}
          desc={t('warning.desc')}
        />
        <FeatureNotAvailableModal
          ref={versionModalRef}
          label={t('nobiWords')}
          desc={''}
        />

        <View>
          <Image
            source={require('../assets/onboard/onboard_wallet.png')}
            style={styles.image}
            resizeMode="contain"
          />
        </View>
        {/* <HabitHeatmap habitData={dummyData} /> */}
        {/* <Chart data={transformToChartData(transactions)} /> */}
        <View pointerEvents={isAppOutdated ? 'none' : 'auto'}>
          <QuickActionButtons actions={newActions} />
        </View>
        {trxMapped.length > 0 ? (
          <RecentTransactions transactions={trxMapped} />
        ) : (
          <View style={{alignItems: 'center', padding: 20}}>
            <Text style={{fontFamily: FontFamily.ROKKIT_BOLD, fontSize: 16}}>
              {t('noActivity')}
            </Text>
          </View>
        )}
      </ScrollView>

      {/* Overlay blocking background when sheet is open */}
      {isSheetOpen && (
        <TouchableWithoutFeedback>
          <View style={styles.overlay} />
        </TouchableWithoutFeedback>
      )}

      <BotAssistant
        // pointerEvents={isAppOutdated ? 'none' : 'auto'}
        onPress={handleOpenSheet}
        ref={botRef}
        bottomRef={bottomSheetRef}>
        <NobiIntro />
      </BotAssistant>

      <BotBottomSheet ref={bottomSheetRef}>
        <OptionChoice
          options={[
            {label: t('home.popUp.income'), value: 'income', route: 'Income'},
            {
              label: t('home.popUp.expense'),
              value: 'expense',
              route: 'Expense',
            },
            {label: t('home.popUp.debt'), value: 'debt', route: 'Debt'},
            {
              label: t('home.popUp.receivable'),
              value: 'receivable',
              route: 'Receivable',
            },
            // {
            //   label: t('newsaving'),
            //   value: 'savings',
            //   route: 'Savings',
            // },
          ]}
          onSubmit={(value: any) => {
            if (value === 'savings') {
              modalRef.current?.show();
              return;
            } else if (value === 'debt' || value === 'receivable') {
              navigation.navigate('DebtsReceivable', {type: value});
              return;
            }
            navigation.navigate('Expenses', {type: value});
            // bottomSheetRef.current?.close();
            setIsSheetOpen(false);
          }}
          botRef={botRef}
        />
      </BotBottomSheet>

      <View
        style={{
          alignSelf: 'center',
          top: insets.bottom > 10 ? insets.bottom : 0,
        }}></View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  image: {
    width: 260,
    height: 220,
    alignSelf: 'center',
    marginTop: -70,
  },
  bannerContainer: {
    position: 'relative',
    alignItems: 'center',
    marginVertical: 10,
    backgroundColor: 'white',
  },
  closeButton: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    zIndex: 10,
    backgroundColor: 'white',

    // borderRadius: 30,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#007bff',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {width: 2, height: 3},
    shadowOpacity: 0.5,
    shadowRadius: 15,
    elevation: 5,
  },
  overlay: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)', // dimmed background
    zIndex: 10,
  },
});

export default Home;

const NobiIntro = () => {
  const {t} = useTranslation();
  return (
    <View style={styless.container}>
      <RNText style={styless.text}>
        {t('nobiIntro.line1')}
        {'\n\n'}
        {t('nobiIntro.line2')}
        {'\n'}
        {t('nobiIntro.line3')}
      </RNText>
    </View>
  );
};

const styless = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    backgroundColor: '#fff',
    borderRadius: 16,
    alignSelf: 'stretch',
  },
  text: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
    textAlign: 'center',
  },
});
