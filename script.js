// Selecting elements from DOM
const expenseNameInput = document.getElementById("expense-name");
const expenseAmountInput = document.getElementById("expense-amount");
const expenseDateInput = document.getElementById("expense-date"); // Date input
const addExpenseBtn = document.getElementById("add-expense-btn");
const expenseList = document.getElementById("expense-list");
const totalExpenseDisplay = document.getElementById("total-expense");
const expenseCategory = document.getElementById("expense-category");
const progressBar = document.querySelector(".progress");
const budgetInput = document.getElementById("budget");
const themeBtn = document.getElementById("theme-btn");
const refreshBtn = document.getElementById("refresh-btn");

let totalExpense = 0;
let budget = 0;
let expenses = [];

// Function to update progress bar based on budget
function updateProgressBar() {
  if (budget > 0) {
    const progress = (totalExpense / budget) * 100;
    progressBar.style.width = `${Math.min(progress, 100)}%`;
    progressBar.style.backgroundColor = progress >= 100 ? '#d9534f' : '#5cb85c';
  }
}

// Function to reset everything on refresh
function refreshPage() {
  totalExpense = 0;
  budget = 0;
  expenses = [];
  totalExpenseDisplay.textContent = '0.00';
  budgetInput.value = '';
  expenseList.innerHTML = '';
  progressBar.style.width = '0';
  localStorage.clear(); // Clear stored data
}

// Load expenses from localStorage on page load
window.onload = function() {
  const storedExpenses = JSON.parse(localStorage.getItem("expenses")) || [];
  const storedBudget = JSON.parse(localStorage.getItem("budget")) || 0;

  expenses = storedExpenses;
  budget = storedBudget;
  budgetInput.value = budget;

  expenses.forEach(expense => addExpenseToDOM(expense));
  totalExpense = storedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
  totalExpenseDisplay.textContent = totalExpense.toFixed(2);
  updateProgressBar();
};

// Function to add expense
function addExpense() {
  const expenseName = expenseNameInput.value.trim();
  const expenseAmount = parseFloat(expenseAmountInput.value);
  const expenseDate = expenseDateInput.value; // Capture the date
  const category = expenseCategory.value;

  if (expenseName === "" || isNaN(expenseAmount) || expenseAmount <= 0 || !expenseDate) {
    alert("Please enter valid expense details");
    return;
  }

  const newExpense = {
    name: expenseName,
    amount: expenseAmount,
    date: expenseDate, // Store the date of the expense
    category: category
  };

  expenses.push(newExpense);
  localStorage.setItem("expenses", JSON.stringify(expenses));

  addExpenseToDOM(newExpense);

  totalExpense += expenseAmount;
  totalExpenseDisplay.textContent = totalExpense.toFixed(2);

  expenseNameInput.value = "";
  expenseAmountInput.value = "";
  expenseDateInput.value = ""; // Clear date input
  updateProgressBar();
}

// Function to add expense to the DOM with a delete button
function addExpenseToDOM(expense) {
  const expenseItem = document.createElement("li");
  expenseItem.innerHTML = `${expense.name} - ₹${expense.amount.toFixed(2)} (${expense.category}) <span>${expense.date}</span>
    <button class="delete-btn">Delete</button>`; // Include delete button

  expenseList.appendChild(expenseItem);

  // Add event listener for delete functionality
  const deleteBtn = expenseItem.querySelector(".delete-btn");
  deleteBtn.addEventListener("click", function() {
    deleteExpense(expense);
    expenseItem.remove(); // Remove from the DOM
  });
}

// Function to delete an expense
function deleteExpense(expenseToDelete) {
  expenses = expenses.filter(expense => expense !== expenseToDelete);
  localStorage.setItem("expenses", JSON.stringify(expenses));
  totalExpense -= expenseToDelete.amount;
  totalExpenseDisplay.textContent = totalExpense.toFixed(2);
  updateProgressBar();
}

// Event listener for adding expense
addExpenseBtn.addEventListener("click", addExpense);

// Event listener for budget input
budgetInput.addEventListener("change", function() {
  budget = parseFloat(budgetInput.value);
  totalExpenseDisplay.textContent = totalExpense.toFixed(2);
  updateProgressBar();
  localStorage.setItem("budget", JSON.stringify(budget));
});

// Theme switching functionality
themeBtn.addEventListener("click", function() {
  document.body.classList.toggle("dark");
  themeBtn.classList.toggle("dark-mode");
  themeBtn.textContent = document.body.classList.contains("dark") ? "Switch to Light Mode" : "Switch to Dark Mode";
});

// Event listener for refresh button
refreshBtn.addEventListener("click", refreshPage);
