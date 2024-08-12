const loadInstructorId = () => {
    const user_id = localStorage.getItem("user_id");
    console.log("User ID:", user_id); 

    fetch(`https://learnx-ldys.onrender.com/account/InstructorList/?user_id=${user_id}`)
      .then((res) => res.json())
      .then((data) => {
        console.log("API Response:", data);
        if (data.length > 0) {
          const instructor = data[0];
          

          document.getElementById("instructor-username").textContent = instructor.user.username;
          document.getElementById("instructor-user").textContent = instructor.user.username;
          document.getElementById("instructor-firstname").textContent = `${instructor.user.first_name}`;
          document.getElementById("instructor-lastname").textContent = `${instructor.user.last_name}`;
          document.getElementById("instructor-email").textContent = instructor.user.email;
          document.getElementById("instructor-mobile").textContent = instructor.mobile_no || "N/A";
          console.log("Instructor Username:", instructor.user.username); 
        } else {
          console.log("No instructor found for this user.");
        }
      })
      .catch((error) => {
        console.error("Error fetching instructor details:", error);
      });
};

loadInstructorId(); // Ensure the function is called
