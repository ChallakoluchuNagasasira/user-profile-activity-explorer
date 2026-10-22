export function showError(message) {
  const messageEl = document.querySelector("#message");
  messageEl.textContent = message;
}

export function clearMessage() {
  document.querySelector("#message").textContent = "";
}

export function setLoading(isLoading) {
  document.querySelector("#loading").classList.toggle("hidden", !isLoading);
  document.querySelectorAll("#userForm button").forEach(button => {
    button.disabled = isLoading;
  });
}

export function renderUserProfile(user, isBookmarked) {
  const area = document.querySelector("#profileArea");
  area.innerHTML = `
    <article class="card">
      <h2>${escapeHtml(user.name)}</h2>
      <div class="profile-grid">
        <div class="detail"><strong>Username</strong>${escapeHtml(user.username)}</div>
        <div class="detail"><strong>Email</strong>${escapeHtml(user.email)}</div>
        <div class="detail"><strong>Phone</strong>${escapeHtml(user.phone)}</div>
        <div class="detail"><strong>Company</strong>${escapeHtml(user.company.name)}</div>
        <div class="detail"><strong>City</strong>${escapeHtml(user.address.city)}</div>
        <div class="detail"><strong>Website</strong>${escapeHtml(user.website)}</div>
      </div>
      <div class="card-actions">
        <button id="bookmarkBtn">${isBookmarked ? "Remove Bookmark" : "Bookmark User"}</button>
      </div>
    </article>`;
}

export function renderPosts(posts) {
  const area = document.querySelector("#postsArea");
  const firstThree = posts.slice(0, 3);
  area.innerHTML = `<h2>User Posts</h2><div class="posts-list">${
    firstThree.map(post => `
      <article class="post-card" data-post-id="${post.id}">
        <h3>${escapeHtml(post.title)}</h3>
        <p>${escapeHtml(post.body)}</p>
        <button class="comments-btn" data-post-id="${post.id}">View Comments</button>
        <div class="comments hidden" id="comments-${post.id}"></div>
      </article>`).join("")
  }</div>`;
}

export function renderComments(postId, comments) {
  const area = document.querySelector(`#comments-${postId}`);
  area.innerHTML = comments.length
    ? comments.map(comment => `<p><strong>${escapeHtml(comment.name)}</strong><br>${escapeHtml(comment.body)}<br><small>${escapeHtml(comment.email)}</small></p>`).join("")
    : "<p>No comments found.</p>";
  area.classList.remove("hidden");
}

export function renderSavedUsers(users) {
  const list = document.querySelector("#savedUsers");
  if (!users.length) {
    list.innerHTML = '<li class="muted">No saved users yet.</li>';
    return;
  }
  list.innerHTML = users.map(user => `
    <li><button class="saved-user" data-user-id="${user.id}">
      ${escapeHtml(user.name)}<br><small>${escapeHtml(user.email)}</small>
    </button></li>`).join("");
}

function escapeHtml(value) {
  return String(value ?? "").replace(/[&<>"']/g, char => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
  }[char]));
}
