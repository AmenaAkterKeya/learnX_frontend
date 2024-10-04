const addDeposit = (event) => {
    event.preventDefault(); 

    const depositAmount = parseFloat(document.getElementById('deposit-amount').value); // Retrieve and parse deposit amount
    const token = localStorage.getItem("token");


    if (isNaN(depositAmount) || depositAmount < 200) {
        document.getElementById('error').textContent = 'Your deposit must be $200 or more.';
        document.getElementById('error').style.display = 'block'; 
        return;
    }

    console.log("Token:", token);
    console.log("Deposit Amount:", depositAmount); 
    const addAmountUrl = "https://learn-x-seven.vercel.app/course/balance/";

    fetch(addAmountUrl, {
        method: "POST",
        headers: {
            "Authorization": `Token ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: depositAmount }), 
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.error);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Deposit successful:', data);
        window.location.href = "student_profile.html"
        getUpdatedBalance();
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('error').textContent = error.message; 
        document.getElementById('error').style.display = 'block'; 
    });
};

// Function to fetch and display the updated balance
const getUpdatedBalance = () => {
    const balanceViewUrl = 'https://learn-x-seven.vercel.app/course/balanceview/';
    const token = localStorage.getItem("token");

    fetch(balanceViewUrl, {
        method: 'GET',
        headers: {
            'Authorization': `Token ${token}`,
            'Content-Type': 'application/json',
        },
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => {
                throw new Error(data.error);
            });
        }
        return response.json();
    })
    .then(data => {
        console.log('Updated Balance:', data.updated_balance);
        document.getElementById('current-balance').textContent = data.updated_balance;
    })
    .catch(error => {
        console.error('Error:', error);
        document.getElementById('error').textContent = error.message; 
        document.getElementById('error').style.display = 'block'; 
    });
};

document.addEventListener('DOMContentLoaded', () => {
    getUpdatedBalance();
});
