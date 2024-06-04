import { FlatList, Text, View } from "react-native";
import ExpenseItems from "./ExpenseItems";

function renderList(itemData) {
  return <ExpenseItems {...itemData.item} />;
}

function ExpensesList({ expenses }) {
  return (
    <FlatList
      data={expenses}
      renderItem={renderList}
      keyExtractor={(item) => item.id}
    />
  );
}

export default ExpensesList;
