const BASE_URL = "https://jsonplaceholder.typicode.com";

async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error("Request failed. Please try again.");
  return response.json();
}

export function fetchUser(id) {
  return getJson(`${BASE_URL}/users/${id}`);
}

export function fetchUserPosts(userId) {
  return getJson(`${BASE_URL}/posts?userId=${userId}`);
}

export function fetchComments(postId) {
  return getJson(`${BASE_URL}/posts/${postId}/comments`);
}
