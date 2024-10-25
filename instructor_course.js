const loadInstructorIdOne = () => {
    const user_id = localStorage.getItem("user_id");

    fetch(`https://learn-x-seven.vercel.app/account/InstructorList/?user_id=${user_id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        localStorage.setItem("instructor_id", data[0].id);
        
      });
};

document.addEventListener("DOMContentLoaded", function() {
   
    const instructor_id = localStorage.getItem("instructor_id");
    const apiUrl = `https://learn-x-seven.vercel.app/account/InstructorList/${instructor_id}`;

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
    const instructor_id = localStorage.getItem("instructor_id");
    const apiUrl = `https://learn-x-seven.vercel.app/course/courses/${instructor_id}`;
    if (!instructor_id) {
        console.error('No student ID found in local storage.');
        document.getElementById("total-deposit").textContent = 'No ID';
        document.getElementById("total-purchase").textContent = 'No ID';
       
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
            
            document.getElementById("total-deposit").textContent = `${data.total_enrollments || 0}`;
            document.getElementById("total-purchase").textContent = `$${data.total_amount || 0}`;
           
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            
            document.getElementById("total-deposit").textContent = 'Error';
            document.getElementById("total-purchase").textContent = 'Error';
          
        });
});

async function fetchCourses() {
    const instructor_id = localStorage.getItem("instructor_id");
    const url = `https://learn-x-seven.vercel.app/course/courses/?instructor_id=${instructor_id}`; // Change instructorId to instructor_id
    
    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('Network response was not ok');

        const data = await response.json();

        const courseTableBody = document.getElementById('course-table-body');
        courseTableBody.innerHTML = ''; 

        data.forEach((course, index) => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="text-center">${index + 1}</td>
                <td> <a href="./course_detail.html?id=${course.id}" style="text-decoration: none; color: #f66962; font-size: 18px;">${course.title}</a></td>
                <td class="text-center">${course.fee}</td>
                <td class="text-center">${course.lesson}</td>
                <td class="text-center">${course.total_enrollments}</td>
                <td class="text-center">
                     <a href="./course_detail.html?id=${course.id}" type="button" class="btn btn-primary btn-sm">Details</a>
                </td>
            `;
            courseTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching courses:', error);
    }
}
document.addEventListener("DOMContentLoaded", function() { 
    const instructor_id = localStorage.getItem("instructor_id");
    const url = `https://learn-x-seven.vercel.app/course/courses/?instructor_id=${instructor_id}`;
    const ctx = document.getElementById('chColumn').getContext('2d'); // Match the canvas ID here
    const loadingMessage = document.getElementById('loading-message');

    // Check if instructor_id exists
    if (!instructor_id) {
        console.error('No instructor ID found in local storage.');
        return;
    }

    fetch(url) // Use the correct URL
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            console.log(data); // Log the API response for debugging
            const totalDepositAmount = data.total_deposit_amount || 0;
            const totalCourseFee = data.course_fee || 0; // Adjusted to fetch course_fee

            // Hide loading message if it exists
            if (loadingMessage) {
                loadingMessage.style.display = 'none';
            }

            new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: ['Total Deposit Amount', 'Total Course Fee'],
                    datasets: [{
                        label: 'Amount ($)',
                        data: [1000, 500], // Static values for testing
                        backgroundColor: [
                            'rgba(54, 162, 235, 0.6)',
                            'rgba(255, 99, 132, 0.6)'
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




document.addEventListener('DOMContentLoaded', fetchCourses);
loadInstructorIdOne();
