import { useContext, useEffect, useState } from "react";

import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import LoadingOverlay from "../components/UI/LoadingOverlay";
import { ExpensesContext } from "../store/expense-context";
import { getDateMinusDays } from "../utils/date";
import { getExpense } from "../utils/http";
import ErrorOverlay from "../components/UI/ErrorOverlay";

function RecentExpenses() {
  //Loading State for SpinnerOverlay
  const [isFetching, setIsFetching] = useState(true);
  //Error State for ErrorOverlay
  const [error, setError] = useState("");

  const expensesCtx = useContext(ExpensesContext);

  useEffect(() => {
    async function getExpenses() {
      setIsFetching(true);
      try {
        const expenses = await getExpense();
        expensesCtx.setExpenses(expenses);
      } catch (error) {
        setError(`Could not get the data: ${error}`);
      }
      setIsFetching(false);
    }

    getExpenses();
  }, []);

  if (error && !isFetching) return <ErrorOverlay message={error} />;

  if (isFetching) {
    return <LoadingOverlay />;
  }

  const recentExpenses = expensesCtx.expenses.filter((expense) => {
    const today = new Date();
    const date7DaysAgo = getDateMinusDays(today, 7);

    return expense.date >= date7DaysAgo && expense.date <= today;
  });

  return (
    <ExpensesOutput
      expenses={recentExpenses}
      expensesPeriod="Last 7 Days"
      fallbackText="No expenses registered for the last 7 days."
    />
  );
}

export default RecentExpenses;
