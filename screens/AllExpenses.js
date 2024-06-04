import { useContext } from "react";
import ExpensesOutput from "../components/ExpensesOutput/ExpensesOutput";
import { ExpensesContext } from "../store/expense-context";

function AllExpenses() {
  const expenseCtx = useContext(ExpensesContext);

  return (
    <ExpensesOutput
      expenses={expenseCtx.expenses}
      expensesPeriod="Total"
      fallBackText="No expenses registered found!!"
    />
  );
}

export default AllExpenses;
