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
const handleDepartmentClick = (departmentName) => {
    getAllCourses(departmentName);
  };

const getAllCourses = (departmentName = '') => {
    const url = departmentName 
                ? `https://learnx-ldys.onrender.com/course/courses/?search=${departmentName}` 
                : "https://learnx-ldys.onrender.com/course/courses/";
  
    fetch(url)
        .then((res) => res.json())
        .then((courses) => {
            const coursesContainer = document.getElementById("courses-row");
            const noCoursesMessage = document.getElementById("no-courses-message");
  
            // Clear previous courses
            coursesContainer.innerHTML = ""; 

            if (courses.length === 0) {
                console.log("No courses found."); 
                noCoursesMessage.style.display = "block"; 
            } else {
                console.log("Courses found.");
                noCoursesMessage.style.display = "none"; 
                courses.forEach((course) => {
                    const departmentNames = course.department.map(deptId => {
                        const department = departmentData.find(dept => dept.id === deptId);
                        return department ? department.name : 'Unknown';
                    });
  
                    const instructor = instructorData.find(inst => inst.id === course.instructor);
                    const instructorName = instructor ? `${instructor.user.first_name} ${instructor.user.last_name}` : 'Unknown';
  
                    const courseElement = document.createElement("div");
                    courseElement.classList.add("card-list");
                courseElement.innerHTML = `
                     <div class="card" >
  <img src="${course.image}" class="card-img-top" alt="...">
  <div class="card-body">
    <h4 class="card-title"><a href="./index_course_details.html?id=${course.id}" class="enroll_btn" >${course.title.slice(0, 30)}</a></h4>
    
    <p class="card-text " style="
    font-size: 18px;
">${course.content.slice(0, 80)}...</p>
    
                                <div style="
    display: flex;
    justify-content: space-between;
        align-items: baseline;
    margin-top: 25px;
">
                                     <p class="lesson"><i class="fa-regular fa-clock clock" ></i><span class="card_icon">${course.lesson} Lessons</span> </p>
                                     <p class="lesson"><i class="fa-regular fa-user clock"></i><span class="card_icon">${instructorName}</span> </p>
                                   
                                </div>
                                <hr style="color:  #685F78;">
                                 <div class="" style="    justify-content: space-between;
    display: flex;
">
        <p class="card_fee"><span style="color: #f66962; ">$${course.fee}</span> USD</p>
<div class="en"><i class="fa-solid fa-cart-shopping"></i>
<a href="./student_course_details.html?id=${course.id}" class="enroll_btn" ><span style=" ">Enroll</span></a></div>
        
        </div>

</div>
 
</div>
                    `;
                    coursesContainer.appendChild(courseElement);
                });
            }
        })
        .catch((error) => {
            console.error('Error fetching courses:', error);
            const noCoursesMessage = document.getElementById("no-courses-message");
            noCoursesMessage.style.display = "block"; 
        });
};
