let departmentData = [];
let instructorData = [];

document.addEventListener("DOMContentLoaded", function() {
  loadDepartments();
  loadInstructors().then(() => {
    getAllCourses();
  });
});

const loadDepartments = () => {
  fetch("https://learn-x-seven.vercel.app/course/department/")
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
  return fetch("https://learn-x-seven.vercel.app/account/InstructorList/")
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
              ? `https://learn-x-seven.vercel.app/course/courses/?search=${departmentName}` 
              : "https://learn-x-seven.vercel.app/course/courses/";

  fetch(url)
      .then((res) => res.json())
      .then((courses) => {
          const coursesContainer = document.getElementById("courses-row");
          const noCoursesMessage = document.getElementById("no-courses-message");
          coursesContainer.innerHTML = ""; // Clear previous courses
          
          if (courses.length === 0) {
              console.log("No courses found.");
              noCoursesMessage.style.display = "block"; // Show no courses message
          } else {
              noCoursesMessage.style.display = "none";
              const displayedCourses = courses.slice(0, 6); // Limit to 6 courses

              displayedCourses.forEach((course) => {
                  const departmentNames = course.department.map(deptId => {
                      const department = departmentData.find(dept => dept.id === deptId);
                      return department ? department.name : 'Unknown';
                  });

                  const instructor = instructorData.find(inst => inst.id === course.instructor);
                  const instructorName = instructor ? `${instructor.user.first_name} ${instructor.user.last_name}` : 'Unknown';

                  const courseElement = document.createElement("div");
                  courseElement.classList.add("card-list");
                  
                  courseElement.innerHTML = `
                      <div class="card">
                          <img src="${course.image}" class="card-img-top" alt="...">
                          <div class="card-body">
                              <h4 class="card-title"><a href="./index_course_details.html?id=${course.id}" class="enroll_btn">${course.title.slice(0, 20)}..</a></h4>
                              <p class="card-text" style="font-size: 18px;">${course.content.slice(0,35)}...</p>
                              <div style="display: flex; justify-content: space-between; align-items: baseline; margin-top: 25px;">
                                  <p class="lesson"><i class="fa-regular fa-clock clock"></i><span class="card_icon">${course.lesson} Lessons</span></p>
                                  <p class="lesson"><i class="fa-regular fa-user clock"></i><span class="card_icon">${instructorName}</span></p>
                              </div>
                              <hr style="color: #685F78;">
                              <div style="display: flex; justify-content: space-between;">
                                  <p class="card_fee"><span style="color: #f66962;">$${course.fee}</span> USD</p>
                                  <div class="en"><i class="fa-solid fa-cart-shopping"></i>
                                  <a href="./index_course_details.html?id=${course.id}" class="enroll_btn"><span>Enroll</span></a></div>
                              </div>
                          </div>
                      </div>
                  `;
                  coursesContainer.appendChild(courseElement);
              });
          }
      })
      .catch((error) => console.error('Error fetching courses:', error));
};


const handleDepartmentClick = (departmentName) => {
  getAllCourses(departmentName);
};




function animateCount(id, target) {
    let count = 0;
    const duration = 2000; 
    const increment = Math.ceil(target / (duration / 100)); 
    const counter = setInterval(() => {
        count += increment; 
        if (count >= target) { 
            count = target; 
            clearInterval(counter); 
        }
        document.getElementById(id).innerText = count;
    }, 100); 
}

// Start the animations
animateCount('students', 100);
animateCount('course', 100);
animateCount('tutors', 50);

