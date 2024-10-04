// department

document.addEventListener("DOMContentLoaded", function() {
    fetchDepartments();
});

function fetchDepartments() {
    fetch('https://learn-x-seven.vercel.app/course/department/')
        .then(response => response.json())
        .then(data => {
            const departmentSelect = document.getElementById('department');
            data.forEach(department => {
                const option = document.createElement('option');
                option.value = department.id;
                option.text = department.name;
                departmentSelect.appendChild(option);
            });
        })
        .catch(error => console.error('Error fetching departments:', error));
}

// add course
const handleCourse = (event) => {
    event.preventDefault();
    const preloader = document.getElementById("preloader");
    preloader.style.display = "flex";
    const form = document.getElementById("add_form");
    const formData = new FormData(form);
    const token = localStorage.getItem("token");
    console.log("Token:", token);

    const imageFile = formData.get("image");

    // Upload image to imgbb
    const imgbbApiKey = "830c9f2bc90e1ac3e4c2d15fb60628d2";
    const imgbbFormData = new FormData();
    imgbbFormData.append("image", imageFile);

    fetch(`https://api.imgbb.com/1/upload?key=${imgbbApiKey}`, {
        method: "POST",
        body: imgbbFormData,
    })
    .then((response) => {
        if (!response.ok) {
            throw new Error('Image upload failed');
        }
        return response.json();
    })
    .then((imgbbData) => {
        const imageUrl = imgbbData.data.url;
        console.log("Image URL:", imageUrl);
        
        // Convert department field to an array
        const departments = formData.getAll("department").map(Number);
        formData.set('department', departments);

        const courseData = {
            title: formData.get("title"),
            content: formData.get("content"),
            department: departments,
            lesson: formData.get("lesson"),
            fee: formData.get("fee"),
            image: imageUrl,
        };

        console.log(JSON.stringify(courseData));

        return fetch("https://learn-x-seven.vercel.app/course/courses/", {
            method: "POST",
            headers: {
                "Authorization": `Token ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify(courseData),
        });
    })
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
    })
    .then(data => {
        console.log('Course created successfully:', data);
        window.location.href = "profile.html"
    })
    .catch((error) => {
        console.error('Error:', error);
    })
    .finally(() => {
        preloader.style.display = "none";
    });
};
