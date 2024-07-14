const getQueryParams = (param) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

let departmentData = [];
let instructorData = [];

const fetchDepartments = () => {
  return fetch('https://learnx-ldys.onrender.com/course/department/')
    .then(response => response.json())
    .then(data => {
      departmentData = data;
      return data.map(department => ({
        id: department.id,
        name: department.name
      }));
    })
    .catch(error => {
      console.error('Error fetching departments:', error);
      throw error;
    });
};

const fetchInstructors = () => {
  return fetch("https://learnx-ldys.onrender.com/account/InstructorList/")
    .then(response => response.json())
    .then(data => {
      instructorData = data;
     
    })
    .catch(error => {
      console.error('Error fetching instructors:', error);
      throw error;
    });
};

const getCourseDetail = async () => {
  try {
    const courseId = getQueryParams("id");
    const response = await fetch(`https://learnx-ldys.onrender.com/course/courses/${courseId}/`);
    if (!response.ok) {
      throw new Error('Failed to fetch course details');
    }
    const course = await response.json();

    const courseDetailContainer = document.getElementById("details_course");
    courseDetailContainer.innerHTML = '';

    const departmentNames = course.department.map(deptId => {
      const department = departmentData.find(dept => dept.id === deptId);
      return department ? department.name : 'Unknown';
    });

    const instructor = instructorData.find(inst => inst.id === course.instructor);
    const instructorName = instructor ? `${instructor.user.first_name} ${instructor.user.last_name}` : 'Unknown';

    const courseDetailHTML = `
      <div class="all">
        <div class="col-md-6">
          <img src="${course.image}" class="card-img-top" alt="${course.title}">
        </div>
        <div class="col-md-6" style="align-content: center;">
          <div class="all_details">
            <div class="card-body">
              <h5 class="card-title">${course.title}</h5>
              <h6 class="card-subtitle">${instructorName}</h6>
              <p class="card-text">${course.content}</p>
              <p class="card-text"><strong style="color: #685F78; letter-spacing: 1px;">Department:</strong> ${departmentNames.map(name => `<span class="card_de">${name}</span>`).join(' ')}</p>
              <div class="d-flex justify-content-between">
                <p>Lessons: ${course.lesson} <i class="fa-regular fa-clock"></i></p>
                <p>Fee: $${course.fee}</p> 
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    courseDetailContainer.innerHTML = courseDetailHTML;
  } catch (error) {
    console.error('Error fetching course details:', error);
  }
};



fetchDepartments();
fetchInstructors();
getCourseDetail();
 