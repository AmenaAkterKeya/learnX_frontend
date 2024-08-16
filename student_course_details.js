const getQueryParam= (param) => {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get(param);
};

let departmentDataa = [];
let instructorDataa = [];

const fetchDepartments = () => {
  return fetch('https://learnx-ldys.onrender.com/course/department/')
    .then(response => response.json())
    .then(data => {
      departmentDataa = data;
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
      instructorDataa = data;
    })
    .catch(error => {
      console.error('Error fetching instructors:', error);
      throw error;
    });
};

const getCourseDetail = async () => {
  try {
    const courseId = getQueryParam("id");
    
    const response = await fetch(`https://learnx-ldys.onrender.com/course/courses/${courseId}/`);
    if (!response.ok) {
      throw new Error('Failed to fetch course details');
    }
    const course = await response.json();

    const courseDetailContainer = document.getElementById("details_course");
    courseDetailContainer.innerHTML = '';

    const departmentNames = course.department.map(deptId => {
      const department = departmentDataa.find(dept => dept.id === deptId);
      return department ? department.name : 'Unknown';
    });

    const instructor = instructorDataa.find(inst => inst.id === course.instructor);
    const instructorName = instructor ? `${instructor.user.first_name} ${instructor.user.last_name}` : 'Unknown';

    const courseDetailHTML = `
    
<div><div class="cour_head">
<div style="
  width: 100%;
  max-width: 770px;
"> <div style="
  display: flex;
  justify-content: space-between;
      align-items: baseline;
  max-width: 80%;
   margin-bottom: 10px;
">
<h1 class="detail_title" >${course.title}</h1>

            </div>
            <p class="lesson1"><i class="fa-solid fa-user pro"></i><span style="color:#f66962;    font-size: 18px;">${instructorName}</span> </p>
<hr style="
margin-top:10px;
color:#b5b5b5;
  max-width: 80%;
 
">
       <div class="cour_icon">
<p class="lesson"><i class="fa-solid fa-graduation-cap clock"></i><span style="color:#685F78;    font-size: 16px;">${course.lesson} Lessons</span> </p>
                                   <p class="lesson"><i class="fa-regular fa-user clock"></i><span style="color:#685F78;    font-size: 16px;">50 People</span> </p>
                                   <p class="lesson"><i class="fa-regular fa-clock clock"></i><span style="color:#685F78;    font-size: 16px;">2 Weeks</span> </p>
                                   <p class="lesson"><i class="fa-solid fa-puzzle-piece clock" style="color:#f8dc0b;"></i><span style="color:#685F78;    font-size: 16px;">20 Quizzes</span> </p>
                                 
                              </div>
      <img src="${course.image}" class="detail_image" alt="${course.title}">
       <h4 style="
  font-weight: 600;
  letter-spacing: 0.5px;
  margin-top: 28px;
  color: #f66962;
">Course Description</h4>
      <p class="card-text text_card">${course.content}</p></div>
<div class="pay_cour"> 
<div class="pay">
<img src="/img/course.jpg" class="detail_image" alt="${course.title}" style="
  max-width: 100%;
  border-radius: 5px;
">
<div style="
  display: flex;
  justify-content: space-between;
  align-items: end;
">
<div><p style="
  font-size: 26px;
  font-weight: 600;
  letter-spacing: 0.75px;
  color: #f66962;
  margin-top: 12px;
"><span>$${course.fee}</span> USD</p></div>
<div><p class="lesson" style="
  grid-column-gap: 8px;
  color: #ff7070;
  white-space: nowrap;
  background-color: #ffe8e8;
  border-radius: 3px;
  padding: 7.5px 11px;
  font-size: 13px;
  font-weight: 300;
  display: flex;
"><i class="fa-regular fa-clock "></i><span>7 Days Left!</span> </p></div>
</div>
<div>
<div>
    <form id="enroll-btn" onsubmit="handleEnrollClick(event)">
      <div class="alert alert-info" role="alert" id="error" style="
          display: none;
      ">
          </div>
                <input type="submit" class="enroll-btn" value="ENROLL NOW" />
              </form>
          </div>
       <div style="
  display: flex;
  justify-content: center;
  margin-top: 10px;
">   <p class="lesson"><i class="fa-solid fa-rotate-right"></i><span style="color:#685F78; font-size:13px;">30-Day Money-Back Guarantee</span> </p></div>
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

const getCourseComments = async (courseId) => {
  try {
    const response = await fetch(`https://learnx-ldys.onrender.com/course/courses/${courseId}/comments/`);
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
  padding: 16px;
  border-radius: 10px;
  margin-bottom: 10px;
  border: 1px solid #dddada;
  box-shadow: 2px 2px 4px rgb(207, 207, 207);
}
">
          <h6 style="
    margin-bottom: 15px;
    color: #ff7070;
">${comment.name}  <small style=" color: #685F78; margin-left: 8px;"> ${new Date(comment.created_on).toLocaleDateString()}</small></h6>
          <p style="
    font-size: 14px;
    color: #685F78;
">${comment.body}</p>
         
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

  const courseId = getQueryParam("id");
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
    const response = await fetch('https://learnx-ldys.onrender.com/course/comment/', {
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
    getCourseComments(courseId);
  } catch (error) {
    console.error('Error submitting comment:', error);
    document.getElementById('error').textContent = 'Failed to submit comment. Please try again.';
  }
});


const handleEnrollClick = (event) => {
  event.preventDefault(); 
  const courseId = getQueryParam("id"); 
  const token = localStorage.getItem('token');

  const enrollInCourse = async (courseId) => {
    try {
      const response = await fetch(`https://learnx-ldys.onrender.com/course/enrolls/${courseId}/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `token ${token}`
        },
        body: JSON.stringify({ course: courseId }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to enroll in course');
      }

      const enrollButton = document.querySelector('#enroll-btn input[type="submit"]');
      enrollButton.value = 'Enrolled';

      // Optionally, update balance information on the page if needed
      const currentBalance = await response.json();
      console.log('Current Balance:', currentBalance.current_balance);

    } catch (error) {
      console.error('Error enrolling in course:', error);
      
      // Display error message on the UI
      const errorMessageContainer = document.querySelector('#error');
      errorMessageContainer.textContent = error.message;
      errorMessageContainer.style.display = 'block';
    }
  };

  enrollInCourse(courseId);
};
fetchDepartments();
fetchInstructors();
getCourseDetail().then(() => {
  const courseId = getQueryParam("id");
  getCourseComments(courseId);
});
