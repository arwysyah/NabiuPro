/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect} from 'react';

import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';

import RootNavigator from './src/navigation';
import {BottomSheetModalProvider} from '@gorhom/bottom-sheet';
import {initializeDatabase} from './src/lib/init';
import {LanguageProvider} from './src/context/LanguageContext';
import i18n from './src/lib/translation';
import {I18nextProvider} from 'react-i18next';
import {CurrencyProvider} from './src/context/CurrencyContext';

// const Example = () => {
//   // ...
//   const data = [{value: 50}, {value: 80}, {value: 90}, {value: 70}];

//   return (
//     <>
//       <BarChart data={data} />
//       <LineChart data={data} />
//       <PieChart data={data} />
//       <PopulationPyramid
//         data={[
//           {left: 10, right: 12},
//           {left: 9, right: 8},
//         ]}
//       />
//       <RadarChart data={[50, 80, 90, 70]} />

//       <BarChart data={data} horizontal />

//       <LineChart data={data} areaChart />

//       <PieChart data={data} donut />
//     </>
//   );
// };

function App(): React.JSX.Element {
  useEffect(() => {
    async function initialize() {
      try {
        await initializeDatabase();
      } catch (error) {
        console.log('ERRR', error);
      }
    }
    initialize();
  }, []);
  return (
    <NavigationContainer>
      <GestureHandlerRootView>
        <I18nextProvider i18n={i18n}>
          <LanguageProvider>
            <BottomSheetModalProvider>
              <CurrencyProvider>
                {/* <OnboardStack /> */}

                <RootNavigator />
              </CurrencyProvider>
            </BottomSheetModalProvider>
          </LanguageProvider>
        </I18nextProvider>
      </GestureHandlerRootView>
    </NavigationContainer>
  );
}
export default App;
