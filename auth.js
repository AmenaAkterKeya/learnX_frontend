
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
  const preloader = document.getElementById("preloader");

  if (password === confirm_password) {
    preloader.style.display = "flex";
      document.getElementById("error").innerText = "";
      if (/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/.test(password)) {
          // Password meets criteria
          fetch("https://learn-x-seven.vercel.app/account/register/", {
              method: "POST",
              headers: { "content-type": "application/json" },
              body: JSON.stringify(info),
          })
          .then((res) => res.json())
          .then((data) =>{
            preloader.style.display = "none";
            console.log(data)
            alert("Verify Your Email Account")
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
  const username = document.getElementById("login-username").value;
  const password = document.getElementById("login-password").value;

  const preloader = document.getElementById("preloader");
  const errorElement = document.getElementById("error");
  errorElement.style.display = "none";

  if (username && password) {
      preloader.style.display = "flex";

      fetch("https://learn-x-seven.vercel.app/account/login/", {
          method: "POST",
          headers: { "content-type": "application/json" },
          body: JSON.stringify({ username, password }),
      })
      .then((res) => res.json())
      .then((data) => {
          preloader.style.display = "none";

          if (data.error) {
              errorElement.innerText = data.error; // Show the error message
              errorElement.style.display = "block";
              return; // Exit if there’s an error
          }

          if (data.token && data.user_id) {
              localStorage.setItem("token", data.token);
              localStorage.setItem("user_id", data.user_id);
              window.location.href = data.role.toLowerCase() === "student" ? "student_profile.html" : "profile.html";
          }
      })
      .catch((error) => {
          preloader.style.display = "none";
          errorElement.innerText = "Something went wrong. Please try again.";
          errorElement.style.display = "block";
      });
  }
};

 


  const handlelogOut = () => {
    const token = localStorage.getItem("token");
  
    if (!token) {
      console.log("No token found in localStorage.");
      return;
    }
  
    fetch("https://learn-x-seven.vercel.app/account/logout/", {
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
 