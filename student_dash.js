document.addEventListener("DOMContentLoaded", function() {
    const student_id = localStorage.getItem("student_id");
    console.log('Student ID:', student_id); // Log the student ID

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
            console.log('API Response:', data); // Log the data

            // Assuming data is an array of courses
            const recentCourses = data.slice(-4); // Get the last 4 courses
            tableBody.innerHTML = ''; // Clear the loading message

            if (recentCourses.length === 0) {
                tableBody.innerHTML = '<tr><td colspan="6" class="text-center">No courses found</td></tr>';
                return;
            }

            recentCourses.forEach((course, index) => {
                const row = document.createElement('tr');
                row.innerHTML = `
                    <td class="text-center text-muted">#${index + 1}</td>
                    <td>${course.course_title}</td>
                    <td class="text-center">$${course.course_fee}</td>
                    <td class="text-center">${course.course_lesson}</td>
                    <td class="text-center">${course.instructor}</td>
                    <td class="text-center">
                        <button type="button" class="btn btn-primary btn-sm">Details</button>
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