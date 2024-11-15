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
    const apiUrl = `https://learn-x-seven.vercel.app/course/listCourses/?instructor_id=${instructor_id}`;

    if (!instructor_id) {
        console.error('No instructor ID found in local storage.');
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
            // Check if data is an array and contains at least one element
            if (Array.isArray(data) && data.length > 0) {
                const firstItem = data[0]; // Get the first item in the array

                // Check if the required properties exist
                if (firstItem.total_enrollments && firstItem.total_amount) {
                    document.getElementById("total-deposit").textContent = `${firstItem.total_enrollments}`;
                    document.getElementById("total-purchase").textContent = `$${firstItem.total_amount}`;
                } else {
                    console.error('Invalid data structure:', firstItem);
                    document.getElementById("total-deposit").textContent = 'Error';
                    document.getElementById("total-purchase").textContent = 'Error';
                }
            } else {
                console.error('Invalid data format, expected an array with data:', data);
                document.getElementById("total-deposit").textContent = 'Error';
                document.getElementById("total-purchase").textContent = 'Error';
            }
        })
        .catch(error => {
            console.error('Error fetching data:', error);
            document.getElementById("total-deposit").textContent = 'Error';
            document.getElementById("total-purchase").textContent = 'Error';
        });
});


async function fetchCourses() {
    const instructor_id = localStorage.getItem("instructor_id");
    const coursesUrl = `https://learn-x-seven.vercel.app/course/courses/?instructor_id=${instructor_id}`; 
    const enrollmentsUrl = `https://learn-x-seven.vercel.app/course/listCourses/?instructor_id=${instructor_id}`;

    try {
       
        const courseResponse = await fetch(coursesUrl);
        if (!courseResponse.ok) throw new Error('Network response was not ok from courses API');
        const coursesData = await courseResponse.json();


        const enrollmentsResponse = await fetch(enrollmentsUrl);
        if (!enrollmentsResponse.ok) throw new Error('Network response was not ok from enrollments API');
        const enrollmentsData = await enrollmentsResponse.json();

        const courseTableBody = document.getElementById('course-table-body');
        courseTableBody.innerHTML = ''; 

        coursesData.forEach((course, index) => {

            const totalEnrollments = enrollmentsData[index]?.total_enrollments || 0;

            const row = document.createElement('tr');
            row.innerHTML = `
                <td class="text-center">${index + 1}</td>
                <td> 
                    <a href="./course_detail.html?id=${course.id}" style="text-decoration: none; color: #f66962; font-size: 18px;">
                        ${course.title}
                    </a>
                </td>
                <td class="text-center">${course.fee}</td>
                <td class="text-center">${course.lesson}</td>
                <td class="text-center">${totalEnrollments}</td>
                <td class="text-center">
                    <a href="./course_detail.html?id=${course.id}" type="button" class="btn btn-primary btn-sm">Details</a>
                </td>
            `;
            courseTableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

document.addEventListener("DOMContentLoaded", function () {
    const instructor_id = localStorage.getItem("instructor_id");
    const url = `https://learn-x-seven.vercel.app/course/listCourses/?instructor_id=${instructor_id}`;
    const ctx = document.getElementById('chColumn').getContext('2d');
    const loadingMessage = document.getElementById('loading-message');

    if (!instructor_id) {
        console.error('No instructor ID found in local storage.');
        if (loadingMessage) {
            loadingMessage.innerHTML = 'Instructor ID is missing. Please log in.';
        }
        return;
    }

    fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            return response.json();
        })
        .then(data => {
            if (loadingMessage) {
                loadingMessage.style.display = 'none'; 
            }

            
            if (!Array.isArray(data) || data.length === 0) {
                console.error('No valid course data found.');
                if (loadingMessage) {
                    loadingMessage.innerHTML = 'No course data available.';
                }
                return;
            }

            const totalAmounts = data.map(course => course.total_amount || 0); 
            
            const labels = Array(data.length).fill('Total Enroll Amount'); 

            if (ctx) {
                new Chart(ctx, {
                    type: 'bar',
                    data: {
                        labels: labels,
                        datasets: [{
                            label: 'Total Enroll Amount',
                            data: totalAmounts,
                            backgroundColor: 'rgba(54, 162, 235, 0.6)',
                            borderColor: 'rgba(54, 162, 235, 1)',
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
            } else {
                console.error('Chart context not found.');
                if (loadingMessage) {
                    loadingMessage.innerHTML = 'Error initializing chart.';
                }
            }
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
