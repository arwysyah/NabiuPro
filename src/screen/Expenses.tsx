import {useRoute, RouteProp} from '@react-navigation/native';
import {View} from 'react-native';
import AddTransactionScreen from '../components/AddExpensesForm';

type ExpensesRouteProp = RouteProp<
  {Expenses: {type: string; amount?: string}},
  'Expenses'
>;

const Expenses = () => {
  const route = useRoute<ExpensesRouteProp>();
  const type = route.params?.type ?? '';
  const amount = route.params.amount;
  return (
    <View>
      <AddTransactionScreen type={type} amountProps={amount} />
    </View>
  );
};

export default Expenses;
