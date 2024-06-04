import axios from "axios";

const BACKEND_URL = "https://tracker-expense-rn-default-rtdb.firebaseio.com";

export async function storeExpense(expenseData) {
  const res = await axios.post(`${BACKEND_URL}/expenses.json`, expenseData);

  // firebase use name instead of ID
  const id = res.data.name;
  return id;
}

export async function getExpense() {
  const res = await axios.get(`${BACKEND_URL}/expenses.json`);

  const expense = [];

  for (key in res.data) {
    const expenseObj = {
      id: key,
      amount: res.data[key].amount,
      date: new Date(res.data[key].date),
      description: res.data[key].description,
    };

    expense.push(expenseObj);
  }

  return expense;
}

export function updateExpenses(id, expensesData) {
  return axios.put(`${BACKEND_URL}/expenses/${id}.json`, expensesData);
}

export function deleteExpenses(id) {
  return axios.delete(`${BACKEND_URL}/expenses/${id}.json`);
}
