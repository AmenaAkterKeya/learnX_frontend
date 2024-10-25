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