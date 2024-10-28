document.addEventListener('DOMContentLoaded', () => {
    const depositForm = document.getElementById('depositForm');

    if (!depositForm) {
        
        return;
    }

    depositForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const amount = document.getElementById('amount').value;
        const token = localStorage.getItem("token");

        if (amount < 200) {
            alert("Please enter an amount of at least 200 BDT.");
            return;
        }

        try {
            const response = await fetch('https://learn-x-seven.vercel.app/course/deposit/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Token ${token}`,
                },
                body: JSON.stringify({ amount })
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || 'Failed to initiate payment.');

            if (data.url) {
                window.location.href = data.url;
            } else {
                alert('Payment URL not received.');
            }

        } catch (error) {
            console.error('Error:', error);
            alert('Failed to initiate payment. Please try again.');
        }
    });

    getUpdatedBalance();
});
const getUpdatedBalance = () => {
    const balanceViewUrl = 'https://learn-x-seven.vercel.app/course/balance/';
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
        const errorElement = document.getElementById('error');
        errorElement.textContent = error.message; 
        errorElement.style.display = 'block'; 
    });
};

document.addEventListener('DOMContentLoaded', () => {
    getUpdatedBalance();
});


