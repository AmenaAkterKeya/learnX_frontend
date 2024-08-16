const handleRegistration = (event) => {
  event.preventDefault();

  const username = getValue("username");
  const first_name = getValue("first_name");
  const last_name = getValue("last_name");
  const email = getValue("email");
  const password = getValue("password");
  const confirm_password = getValue("confirm_password");
  const role = getValue("role");
  const info = {
      username,
      first_name,
      last_name,
      email,
      password,
      confirm_password,
      role,
  };
  if (password === confirm_password) {
      document.getElementById("error").innerText = "";
      if (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password)) {
          // Password meets criteria
          fetch("https://learnx-ldys.onrender.com/account/register/", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify(info),
          })
          .then((res) => res.json())
          .then((data) =>{console.log(data)
            window.location.href = "login.html";
          } );
      } else {
         
          document.getElementById("error").innerText =
              "Password must contain eight characters, at least one letter, one number and one special character.";
      }
  } else {
    
      document.getElementById("error").innerText =
          "Password and confirm password do not match";
  }
};


const getValue = (id) => {
    const value = document.getElementById(id).value;
    return value;
};
const handleLogin = (event) => {
  event.preventDefault();
  const username = getValue("login-username");
  const password = getValue("login-password");
  console.log(username, password);

  // Hide the error message initially
  const errorElement = document.getElementById("error");
  errorElement.style.display = "none";

  if (username && password) {
      fetch("https://learnx-ldys.onrender.com/account/login/", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ username, password }),
      })
          .then((res) => res.json())
          .then((data) => {
              console.log(data);

              if (data.token && data.user_id) {
                  localStorage.setItem("token", data.token);
                  localStorage.setItem("user_id", data.user_id);
                  if (data.role.toLowerCase() === "student") {
                    window.location.href = "student_profile.html";
                } else {
                    window.location.href = "profile.html";
                }
              } else {
                  // Show error message if login fails
                  errorElement.innerText = "Email not confirmed. Please confirm your email.";
                  errorElement.style.display = "block";
              }
        });
          
    }
  };

 


  const handlelogOut = () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      console.log("No token found in localStorage.");
      return;
    }
  
    fetch("https://learnx-ldys.onrender.com/account/logout/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${token}`,
      },
    })
      .then((res) => {
        console.log(res);
        if (res.ok) {
          localStorage.removeItem("token");
          window.location.href = "./index.html";
        }
      })
      .catch((err) => console.log("Logout Error", err));
  };
  