import { useContext, useLayoutEffect, useState } from "react";
import { StyleSheet, View } from "react-native";

import ExpenseForm from "../components/ManageExpense/ExpenseForm";
import IconButton from "../components/UI/IconButton";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import { GlobalStyles } from "../constants/style";
import { ExpensesContext } from "../store/expense-context";
import { storeExpense, deleteExpenses, updateExpenses } from "../utils/http";
import ErrorOverlay from "../components/UI/ErrorOverlay";

function ManageExpense({ route, navigation }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const expensesCtx = useContext(ExpensesContext);
  const [error, setError] = useState("");

  const editedExpenseId = route.params?.expenseId;
  const isEditing = !!editedExpenseId;

  const selectedExpense = expensesCtx.expenses.find(
    (expense) => expense.id === editedExpenseId
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: isEditing ? "Edit Expense" : "Add Expense",
    });
  }, [navigation, isEditing]);

  async function deleteExpenseHandler() {
    setIsSubmitting(true);
    try {
      await deleteExpenses(editedExpenseId);
      // setIsSubmitting(false);
      expensesCtx.deleteExpense(editedExpenseId);
    } catch (error) {
      setError(`Couldn't delete the items: ${error}`);
    }
    setIsSubmitting(false);
    navigation.goBack();
  }

  function cancelHandler() {
    navigation.goBack();
  }

  async function confirmHandler(expenseData) {
    setIsSubmitting(true);
    try {
      if (isEditing) {
        await updateExpenses(editedExpenseId, expenseData);
        expensesCtx.updateExpense(editedExpenseId, expenseData);
      } else {
        const id = await storeExpense(expenseData);
        expensesCtx.addExpense({ ...expenseData, id: id });
      }
      navigation.goBack();
    } catch (error) {
      setError(`Not able to ${isEditing ? "update" : "add"} error: ${error}`);
      setIsSubmitting(false);
    }
  }

  if (error && !isSubmitting) return <ErrorOverlay message={error} />;

  if (isSubmitting) {
    return <LoadingOverlay />;
  }

  return (
    <View style={styles.container}>
      <ExpenseForm
        submitButtonLabel={isEditing ? "Update" : "Add"}
        onSubmit={confirmHandler}
        onCancel={cancelHandler}
        defaultValues={selectedExpense}
      />
      {isEditing && (
        <View style={styles.deleteContainer}>
          <IconButton
            icon="trash"
            color={GlobalStyles.colors.error500}
            size={36}
            onPress={deleteExpenseHandler}
          />
        </View>
      )}
    </View>
  );
}

export default ManageExpense;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: GlobalStyles.colors.primary800,
  },
  deleteContainer: {
    marginTop: 16,
    paddingTop: 8,
    borderTopWidth: 2,
    borderTopColor: GlobalStyles.colors.primary200,
    alignItems: "center",
  },
});
