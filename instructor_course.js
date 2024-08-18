const loadInstructorIdOne = () => {
    const user_id = localStorage.getItem("user_id");

    fetch(`https://learnx-ldys.onrender.com/account/InstructorList/?user_id=${user_id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log(data);
        localStorage.setItem("instructor_id", data[0].id);
        loadCourses(); 
      });
};

const loadCourses = () => {
    const instructor_id = localStorage.getItem("instructor_id");
    if (!instructor_id) {
        console.error("Instructor ID not found in localStorage.");
        return;
    }

    let courseCounter = 1;
    fetch(`https://learnx-ldys.onrender.com/course/courses/?instructor_id=${instructor_id}`)
        .then((res) => {
            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }
            return res.json();
        })
        .then((data) => {
            console.log("Courses data:", data);
            const parent = document.getElementById("table-body");
            const tab = document.getElementById("table_cap");
            const noDataInstructor = document.getElementById("nodata_instructor");

            if (data.length === 0) {
                    noDataInstructor.style.display = "flex";
                    noDataInstructor.style.justifyContent = "center";
                    tab.style.display = "none";  
                    parent.innerHTML = ''; 
            } else {

                    noDataInstructor.style.display = "none";  
 
                tab.style.display = "contents"; 
                parent.innerHTML = ''; 
                data.forEach((item) => {
                    const tr = document.createElement("tr");
                    tr.innerHTML = `
                        <td>${courseCounter++}</td>
                        <td><a href="./course_detail.html?id=${item.id}" style="text-decoration: none; color: #f66962; font-size: 18px;">${item.title}</a></td>
                        <td>${item.lesson}</td>
                        <td>${item.fee}</td>
                        <td>
                            <button type="button" class="btn btn-primary edit-btn" data-bs-toggle="modal" data-bs-target="#editModal" data-id="${item.id}" style="background-color: #f66962; border:none;"><i class="fa-solid fa-pen-to-square" data-id="${item.id}"></i></button>
                            <button class="btn btn-danger delete-btn" data-id="${item.id}" style="background-color: #685F78; border:none;margin-left: 8px;"><i class="fa-solid fa-trash delete-btn" data-id="${item.id}"></i></button>
                        </td>
                    `;
                    parent.appendChild(tr);
                });

                document.querySelectorAll(".edit-btn").forEach(button => {
                    button.addEventListener("click", handleEditButtonClick);
                });

                document.querySelectorAll(".delete-btn").forEach(button => {
                    button.addEventListener("click", handleDeleteButtonClick);
                });
            }
        })
        .catch(error => {
            console.error('Error fetching courses:', error);
        });
};


function fetchDepartments() {
    fetch('https://learnx-ldys.onrender.com/course/department/')
        .then(response => response.json())
        .then(data => {
            const departmentSelect = document.getElementById('edit-department');
            data.forEach(department => {
                const option = document.createElement('option');
                option.value = department.id;
                option.text = department.name;
                departmentSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching departments:', error));
}


const handleEditButtonClick = (event) => {
    const courseId = event.target.getAttribute("data-id");
    fetch(`https://learnx-ldys.onrender.com/course/courses/${courseId}/`)
      .then(res => res.json())
      .then(data => {
        document.getElementById("edit-title").value = data.title;
        document.getElementById("edit-content").value = data.content;
        document.getElementById("edit-lesson").value = data.lesson;
        document.getElementById("edit-fee").value = data.fee;
        document.getElementById("edit-department").value = data.department; 
        document.getElementById("editCourseForm").setAttribute("data-id", courseId);
      });
};


document.getElementById("editCourseForm").addEventListener("submit", (event) => {
    event.preventDefault();
    const courseId = event.target.getAttribute("data-id");
    const updatedCourse = {
        title: document.getElementById("edit-title").value,
        content: document.getElementById("edit-content").value,
        lesson: document.getElementById("edit-lesson").value,
        fee: document.getElementById("edit-fee").value,
        department: [document.getElementById("edit-department").value],

    };

    const imageFile = document.getElementById("edit-image").files[0]; 
    if (imageFile) {
        // Upload image to imgBB
        const imgbbApiKey = "830c9f2bc90e1ac3e4c2d15fb60628d2";
        const imgbbFormData = new FormData();
        imgbbFormData.append("image", imageFile);

        fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
            method: "POST",
            body: imgbbFormData,
        })
        .then((response) => {
            if (!response.ok) {
                throw new Error('Image upload failed');
            }
            return response.json();
        })
        .then((imgbbData) => {
            const imageUrl = imgbbData.data.url;
            console.log("Image URL:", imageUrl);
            updatedCourse.image = imageUrl; 

            fetch(`https://learnx-ldys.onrender.com/course/courses/${courseId}/`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(updatedCourse),
            })
            .then(response => response.json())
            .then(updatedData => {
                console.log("Updated Course Data:", updatedData); 
                loadCourses();
                document.querySelector("#editModal .btn-close").click(); 
                window.location.href = "profile.html"; 
            })
            .catch((error) => {
                console.error('Error updating course:', error);
            });
        })
        .catch((error) => {
            console.error('Image upload error:', error);
        });
    } else {
        
        fetch(`https://learnx-ldys.onrender.com/course/courses/${courseId}/`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(updatedCourse),
        })
        .then(response => response.json())
        .then(updatedData => {
            // console.log("Updated Course Data:", updatedData); 
            loadCourses();
            document.querySelector("#editModal .btn-close").click(); 
            window.location.href = "profile.html"; 
        })
        .catch((error) => {
            console.error('Error updating course:', error);
        });
    }
});



const handleDeleteButtonClick = (event) => {
    const courseId = event.target.getAttribute("data-id");
    const tab = document.getElementById("table_cap");
    fetch(`https://learnx-ldys.onrender.com/course/courses/${courseId}/`, {
        method: "DELETE",
    }).then(() => {
        loadCourses();
    });
};




loadInstructorIdOne();
fetchDepartments();