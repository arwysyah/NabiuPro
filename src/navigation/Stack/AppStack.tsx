import {createNativeStackNavigator} from '@react-navigation/native-stack';

import BottomTabs from '../Tabs';
import Next from '../../screen/nextTest';
import Expenses from '../../screen/Expenses';
import CalendarScreen from '../../screen/Calendar';
import Calculator from '../../screen/Calculator';
import Plan from '../../screen/Plan';
import CreatePlan from '../../components/CreatePlan';
import PlanDetail from '../../screen/PlanDetail';
import Recent from '../../screen/Recent';

import RecentDetail from '../../screen/RecentDetail';
import CreateLedgerNoteForm from '../../screen/CreateLedger';
import LedgerScreen from '../../screen/Ledger';
import LedgerDetailScreen from '../../screen/LedgerDetailScreen';
import WebviewScreen from '../../screen/WebViewScreen';
import DebtReceivable from '../../screen/DebtReceivable';
import DebtList from '../../components/DebtList';
import InsightScreen from '../../screen/InsightScreen';
import MonthlyIncomeRecap from '../../screen/MontlyIncomeRecap';
import DailyIncomeRecap from '../../screen/DailyIncomeRecap';
import YourCartScreen from '../../screen/CartScreen';
import SavedOrdersScreen from '../../screen/SaveOrderScreen';

const Stack = createNativeStackNavigator();

export default function AppStack() {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="Main" component={BottomTabs} />
      <Stack.Screen name="Next" component={Next} />
      <Stack.Screen name="Expenses" component={Expenses} />
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen name="Calculator" component={Calculator} />
      <Stack.Screen name="Plan" component={Plan} />
      <Stack.Screen name="CreatePlan" component={CreatePlan} />
      <Stack.Screen name="PlanDetail" component={PlanDetail} />
      <Stack.Screen name="Recent" component={Recent} />
      <Stack.Screen name="RecentDetail" component={RecentDetail} />
      <Stack.Screen name="CreateLedger" component={CreateLedgerNoteForm} />
      <Stack.Screen name="Ledger" component={LedgerScreen} />
      <Stack.Screen name="LedgerDetailScreen" component={LedgerDetailScreen} />
      <Stack.Screen name="WebView" component={WebviewScreen} />
      <Stack.Screen name="DebtsReceivable" component={DebtReceivable} />
      <Stack.Screen name="DebtList" component={DebtList} />
      <Stack.Screen name="InsightScreen" component={InsightScreen} />
      <Stack.Screen name="MonthlyIncomeRecap" component={MonthlyIncomeRecap} />
      <Stack.Screen name="DailyIncomeRecap" component={DailyIncomeRecap} />
      <Stack.Screen name="YourCartScreen" component={YourCartScreen} />
      <Stack.Screen name="SavedOrdersScreen" component={SavedOrdersScreen} />
    </Stack.Navigator>
  );
}
