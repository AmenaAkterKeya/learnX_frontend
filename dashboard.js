const loadstudentIdOne = () => {
    const user_id = localStorage.getItem("user_id");

    fetch(`https://learn-x-seven.vercel.app/account/StudentList/?user_id=${user_id}`)
        .then(res => res.json())
        .then(data => {
            console.log(data);
            localStorage.setItem("student_id", data[0].id);
             loadStudentCourses(); 
        })
        .catch(error => {
            console.error('Error fetching student ID:', error);
        });
};

const loadStudentCourses = () => {
    const student_id = localStorage.getItem("student_id");
    if (!student_id) {
        console.error("Student ID not found in localStorage.");
        return;
    }

    const tableBody = document.getElementById('table-body');
    const tableCap = document.getElementById('table_cap');
    const noDataInstructor = document.getElementById("nodata_instructor");

    fetch(`https://learn-x-seven.vercel.app/course/enrollview/${student_id}`)
        .then(response => response.json())
        .then(data => {
            console.log("Courses Data:", data); // Log the response for debugging

            // Access the enrolled_courses array from the data object
            const enrolledCourses = data.enrolled_courses;

            // Check if enrolledCourses is an array
            if (!Array.isArray(enrolledCourses)) {
                console.error("Unexpected data format: enrolled_courses is not an array", enrolledCourses);
                noDataInstructor.style.display = "flex";
                noDataInstructor.style.justifyContent = "center";
                tableCap.style.display = "none";  
                tableBody.innerHTML = ''; 
                return;
            }

            if (enrolledCourses.length === 0) {
                noDataInstructor.style.display = "flex";
                noDataInstructor.style.justifyContent = "center";
                tableCap.style.display = "none";  
                tableBody.innerHTML = ''; 
            } else {
                noDataInstructor.style.display = "none";  
                tableCap.style.display = "table-header-group"; 
                tableBody.innerHTML = ''; 

                enrolledCourses.forEach((item, index) => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td>${index + 1}</td>
                        <td><a href="./student_course_details.html?id=${item.course_id}" style="text-decoration: none; color: #f66962; font-size: 18px;">${item.course_title}</a></td>
                        <td>${item.instructor}</td>
                        <td>$${item.course_fee}</td>
                        <td>${item.course_lesson}</td>
                    `;
                    tableBody.appendChild(tr);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching courses:', error);
            noDataInstructor.style.display = 'flex';
            noDataInstructor.style.justifyContent = 'center';
        });
};

// document.addEventListener('DOMContentLoaded', async () => {
//     try {
//         const token = localStorage.getItem("token");
//         const response = await fetch('https://learn-x-seven.vercel.app/course/balance/', {
//             method: 'GET',
//             headers: {
//                 'Authorization': `Token ${token}`,
//             }
//         });

//         // Check if the response is OK
//         if (!response.ok) {
//             throw new Error('Failed to fetch data.');
//         }

//         const data = await response.json();
//         const deposits = data.deposits; // Assuming your API response has a 'deposits' field
//         const tableBody = document.getElementById('table-body');
//         const tableCap = document.getElementById('table_cap');
//         const noDataDiv = document.getElementById('nodata_instructor');

//         // If there are deposits, populate the table
//         if (deposits.length > 0) {
//             tableCap.style.display = ''; // Show table header
//             deposits.forEach(deposit => {
//                 const row = document.createElement('tr');
//                 row.style.fontSize = "20px";

//                 // Create table cells for ID, Amount, and Time
//                 const idCell = document.createElement('td');
//                 idCell.textContent = deposit.id; // Replace with actual ID if available
//                 row.appendChild(idCell);

//                 const amountCell = document.createElement('td');
//                 amountCell.textContent = deposit.amount; // Amount from your API
//                 row.appendChild(amountCell);

//                 const timeCell = document.createElement('td');
//                 timeCell.textContent = deposit.created_on; // Formatted date from your API
//                 row.appendChild(timeCell);

//                 tableBody.appendChild(row);
//             });
//         } else {
           
//             tableCap.style.display = 'none';
//             noDataDiv.style.display = 'block'; 
//         }
//     } catch (error) {
//         console.error('Error:', error);
//         alert('Payment doesnot successful');
//     }
// });
loadstudentIdOne()