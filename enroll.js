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
            if (data.length === 0) {
                noDataInstructor.style.display = "flex";
                noDataInstructor.style.justifyContent = "center";
                tableCap.style.display = "none";  
                tableBody.innerHTML = ''; 
            } else {
                noDataInstructor.style.display = "none";  
                tableCap.style.display = "table-header-group"; 
                tableBody.innerHTML = ''; 

                data.forEach((item, index) => {
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

loadstudentIdOne();
