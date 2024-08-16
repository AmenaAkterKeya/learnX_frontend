document.addEventListener('DOMContentLoaded', (event) => {
    const loadStudentId = () => {
        const user_id = localStorage.getItem("user_id");
        console.log("User ID:", user_id);

        if (!user_id) {
            console.error("User ID not found in local storage.");
            return;
        }

        fetch(`https://learnx-ldys.onrender.com/account/StudentList/?user_id=${user_id}`)
          .then((res) => {
            if (!res.ok) {
              throw new Error(`Network response was not ok: ${res.statusText}`);
            }
            return res.json();
          })
          .then((data) => {
            console.log("API Response:", data);
            if (Array.isArray(data) && data.length > 0) {
              const student = data[0];
              
              const usernameElement = document.getElementById("student-username");
              const userElement = document.getElementById("student-user");
              const firstnameElement = document.getElementById("student-firstname");
              const lastnameElement = document.getElementById("student-lastname");
              const emailElement = document.getElementById("student-email");
              const mobileElement = document.getElementById("student-mobile");

              if (usernameElement) usernameElement.textContent = student.user.username;
              if (userElement) userElement.textContent = student.user.username;
              if (firstnameElement) firstnameElement.textContent = `${student.user.first_name}`;
              if (lastnameElement) lastnameElement.textContent = `${student.user.last_name}`;
              if (emailElement) emailElement.textContent = student.user.email;
              if (mobileElement) mobileElement.textContent = student.mobile_no || "N/A";
              
              console.log("Student Username:", student.user.username);
            } else {
              console.log("No student found for this user.");
            }
          })
          .catch((error) => {
            console.error("Error fetching student details:", error);
          });
    };

    loadStudentId();
});
