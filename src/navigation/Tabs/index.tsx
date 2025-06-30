import React from 'react';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import {Image, StyleSheet} from 'react-native';
import Home from '../../screen/Home';
import Settings from '../../screen/Settings';
import Statistic from '../../screen/Report';
import {useTranslation} from 'react-i18next';
import Report from '../../screen/Report';

const Tab = createBottomTabNavigator();

export default function BottomTabs() {
  const {t} = useTranslation();
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        headerShown: false,
        tabBarShowLabel: true,

        // eslint-disable-next-line react/no-unstable-nested-components
        tabBarIcon: ({focused}) => {
          let icon;

          switch (route.name) {
            case 'Home':
              icon = focused
                ? require('../../assets/home.png')
                : require('../../assets/home-inactive.png');
              break;
            case 'Statistic':
              icon = focused
                ? require('../../assets/report.png')
                : require('../../assets/report-inactive.png');
              break;
            case 'Settings':
              icon = focused
                ? require('../../assets/settings.png')
                : require('../../assets/settings-inactive.png');
              break;
          }

          return <Image source={icon} style={[styles.icon]} />;
        },
      })}>
      <Tab.Screen
        name="Home"
        component={Home}
        options={{title: t('tabs.home')}}
      />
      <Tab.Screen
        name="Statistic"
        component={Report}
        options={{title: t('tabs.statistic')}}
      />
      <Tab.Screen
        name="Settings"
        component={Settings}
        options={{title: t('tabs.settings')}}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  icon: {
    width: 40,
    height: 40,
  },
});
