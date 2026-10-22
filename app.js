import { fetchUser, fetchUserPosts, fetchComments } from "./api.js";
import {
  showError, clearMessage, setLoading, renderUserProfile,
  renderPosts, renderComments, renderSavedUsers
} from "./dom.js";

const form = document.querySelector("#userForm");
const userIdInput = document.querySelector("#userId");
const randomBtn = document.querySelector("#randomBtn");
let currentUser = null;
let currentPosts = [];

function getSavedUsers() {
  try {
    return JSON.parse(localStorage.getItem("savedUsers") || "[]");
  } catch {
    return [];
  }
}

function saveUsers(users) {
  localStorage.setItem("savedUsers", JSON.stringify(users));
  renderSavedUsers(users);
}

function isSaved(id) {
  return getSavedUsers().some(user => user.id === id);
}

async function loadUser(id) {
  clearMessage();
  const numericId = Number(id);

  // Validate before making any API request.
  if (!Number.isInteger(numericId) || numericId < 1 || numericId > 10) {
    showError("Please enter a valid User ID between 1 and 10");
    return;
  }

  setLoading(true);
  document.querySelector("#profileArea").innerHTML = "";
  document.querySelector("#postsArea").innerHTML = "";

  try {
    currentUser = await fetchUser(numericId);
    currentPosts = await fetchUserPosts(numericId);
    renderUserProfile(currentUser, isSaved(currentUser.id));
    renderPosts(currentPosts);
    userIdInput.value = numericId;
  } catch (error) {
    showError(error.message || "Unable to load user details.");
  } finally {
    setLoading(false);
  }
}

form.addEventListener("submit", event => {
  event.preventDefault();
  loadUser(userIdInput.value);
});

randomBtn.addEventListener("click", () => {
  const randomId = Math.floor(Math.random() * 10) + 1;
  loadUser(randomId);
});

document.addEventListener("click", async event => {
  const target = event.target;

  if (target.id === "bookmarkBtn" && currentUser) {
    const saved = getSavedUsers();
    if (isSaved(currentUser.id)) {
      saveUsers(saved.filter(user => user.id !== currentUser.id));
    } else {
      const basicInfo = {
        id: currentUser.id,
        name: currentUser.name,
        email: currentUser.email
      };
      saveUsers([...saved, basicInfo]);
    }
    renderUserProfile(currentUser, isSaved(currentUser.id));
  }

  if (target.classList.contains("saved-user")) {
    loadUser(target.dataset.userId);
  }

  if (target.classList.contains("comments-btn")) {
    const postId = target.dataset.postId;
    const commentsArea = document.querySelector(`#comments-${postId}`);
    if (!commentsArea.classList.contains("hidden")) {
      commentsArea.classList.add("hidden");
      target.textContent = "View Comments";
      return;
    }

    target.disabled = true;
    target.textContent = "Loading...";
    try {
      const comments = await fetchComments(postId);
      renderComments(postId, comments);
      target.textContent = "Hide Comments";
    } catch {
      showError("Could not load comments. Please try again.");
      target.textContent = "View Comments";
    } finally {
      target.disabled = false;
    }
  }
});

renderSavedUsers(getSavedUsers());
