import {useRoute, RouteProp} from '@react-navigation/native';
import {View} from 'react-native';
import AddTransactionScreen from '../components/AddExpensesForm';
import AddDebtsOrReceivable from '../components/AddDebtsForm';

type ExpensesRouteProp = RouteProp<
  {Expenses: {type: string; amount?: string}},
  'Expenses'
>;

const DebtReceivable = () => {
  const route = useRoute<ExpensesRouteProp>();
  const type = route.params?.type ?? '';
  const amount = route.params.amount;
  return (
    <View>
      <AddDebtsOrReceivable type={type} amountProps={amount} />
    </View>
  );
};

export default DebtReceivable;
