// Sample subjects data (in real app, this would come from a database)
const subjects = [
  {
    id: 1,
    name: "Intermediate Accounting 2",
    icon: "📊",
    description: "",
    url: "subjects/accounting.html",
  },
  {
    id: 2,
    name: "Accounting Information Systems",
    icon: "💻",
    description: "",
    url: "subjects/Ais.html",
  },
  {
    id: 3,
    name: "Micro Economics",
    icon: "📈",
    description: "",
    url: "subjects/economics.html",
  },
  {
    id: 4,
    name: "Public Finance",
    icon: "🏛️",
    description: "",
    url: "subjects/public-Finance.html",
  },
  {
    id: 5,
    name: "English",
    icon: "🌐",
    description: "",
    url: "subjects/english.html",
  },
  {
    id: 6,
    name: "Statistics",
    icon: "📊",
    description: "",
    url: "subjects/statistics.html",
  },
  {
    id: 7,
    name: "Marketing",
    icon: "🏭",
    description: "",
    url: "subjects/marketing.html",
  },

  {
    id: 8,
    name: "Political Science",
    icon: "",
    description: "",
    url: "subjects/Political.html.html",
  },
];

// Load favorites from localStorage with user-specific storage
function loadFavorites() {
  // Create a unique key for each user based on browser/session
  const userId = getUserId();
  const favorites = JSON.parse(
    localStorage.getItem(`favorites_${userId}`) || "[]",
  );
  return favorites;
}

// Save favorites to localStorage with user-specific storage
function saveFavorites(favorites) {
  const userId = getUserId();
  localStorage.setItem(`favorites_${userId}`, JSON.stringify(favorites));
}

// Get or create a unique user ID
function getUserId() {
  let userId = localStorage.getItem("subjects_online_user_id");
  if (!userId) {
    // Check if user is already registered
    const hasVisitedBefore = localStorage.getItem("subjects_online_visited");
    if (!hasVisitedBefore) {
      // First time visitor - ask for name
      const username = prompt("Please enter your name to continue:");
      if (username && username.trim()) {
        // Create user ID with username
        const cleanUsername = username
          .trim()
          .replace(/[^a-zA-Z0-9]/g, "")
          .toLowerCase();
        const timestamp = Date.now();
        const random = Math.random().toString(36).substr(2, 5);
        userId = `${cleanUsername}_${timestamp}_${random}`;
        localStorage.setItem("subjects_online_user_id", userId);
        localStorage.setItem(`user_name_${userId}`, username.trim());

        // Show welcome notification for new user
        setTimeout(() => {
          showNotification(
            `Welcome ${username.trim()}! 👋 Your favorites will be saved automatically.`,
          );
        }, 1000);
      } else {
        // If user cancels, use default ID
        userId =
          "user_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
        localStorage.setItem("subjects_online_user_id", userId);
        localStorage.setItem(`user_name_${userId}`, "Anonymous");

        setTimeout(() => {
          showNotification(
            "Welcome to Subjects Online! 👋 Your favorites will be saved automatically.",
          );
        }, 1000);
      }
      // Mark as visited
      localStorage.setItem("subjects_online_visited", "true");
    } else {
      // Returning visitor but no ID (cleared data)
      userId =
        "user_" + Date.now() + "_" + Math.random().toString(36).substr(2, 9);
      localStorage.setItem("subjects_online_user_id", userId);
      localStorage.setItem(`user_name_${userId}`, "Returning User");

      setTimeout(() => {
        showNotification(
          "Welcome back! 👋 Your favorites will be saved automatically.",
        );
      }, 1000);
    }
  }
  return userId;
}

// Get user display name
function getUserName() {
  const userId = getUserId();
  return localStorage.getItem(`user_name_${userId}`) || "Anonymous";
}

// Get user statistics
function getUserStats() {
  const userId = getUserId();
  const favorites = loadFavorites();
  const firstVisit =
    localStorage.getItem(`first_visit_${userId}`) || new Date().toISOString();
  const visitCount =
    parseInt(localStorage.getItem(`visit_count_${userId}`) || "0") + 1;

  // Update visit count
  localStorage.setItem(`visit_count_${userId}`, visitCount.toString());
  if (!localStorage.getItem(`first_visit_${userId}`)) {
    localStorage.setItem(`first_visit_${userId}`, firstVisit);
  }

  return {
    userId: userId,
    favoritesCount: favorites.length,
    visitCount: visitCount,
    firstVisit: firstVisit,
    lastVisit: new Date().toISOString(),
  };
}

// Clear user data (for testing or reset)
function clearUserData() {
  const userId = getUserId();
  localStorage.removeItem(`favorites_${userId}`);
  localStorage.removeItem(`first_visit_${userId}`);
  localStorage.removeItem(`visit_count_${userId}`);
  localStorage.removeItem("subjects_online_user_id");
  showNotification("All your data has been cleared! 🗑️");
  updateFavoritesDisplay();
}

// Export user data (for backup)
function exportUserData() {
  const userId = getUserId();
  const userData = {
    userId: userId,
    favorites: loadFavorites(),
    stats: getUserStats(),
    exportDate: new Date().toISOString(),
  };

  const dataStr = JSON.stringify(userData, null, 2);
  const dataBlob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(dataBlob);

  const link = document.createElement("a");
  link.href = url;
  link.download = `subjects_online_backup_${userId}.json`;
  link.click();

  URL.revokeObjectURL(url);
  showNotification("Your data has been exported! 💾");
}

// Import user data (for restore)
function importUserData(file) {
  const reader = new FileReader();
  reader.onload = function (e) {
    try {
      const userData = JSON.parse(e.target.result);

      if (userData.favorites && Array.isArray(userData.favorites)) {
        const userId = getUserId();
        localStorage.setItem(
          `favorites_${userId}`,
          JSON.stringify(userData.favorites),
        );
        updateFavoritesDisplay();
        showNotification("Data imported successfully! 📥");
      } else {
        showNotification("Invalid data format! ❌");
      }
    } catch (error) {
      showNotification("Failed to import data! ❌");
    }
  };
  reader.readAsText(file);
}

// Add subject to favorites
function addToFavorites(subjectId) {
  const favorites = loadFavorites();
  if (!favorites.includes(subjectId)) {
    favorites.push(subjectId);
    saveFavorites(favorites);
    showNotification("Added to favorites! ❤️");
    updateFavoritesDisplay();
  }
}

// Remove subject from favorites
function removeFromFavorites(subjectId) {
  const favorites = loadFavorites();
  const index = favorites.indexOf(subjectId);
  if (index > -1) {
    favorites.splice(index, 1);
    saveFavorites(favorites);
    showNotification("Removed from favorites 💔");
    updateFavoritesDisplay();
  }
}

// Check if subject is in favorites
function isFavorite(subjectId) {
  const favorites = loadFavorites();
  return favorites.includes(subjectId);
}

// Update favorites display
function updateFavoritesDisplay() {
  const favorites = loadFavorites();
  const favoritesGrid = document.getElementById("favoritesGrid");
  const emptyFavorites = document.getElementById("emptyFavorites");

  if (favorites.length === 0) {
    favoritesGrid.style.display = "none";
    emptyFavorites.style.display = "block";
    return;
  }

  favoritesGrid.style.display = "grid";
  emptyFavorites.style.display = "none";

  favoritesGrid.innerHTML = "";

  favorites.forEach((subjectId, index) => {
    const subject = subjects.find((s) => s.id === subjectId);
    if (subject) {
      const favoriteItem = document.createElement("div");
      favoriteItem.className = "favorite-item";
      favoriteItem.style.animationDelay = `${index * 0.1}s`;

      favoriteItem.innerHTML = `
                    <button class="remove-favorite" onclick="removeFromFavorites(${subject.id})">
                        <i class="fas fa-times"></i>
                    </button>
                    <div class="favorite-header">
                        <div class="favorite-icon">${subject.icon}</div>
                        <div class="favorite-info">
                            <h3>${subject.name}</h3>
                            <p>${subject.description}</p>
                        </div>
                    </div>
                    <a href="${subject.url}" class="browse-btn" style="width: 100%; justify-content: center; margin-top: 20px;">
                        <i class="fas fa-arrow-right"></i>
                        Continue Learning
                    </a>
                `;

      favoritesGrid.appendChild(favoriteItem);
    }
  });
}

// Show notification
function showNotification(message) {
  const notification = document.createElement("div");
  notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: linear-gradient(135deg, #6366f1, #8b5cf6);
            color: white;
            padding: 15px 25px;
            border-radius: 15px;
            box-shadow: 0 10px 25px rgba(99, 102, 241, 0.4);
            z-index: 10000;
            animation: slideInRight 0.5s ease-out;
            font-weight: 600;
        `;
  notification.textContent = message;
  document.body.appendChild(notification);

  setTimeout(() => {
    notification.style.animation = "slideOutRight 0.5s ease-out";
    setTimeout(() => notification.remove(), 500);
  }, 3000);
}

// Initialize
document.addEventListener("DOMContentLoaded", function () {
  updateFavoritesDisplay();
});

// Add CSS animations
const style = document.createElement("style");
style.textContent = `
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
    `;
document.head.appendChild(style);
