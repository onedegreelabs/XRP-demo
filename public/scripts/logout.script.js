function logout() {
  // accessToken이 있으면 /me API를 요청
  fetch('/auth/token', {
    method: 'DELETE',
  }).then((response) => {
    window.location.href = '/discover';
  });
}

document.querySelector('.logout-btn').addEventListener('click', logout);
