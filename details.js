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
        <h2 class="card-title" style="margin-bottom: 30px;">${course.title}</h2>
          <img src="${course.image}" class="card-img-top" alt="${course.title}">
        </div>
        <div class="col-md-6" style="align-content: center;">
          <div class="all_details">
            <div class="card-body">
              
              <h6 class="card-subtitle"><span style="color: #685F78;margin-right: 4px;">Instructor: </span> <span>${instructorName}</span></h6>
              <p class="card-text" style="font-size: 19px;">${course.content}</p>
              <p class="card-text"><strong style="color: #685F78;margin-right: 5px; letter-spacing: 1px;">Department:</strong> ${departmentNames.map(name => `<span class="card_de">${name}</span>`).join(' ')}</p>
              <div class="d-flex justify-content-between">
                <p>Lessons: <span style="color:#f66962">${course.lesson}</span> <i class="fa-regular fa-clock"></i></p>
                <p>Fee: <span style="color:#f66962">$${course.fee}</span></p>
              </div>
              <a href="./course_detail.html?id=${course.id}" class="btn" style="background-color: #f66962; color: white;">Enroll</a>
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

const getCourseComments = async (courseId) => {
  try {
    const response = await fetch(`http://127.0.0.1:8000/course/courses/${courseId}/comments/`);
    if (!response.ok) {
      throw new Error('Failed to fetch comments');
    }
    const comments = await response.json();

    const commentSection = document.querySelector('.comment_section');
    commentSection.innerHTML = '';

    comments.forEach(comment => {
      const commentHTML = `
        <div class="comment_text" style="
    background-color: white;
    padding: 25px;
    border-radius: 10px;
    margin-bottom: 15px;
    border: 1px solid #dddada;
box-shadow: 2px 2px 4px rgb(207, 207, 207);
">
          <h5 style="
    margin-bottom: 15px;
">${comment.name}  <small style=" color: #685F78; margin-left: 8px;"> ${new Date(comment.created_on).toLocaleDateString()}</small></h5>
          <p>${comment.body}</p>
         
        </div>
      `;
      commentSection.innerHTML += commentHTML;
    });
  } catch (error) {
    console.error('Error fetching comments:', error);
  }
};

document.getElementById('Form').addEventListener('submit', async function(e) {
  e.preventDefault();

  const courseId = getQueryParams("id");
  const name = document.getElementById('first_name').value;
  const email = document.getElementById('email').value;
  const body = document.getElementById('content').value;

  const commentData = {
    course: courseId,
    name: name,
    email: email,
    body: body,
  };

  try {
    const response = await fetch('http://127.0.0.1:8000/course/comment/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(commentData),
    });

    if (!response.ok) {
      throw new Error('Failed to submit comment');
    }

    document.getElementById('Form').reset();
  

    // Fetch and display the comments again after submitting
    getCourseComments(courseId);
  } catch (error) {
    console.error('Error submitting comment:', error);
    document.getElementById('error').textContent = 'Failed to submit comment. Please try again.';
  }
});

fetchDepartments();
fetchInstructors();
getCourseDetail().then(() => {
  const courseId = getQueryParams("id");
  getCourseComments(courseId);
});
