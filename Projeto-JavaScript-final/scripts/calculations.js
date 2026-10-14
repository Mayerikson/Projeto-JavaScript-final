let budgetValue = 0;
let totalExpensesValue = 0;
let balanceColor = "green";

const expenseEntries = [
  ["groceries", 33],
  ["restaurants", 50],
  ["transport", 12],
  ["home", 70],
  ["subscriptions", 14],
  ["groceries", 28],
  ["subscriptions", 12],
];

const expenseCategories = [
  "groceries",
  "restaurants",
  "transport",
  "home",
  "subscriptions",
];

function calculateExpensesTotal() {
  totalExpensesValue = 0;

  for (const expense of expenseEntries) {
    totalExpensesValue += expense[1];
  }

  return totalExpensesValue;
}

function calculateAverageExpense() {
  if (expenseEntries.length === 0) {
    return 0;
  }

  return totalExpensesValue / expenseEntries.length;
}

function calculateBalance() {
  return budgetValue - totalExpensesValue;
}

function updateBalanceColor() {
  const balance = calculateBalance();

  if (balance < 0) {
    balanceColor = "red";
  } else if (balance < budgetValue * 0.25) {
    balanceColor = "orange";
  } else {
    balanceColor = "green";
  }
}

function calculateCategoryExpenses(category) {
  let categoryTotal = 0;

  for (const expense of expenseEntries) {
    if (expense[0] === category) {
      categoryTotal += expense[1];
    }
  }

  return categoryTotal;
}

function calculateLargestCategory() {
  let largestCategory = expenseCategories[0];
  let largestTotal = -1;

  for (const category of expenseCategories) {
    const categoryTotal = calculateCategoryExpenses(category);

    if (categoryTotal > largestTotal) {
      largestCategory = category;
      largestTotal = categoryTotal;
    }
  }

  return largestCategory;
}

function addExpenseEntry(newExpense) {
  if (
    !Array.isArray(newExpense) ||
    newExpense.length !== 2 ||
    !expenseCategories.includes(newExpense[0]) ||
    !Number.isFinite(newExpense[1]) ||
    newExpense[1] < 0
  ) {
    return false;
  }

  expenseEntries.push(newExpense);
  totalExpensesValue += newExpense[1];
  return true;
}

calculateExpensesTotal();
