const loadstudentIdOne = () => {
    const user_id = localStorage.getItem("user_id");

    fetch(`https://learn-x-seven.vercel.app/account/StudentList/?user_id=${user_id}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            localStorage.setItem("student_id", data[0].id);
            // loadStudentCourses(); 
        })
        .catch(error => {
            console.error('Error fetching student ID:', error);
        });
};


document.addEventListener("DOMContentLoaded", function() {
   
    const studentId = localStorage.getItem("student_id");
    const apiUrl = `https://learn-x-seven.vercel.app/account/StudentList/${studentId}`;

    fetch(apiUrl)
        .then(response => {
           
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
           
            if (data.user && data.user.first_name && data.user.last_name) {
                document.getElementById("student-name").textContent = `${data.user.first_name} ${data.user.last_name}`;
            } else {
                console.error("Data does not contain 'first_name' or 'last_name'");
            }
        })
        .catch(error => console.error("Error fetching student data:", error));
});



document.addEventListener("DOMContentLoaded", function() {
    const student_id = localStorage.getItem("student_id"); // Retrieve student_id from local storage
    const apiUrl = `https://learn-x-seven.vercel.app/course/enrollview/${student_id}`;

    
    if (!student_id) {
        console.error('No student ID found in local storage.');
        document.getElementById("total-deposit").textContent = 'No ID';
        document.getElementById("total-purchase").textContent = 'No ID';
        document.getElementById("total-courses").textContent = 'No ID';
        return; 
    }

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            
            document.getElementById("total-deposit").textContent = `$${data.total_deposit_amount || 0}`;
            document.getElementById("total-purchase").textContent = `$${data.total_purchase_amount || 0}`;
            document.getElementById("total-courses").textContent = data.total_courses_purchased || 0;
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            
            document.getElementById("total-deposit").textContent = 'Error';
            document.getElementById("total-purchase").textContent = 'Error';
            document.getElementById("total-courses").textContent = 'Error';
        });
});
document.addEventListener("DOMContentLoaded", function() {
    const student_id = localStorage.getItem("student_id");
    console.log('Student ID:', student_id); 

    if (!student_id) {
        console.error('No student ID found in local storage.');
        return;
    }

    const apiUrl = `https://learn-x-seven.vercel.app/course/enrollview/${student_id}`;
    const tableBody = document.getElementById('course-table-body');
    tableBody.innerHTML = '<tr><td colspan="6" class="text-center"><span class="loading-spinner"></span> Loading...</td></tr>';

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log('API Response:', data);
            
           
            const recentCourses = data.enrolled_courses || []; 

            tableBody.innerHTML = ''; 

            if (recentCourses.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No courses found</td></tr>';
                return;
            }

            const lastCourses = recentCourses.slice(-4);
            lastCourses.forEach((course, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="text-center text-muted">#${index + 1}</td>
                    <td><a href="./student_course_details.html?id=${course.course_id}" style="text-decoration: none; color: #f66962; font-size: 18px;">${course.course_title}</a></td>
                    <td class="text-center">$${course.course_fee}</td>
                    <td class="text-center">${course.course_lesson}</td>
                    <td class="text-center">${course.instructor}</td>
                    <td class="text-center">
                        <a href="./student_course_details.html?id=${course.course_id}" type="button" class="btn btn-primary btn-sm">Details</a>
                    </td>
                `;
                tableBody.appendChild(row);
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            tableBody.innerHTML = '<tr><td colspan="6" class="text-center">Error loading courses</td></tr>';
        });
});


// column 
document.addEventListener("DOMContentLoaded", function() {
    const student_id = localStorage.getItem("student_id");
    const apiUrl = `https://learn-x-seven.vercel.app/course/enrollview/${student_id}`;

    if (!student_id) {
        console.error('No student ID found in local storage.');
        return;
    }

    const ctx = document.getElementById('chColumn').getContext('2d'); // Match the canvas ID here
    const loadingMessage = document.getElementById('loading-message');

    fetch(apiUrl)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            const totalDepositAmount = data.total_deposit_amount || 0;
            const totalPurchaseAmount = data.total_purchase_amount || 0;

            // Hide loading message
            if (loadingMessage) {
                loadingMessage.style.display = 'none';
            }

            // Create the chart
            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Total Deposit Amount', 'Total Purchase Amount'],
                    datasets: [{
                        label: 'Amount ($)',
                        data: [totalDepositAmount, totalPurchaseAmount],
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.6)', // Blue
                            'rgba(255, 99, 132, 0.6)'  // Red
                        ],
                        borderColor: [
                            'rgba(54, 162, 235, 1)',
                            'rgba(255, 99, 132, 1)'
                        ],
                        borderWidth: 3
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    },
                    responsive: true,
                    maintainAspectRatio: false,
                }
            });
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            if (loadingMessage) {
                loadingMessage.innerHTML = 'Error loading chart data';
            }
        });
});
loadstudentIdOne();