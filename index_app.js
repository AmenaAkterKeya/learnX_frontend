let departmentData = [];
let instructorData = [];

document.addEventListener("DOMContentLoaded", function() {
  loadDepartments();
  loadInstructors().then(() => {
    getAllCourses();
  });
});

const loadDepartments = () => {
  fetch("https://learnx-ldys.onrender.com/course/department/")
      .then((res) => res.json())
      .then((data) => {
          departmentData = data;
          const departmentContainer = document.getElementById("department-row");
          data.forEach((department) => {
              const departmentElement = document.createElement("div");
              departmentElement.innerHTML = `<p class="de" onclick="handleDepartmentClick('${department.name}')">${department.name}</p>`;
              departmentContainer.appendChild(departmentElement);
          });
      })
      .catch((error) => console.error('Error fetching departments:', error));
};

const loadInstructors = () => {
  return fetch("https://learnx-ldys.onrender.com/account/InstructorList/")
      .then((res) => res.json())
      .then((data) => {
          instructorData = data;
        //   console.log('Fetched Instructors:', instructorData); 
      })
      .catch((error) => {
          console.error('Error fetching instructors:', error);
          throw error; 
      });
};

const getAllCourses = (departmentName = '') => {
    const url = departmentName 
                ? `https://learnx-ldys.onrender.com/course/courses/?search=${departmentName}` 
                : "https://learnx-ldys.onrender.com/course/courses/";
  
    fetch(url)
        .then((res) => res.json())
        .then((courses) => {
            const coursesContainer = document.getElementById("courses-row");
            coursesContainer.innerHTML = ""; // Clear previous courses
            courses.forEach((course) => {
                const departmentNames = course.department.map(deptId => {
                    const department = departmentData.find(dept => dept.id === deptId);
                    return department ? department.name : 'Unknown';
                });
  
                // console.log('Course:', course); // Debugging statement
                const instructor = instructorData.find(inst => inst.id === course.instructor);
                // console.log('Instructor:', instructor); // Debugging statement
                const instructorName = instructor ? `${instructor.user.first_name} ${instructor.user.last_name}` : 'Unknown';
  
                const courseElement = document.createElement("div");
                courseElement.classList.add("col-sm-4");
                courseElement.innerHTML = `
                    <div class="card">
                        <img src="${course.image}" class="card-img-top" alt="${course.title}">
                        <div class="card-body">
                            <h5 class="card-title">${course.title}</h5>
                            <h6 class="card-subtitle">${instructorName}</h6>
                            <p class="card-text">${course.content.slice(0, 100)}...</p>
                            <p class="card-text" >
                                <strong style="color: #685F78; letter-spacing: 1px;">Departments:</strong>
                                ${departmentNames.map(department => `<span class="card_de">${department}</span>`).join(' ')}
                            </p>
                            
                            <div class="d-flex justify-content-between">
                                <p>Lessons:  <span style="color:#f66962">${course.lesson} </span><i class="fa-regular fa-clock"></i></p>
                                <p>Fee: <span style="color:#f66962">$${course.fee}</span></p>
                            </div>
                            <a href="./index_course_details.html?id=${course.id}" class="btn" style="background-color: #f66962; color: white;">Learn More</a>
                        </div>
                    </div>
                `;
                coursesContainer.appendChild(courseElement);
            });
        })
        .catch((error) => console.error('Error fetching courses:', error));
  };
  

const handleDepartmentClick = (departmentName) => {
  getAllCourses(departmentName);
};