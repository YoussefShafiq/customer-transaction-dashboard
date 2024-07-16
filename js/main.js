document.addEventListener("DOMContentLoaded", () => {
    const customerTableBody = document.querySelector("#customerTable tbody");
    const nameFilter = document.getElementById("nameFilter");
    const amountFilter = document.getElementById("amountFilter");
    const transactionChart = document.getElementById("transactionsChart")
    let customers = [];
    let transactions = [];
    let selectedCustomer = null;
    let displayedchart = null;

    async function fetchData() {
        let customersresp = await fetch('https://my-json-server.typicode.com/YoussefShafiq/customer-transaction-dashboard/customers')
        customers = await customersresp.json()
        let transactionsresp = await fetch('https://my-json-server.typicode.com/YoussefShafiq/customer-transaction-dashboard/transactions')
        transactions = await transactionsresp.json()
        displayTable();
    }
    fetchData();
    function displayTable() {
        customerTableBody.innerHTML = "";
        const filteredCustomers = customers.filter(customer =>
            customer.name.toLowerCase().includes(nameFilter.value.toLowerCase())
        );
        const filteredTransactions = transactions.filter(transaction => transaction.amount >= amountFilter.value);


        filteredTransactions.forEach(transaction => {
            filteredCustomers.forEach(customer => {
                if (transaction.customer_id == customer.id) {
                    const row = document.createElement("tr");
                    row.innerHTML = `
                        <td>${transaction.id}</td>
                        <td>${customer.name}</td>
                        <td>${transaction.date}</td>
                        <td>${transaction.amount}</td>
                    `
                    row.addEventListener("click", () => {
                        selectedCustomer = customer;
                        displayChart();
                    });
                    customerTableBody.appendChild(row);
                }
            })
        })

    }


    function displayChart() {
        const customerTransactions = transactions.filter(t => t.customer_id == selectedCustomer.id);
        const chartData = {
            labels: customerTransactions.map(t => t.date),
            datasets: [{
                label: selectedCustomer.name + "'s Transaction Amount",
                data: customerTransactions.map(t => t.amount),
                backgroundColor: "#09c",
                borderColor: "#09c",
                fill: false
            }]
        };

        displayedchart = new Chart(transactionChart, {
            type: "line",
            data: chartData,
            options: {
                responsive: true,
                scales: {
                    x: {
                        type: "category",
                        labels: customerTransactions.map(t => t.date)
                    }
                }
            }
        });
    }

    nameFilter.addEventListener("input", displayTable);
    amountFilter.addEventListener("input", displayTable);

});








