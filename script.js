document.addEventListener("DOMContentLoaded", function () {
    let isLoggedIn = localStorage.getItem("isLoggedIn") === "true";

    const authButton = document.getElementById("authButton");
    authButton.textContent = isLoggedIn ? "Logout" : "Login";

    authButton.addEventListener("click", function () {
        if (isLoggedIn) {
            localStorage.setItem("isLoggedIn", "false");
            window.location.reload();
        } else {
            localStorage.setItem("isLoggedIn", "true");
            window.location.reload();
        }
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const hamburger = document.querySelector(".hamburger");
    const nav = document.querySelector("nav");

    hamburger.addEventListener("click", function () {
        nav.classList.toggle("nav-active");
    });
});
document.addEventListener("DOMContentLoaded", function () {
    const sosButton = document.getElementById("sosButton");
    const sosMessage = document.getElementById("sosMessage");
    const emergencyForm = document.getElementById("emergencyForm");
    const saveContacts = document.getElementById("saveContacts");
    const sosPopup = document.getElementById("sosPopup");
    const countdownSpan = document.getElementById("countdown");
    const cancelSOS = document.getElementById("cancelSOS");

    let emergencyContacts = [];
    let countdown;
    let countdownTime = 5;

    // Toggle SOS Mode
    sosButton.addEventListener("click", function () {
        if (!sosButton.classList.contains("sos-active")) {
            // If no contacts are saved, show input form
            if (emergencyContacts.length === 0) {
                emergencyForm.classList.remove("hidden");
                return;
            }

            // Show confirmation popup with countdown
            sosPopup.classList.remove("hidden");
            countdownSpan.textContent = countdownTime;
            countdown = setInterval(startCountdown, 1000);
        } else {
            // Deactivate SOS Mode
            sosButton.classList.remove("sos-active");
            sosMessage.classList.add("hidden");
            sosButton.textContent = "Activate SOS";
        }
    });

    // Save emergency contacts
    saveContacts.addEventListener("click", function () {
        let contact1 = document.getElementById("contact1").value;
        let contact2 = document.getElementById("contact2").value;

        if (contact1) {
            emergencyContacts = [contact1];
            if (contact2) emergencyContacts.push(contact2);

            alert("Emergency contacts saved!");
            emergencyForm.classList.add("hidden");
        } else {
            alert("Please enter at least one contact number.");
        }
    });

    // Start countdown for SOS alert
    function startCountdown() {
        countdownTime--;
        countdownSpan.textContent = countdownTime;

        if (countdownTime === 0) {
            clearInterval(countdown);
            sosPopup.classList.add("hidden");
            activateSOS();
            countdownTime = 5;
        }
    }

    // Cancel SOS alert
    cancelSOS.addEventListener("click", function () {
        clearInterval(countdown);
        sosPopup.classList.add("hidden");
        countdownTime = 5;
    });

    // Activate SOS Mode (Send Alerts)
    function activateSOS() {
        sosButton.classList.add("sos-active");
        sosMessage.classList.remove("hidden");
        sosButton.textContent = "Deactivate SOS";

        getUserLocation();
    }

    // Get user location and send alert
    function getUserLocation() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(sendSOSAlert, handleLocationError);
        } else {
            alert("Geolocation is not supported by this browser.");
        }
    }

    // Send location to police and emergency contacts
    function sendSOSAlert(position) {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
        const locationURL = `https://www.google.com/maps?q=${latitude},${longitude}`;

        alert(`🚨 SOS Alert Sent! Location: ${locationURL}`);

        // Send location to the nearest police station (You will integrate this with the backend)
        console.log("Sending SOS to police with location:", locationURL);

        // Send alert to emergency contacts
        emergencyContacts.forEach(contact => {
            console.log(`Sending SOS alert to ${contact} with location: ${locationURL}`);
        });

        // You can integrate an SMS API here for sending messages
    }

    // Handle location error
    function handleLocationError(error) {
        alert("Unable to fetch location. Please check location permissions.");
        console.error("Error getting location:", error);
    }
});
document.getElementById("searchHotels").addEventListener("click", function () {
    const location = document.getElementById("location").value;
    const checkin = document.getElementById("checkin").value;
    const checkout = document.getElementById("checkout").value;
    const budget = parseFloat(document.getElementById("budget").value);
    const rating = document.getElementById("rating").value;

    if (!location || !checkin || !checkout || isNaN(budget)) {
        alert("Please fill all fields correctly.");
        return;
    }

    // Fetch hotel data from backend
    fetch("/get_hotels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ location, checkin, checkout, budget, rating })
    })
    .then(response => response.json())
    .then(data => {
        const hotelList = document.getElementById("hotelList");
        hotelList.innerHTML = "";
        data.hotels.forEach(hotel => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${hotel.name}</strong> - £${hotel.price}/night - ${hotel.rating}⭐`;
            hotelList.appendChild(li);
        });
        document.getElementById("hotelResults").classList.remove("hidden");
    })
    .catch(error => console.error("Error:", error));
});
document.getElementById("searchGuides").addEventListener("click", function () {
    const city = document.getElementById("city").value;
    const expertise = document.getElementById("expertise").value;

    if (!city) {
        alert("Please enter a city.");
        return;
    }

    fetch("/get_guides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ city, expertise })
    })
    .then(response => response.json())
    .then(data => {
        const guideList = document.getElementById("guideList");
        guideList.innerHTML = "";
        data.guides.forEach(guide => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${guide.name}</strong> - £${guide.price}/hour - ${guide.expertise}`;
            guideList.appendChild(li);
        });
        document.getElementById("guideResults").classList.remove("hidden");
    })
    .catch(error => console.error("Error:", error));
});
document.getElementById("getTouristInfo").addEventListener("click", function () {
    const country = document.getElementById("country").value;

    fetch("/get_tourist_info", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ country })
    })
    .then(response => response.json())
    .then(data => {
        const touristList = document.getElementById("touristList");
        touristList.innerHTML = "";
        data.info.forEach(item => {
            const li = document.createElement("li");
            li.innerHTML = `<strong>${item.title}</strong>: ${item.details}`;
            touristList.appendChild(li);
        });
        document.getElementById("touristResults").classList.remove("hidden");
    })
    .catch(error => console.error("Error:", error));
});
// Switch between Find & List tabs
function switchTab(tab) {
    document.getElementById("findHost").classList.add("hidden");
    document.getElementById("listPlace").classList.add("hidden");

    document.querySelectorAll(".tab-button").forEach(btn => btn.classList.remove("active"));

    if (tab === 'find') {
        document.getElementById("findHost").classList.remove("hidden");
        document.querySelectorAll(".tab-button")[0].classList.add("active");
    } else {
        document.getElementById("listPlace").classList.remove("hidden");
        document.querySelectorAll(".tab-button")[1].classList.add("active");
    }
}

// Search Hosts (Mock Function)
function searchHosts() {
    let location = document.getElementById("locationSearch").value;
    let resultsDiv = document.getElementById("hostResults");
    resultsDiv.innerHTML = `<p>🔍 Searching for hosts in ${location}...</p>`;

    // Mock API Response (Replace this with backend integration)
    setTimeout(() => {
        resultsDiv.innerHTML = `
            <div>
                <p>🏠 <strong>John Doe</strong> - London, UK</p>
                <p>🛏️ Offers a private room, free meals, and local tour guidance.</p>
            </div>
            <div>
                <p>🏠 <strong>Maria Rossi</strong> - Rome, Italy</p>
                <p>🛏️ Offers a shared room, homemade Italian food, and sightseeing recommendations.</p>
            </div>
        `;
    }, 1000);
}

// List a Host's Place
function listYourPlace() {
    let name = document.getElementById("hostName").value;
    let location = document.getElementById("hostLocation").value;
    let details = document.getElementById("hostDetails").value;
    
    if (name && location && details) {
        document.getElementById("listSuccess").classList.remove("hidden");
        alert(`🎉 Thank you, ${name}! Your place in ${location} is now listed.`);
    } else {
        alert("⚠️ Please fill out all fields.");
    }
}
// Expense Tracker
let totalSpent = 0;
function addExpense() {
    let name = document.getElementById("expenseName").value;
    let amount = Number(document.getElementById("expenseAmount").value);
    if (name && amount) {
        totalSpent += amount;
        document.getElementById("expenseList").innerHTML += `<li>${name}: £${amount}</li>`;
        document.getElementById("totalSpent").textContent = totalSpent;
    }
}

// Budget Plan
function getBudgetPlan() {
    let type = document.getElementById("budgetType").value;
    let plans = {
        low: "Stay in hostels, use public transport, eat street food.",
        mid: "Stay in 3-star hotels, dine in mid-range restaurants.",
        luxury: "Stay in 5-star hotels, enjoy fine dining and guided tours."
    };
    document.getElementById("budgetPlan").textContent = plans[type];
}

// Currency Converter (Mock)
function convertCurrency() {
    let amount = document.getElementById("convertAmount").value;
    let currency = document.getElementById("currency").value;
    let rates = { USD: 1.3, EUR: 1.1, INR: 100 };
    let converted = (amount * rates[currency]).toFixed(2);
    document.getElementById("convertedAmount").textContent = `Converted: ${converted} ${currency}`;
}

// Cultural Insights
function showCustoms() {
    let country = document.getElementById("countrySelect").value;
    let customs = { UK: "Queue politely, say 'thank you'.", France: "Greet with kisses.", Japan: "Bow to show respect." };
    document.getElementById("customsInfo").textContent = customs[country];
}

function earnPoints(points) {
    let total = Number(document.getElementById("userPoints").textContent) + points;
    document.getElementById("userPoints").textContent = total;
}

function redeemReward() {
    document.getElementById("rewardMessage").textContent = "✅ Reward Redeemed!";
}
document.getElementById("getTouristInfo").addEventListener("click", function() {
    let country = document.getElementById("country").value;
    let info = {
        "France": ["Visit Eiffel Tower", "Enjoy Wine Tours", "Explore Louvre Museum"],
        "Italy": ["See the Colosseum", "Gondola ride in Venice", "Taste authentic Pizza"],
        "Germany": ["Explore Berlin Wall", "Visit Neuschwanstein Castle", "Experience Oktoberfest"],
        "Spain": ["Visit La Sagrada Familia", "Enjoy Flamenco Dancing", "Relax on Costa Brava Beaches"],
        "United Kingdom": ["Explore London", "Visit Stonehenge", "See Edinburgh Castle"]
    };
    
    let results = document.getElementById("touristResults");
    let list = document.getElementById("touristList");
    list.innerHTML = "";

    info[country].forEach(place => {
        let li = document.createElement("li");
        li.textContent = place;
        list.appendChild(li);
    });

    results.classList.remove("hidden");
});

// ✅ Customs & Etiquette
function showCustoms() {
    let country = document.getElementById("country").value;
    let customs = {
        "France": "French people appreciate politeness. Greet with a light handshake or air kisses.",
        "Italy": "Italians are expressive. Hand gestures are common. Avoid discussing politics.",
        "Germany": "Punctuality is key. A firm handshake is the standard greeting.",
        "Spain": "Spanish people are warm. Expect personal space to be less than in other countries.",
        "United Kingdom": "British people value politeness. Queuing in an orderly manner is important."
    };
    document.getElementById("customsInfo").textContent = customs[country];
}

// ✅ Festivals & Events
function showFestivals() {
    let country = document.getElementById("country").value;
    let festivals = {
        "France": ["Bastille Day (July 14)", "Nice Carnival (February)", "Tour de France"],
        "Italy": ["Venice Carnival (February)", "Palio di Siena Horse Race", "La Tomatina"],
        "Germany": ["Oktoberfest (September)", "Berlin Film Festival", "Christmas Markets"],
        "Spain": ["Running of the Bulls (July)", "La Feria de Abril", "Barcelona Music Festivals"],
        "United Kingdom": ["Glastonbury Festival", "Notting Hill Carnival", "Edinburgh Fringe Festival"]
    };

    let festivalList = document.getElementById("festivalList");
    festivalList.innerHTML = "";
    festivals[country].forEach(festival => {
        let li = document.createElement("li");
        li.textContent = festival;
        festivalList.appendChild(li);
    });
}

// ✅ Food & Drink
function showFood() {
    let country = document.getElementById("country").value;
    let foods = {
        "France": ["Baguette & Cheese", "Croissants", "Escargots (Snails)", "Coq au Vin"],
        "Italy": ["Pizza Margherita", "Pasta Carbonara", "Gelato", "Tiramisu"],
        "Germany": ["Bratwurst", "Pretzels", "Schnitzel", "Black Forest Cake"],
        "Spain": ["Paella", "Tapas", "Churros with Chocolate", "Gazpacho"],
        "United Kingdom": ["Fish and Chips", "Full English Breakfast", "Shepherd’s Pie", "Afternoon Tea"]
    };

    let foodList = document.getElementById("foodList");
    foodList.innerHTML = "";
    foods[country].forEach(food => {
        let li = document.createElement("li");
        li.textContent = food;
        foodList.appendChild(li);
    });
}

// ✅ Auto-update insights when the country is changed
document.getElementById("country").addEventListener("change", function() {
    showCustoms();
    showFestivals();
    showFood();
});
document.getElementById("postButton").addEventListener("click", function() {
    let postText = document.getElementById("postText").value.trim();
    
    if (postText === "") {
        alert("Post cannot be empty!");
        return;
    }

    let forumPosts = document.getElementById("forumPosts");

    // Create post element
    let postDiv = document.createElement("div");
    postDiv.classList.add("post");

    let postContent = document.createElement("p");
    postContent.textContent = postText;

    // Upvote & Downvote
    let actionsDiv = document.createElement("div");
    actionsDiv.classList.add("actions");

    let upvote = document.createElement("span");
    upvote.innerHTML = "👍";
    upvote.classList.add("upvote");
    upvote.dataset.votes = 0;

    let downvote = document.createElement("span");
    downvote.innerHTML = "👎";
    downvote.classList.add("downvote");

    let voteCount = document.createElement("span");
    voteCount.textContent = " (0)";

    upvote.addEventListener("click", function() {
        let votes = parseInt(upvote.dataset.votes) + 1;
        upvote.dataset.votes = votes;
        voteCount.textContent = ` (${votes})`;
    });

    downvote.addEventListener("click", function() {
        let votes = parseInt(upvote.dataset.votes) - 1;
        upvote.dataset.votes = votes;
        voteCount.textContent = ` (${votes})`;
    });

    actionsDiv.appendChild(upvote);
    actionsDiv.appendChild(downvote);
    actionsDiv.appendChild(voteCount);

    postDiv.appendChild(postContent);
    postDiv.appendChild(actionsDiv);

    forumPosts.insertBefore(postDiv, forumPosts.firstChild);

    document.getElementById("postText").value = "";
});
document.addEventListener("DOMContentLoaded", function() {
    const loginContainer = document.getElementById("loginContainer");
    const profileSection = document.getElementById("profileSection");
    const loginButton = document.getElementById("loginButton");
    const logoutButton = document.getElementById("logoutButton");
    const rewardPoints = document.getElementById("rewardPoints");

    // Simulated user credentials
    const userEmail = "johndoe@example.com";
    const userPassword = "123456";

    // Check if user is already logged in
    if (localStorage.getItem("loggedIn") === "true") {
        showProfile();
    }

    loginButton.addEventListener("click", function() {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        if (email === userEmail && password === userPassword) {
            localStorage.setItem("loggedIn", "true");
            showProfile();
        } else {
            alert("❌ Incorrect email or password. Try again!");
        }
    });

    logoutButton.addEventListener("click", function() {
        localStorage.removeItem("loggedIn");
        loginContainer.classList.remove("hidden");
        profileSection.classList.add("hidden");
    });

    function showProfile() {
        loginContainer.classList.add("hidden");
        profileSection.classList.remove("hidden");

        // Load reward points dynamically (can be connected to a database later)
        rewardPoints.innerText = "1200 points";
    }
});

