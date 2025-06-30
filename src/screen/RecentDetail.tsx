import React from 'react';
import {SafeAreaView} from 'react-native';
import RecentDetailItem from '../components/RecentDetailItem';
import PageHeader from '../components/PageHeader';
import {deleteTransaction} from '../lib/schema';
import {useNavigation} from '@react-navigation/native';

const RecentDetail = ({route}) => {
  const {transaction} = route.params;
  const nav = useNavigation();
  const deleteItem = async (id: string) => {
    try {
      const res = await deleteTransaction(id);
      if (res) {
        nav.goBack();
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: '#FFFFFFFF'}}>
      <PageHeader />
      <RecentDetailItem transaction={transaction} onDelete={deleteItem} />
    </SafeAreaView>
  );
};

export default RecentDetail;
