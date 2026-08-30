// ========================================
// STUDENT POCKET MONEY TRACKER
// JavaScript
// ========================================
// ---------- Get HTML Elements ----------

const transactionForm = document.getElementById("transactionForm");

const transactionType = document.getElementById("transactionType");
const amountInput = document.getElementById("amount");
const categoryInput = document.getElementById("category");
const dateInput = document.getElementById("date");
const noteInput = document.getElementById("note");

const totalBalance = document.getElementById("totalBalance");
const totalIncome = document.getElementById("totalIncome");
const totalExpense = document.getElementById("totalExpense");

const transactionList = document.getElementById("transactionList");
const transactionCount = document.getElementById("transactionCount");
const emptyState = document.getElementById("emptyState");


// ---------- Transaction Array ----------

let transactions = JSON.parse(localStorage.getItem("transactions")) || [];


// ---------- Set Today's Date ----------

const today = new Date();

const year = today.getFullYear();
const month = String(today.getMonth() + 1).padStart(2, "0");
const day = String(today.getDate()).padStart(2, "0");

dateInput.value = `${year}-${month}-${day}`;


// ---------- Add Transaction ----------

transactionForm.addEventListener("submit", function (event) {

    event.preventDefault();

    const type = transactionType.value;
    const amount = Number(amountInput.value);
    const category = categoryInput.value;
    const date = dateInput.value;
    const note = noteInput.value.trim();


    // Check amount

    if (amount <= 0) {
        alert("Please enter a valid amount.");
        return;
    }


    // Create transaction object

    const transaction = {
        id: Date.now(),
        type: type,
        amount: amount,
        category: category,
        date: date,
        note: note
    };


    // Add transaction to array

    transactions.push(transaction);


    // Save to localStorage

    saveTransactions();


    // Update the screen

    displayTransactions();
    updateSummary();


    // Reset form

    transactionForm.reset();


    // Put today's date back

    dateInput.value = `${year}-${month}-${day}`;

});


// ---------- Save Transactions ----------

function saveTransactions() {

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );

}


// ---------- Display Transactions ----------

function displayTransactions() {

    transactionList.innerHTML = "";


    // Show empty message

    if (transactions.length === 0) {

        transactionList.appendChild(emptyState);

        transactionCount.textContent = "0";

        return;
    }


    // Show transaction count

    transactionCount.textContent = transactions.length;


    // Display newest transaction first

    const reversedTransactions = [...transactions].reverse();


    reversedTransactions.forEach(function (transaction) {

        const transactionItem = document.createElement("div");

        transactionItem.classList.add(
            "transaction-item",
            transaction.type
        );


        // Transaction icon

        const icon = transaction.type === "income"
            ? "fa-arrow-down"
            : "fa-arrow-up";


        // Plus or minus sign

        const sign = transaction.type === "income"
            ? "+"
            : "-";


        // Format date

        const formattedDate = formatDate(transaction.date);


        transactionItem.innerHTML = `

            <div class="transaction-left">

                <div class="transaction-icon">

                    <i class="fa-solid ${icon}"></i>

                </div>

                <div class="transaction-details">

                    <h3>${transaction.category}</h3>

                    <p>${transaction.note || "No note"} • ${formattedDate}</p>

                </div>

            </div>


            <div class="transaction-right">

                <strong>
                    ${sign}₹${transaction.amount.toLocaleString("en-IN")}
                </strong>

                <button
                    class="delete-button"
                    onclick="deleteTransaction(${transaction.id})"
                    title="Delete transaction"
                >
                    <i class="fa-solid fa-trash"></i>
                </button>

            </div>

        `;


        transactionList.appendChild(transactionItem);

    });

}


// ---------- Format Date ----------

function formatDate(date) {

    const dateObject = new Date(date + "T00:00:00");

    return dateObject.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
    });

}


// ---------- Delete Transaction ----------

function deleteTransaction(id) {

    const confirmation = confirm(
        "Are you sure you want to delete this transaction?"
    );


    if (!confirmation) {
        return;
    }


    transactions = transactions.filter(function (transaction) {

        return transaction.id !== id;

    });


    saveTransactions();

    displayTransactions();

    updateSummary();

}


// ---------- Update Summary ----------

function updateSummary() {

    let income = 0;
    let expense = 0;


    transactions.forEach(function (transaction) {

        if (transaction.type === "income") {

            income += transaction.amount;

        } else if (transaction.type === "expense") {

            expense += transaction.amount;

        }

    });


    const balance = income - expense;


    // Update values

    totalIncome.textContent =
        `₹${income.toLocaleString("en-IN")}`;

    totalExpense.textContent =
        `₹${expense.toLocaleString("en-IN")}`;

    totalBalance.textContent =
        `₹${balance.toLocaleString("en-IN")}`;

}


// ---------- Initial Display ----------

displayTransactions();

updateSummary();