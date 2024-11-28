function checkLoginStatus() {
  // accessToken이 있으면 /me API를 요청
  fetch('/me/profile', {
    method: 'GET',
  })
    .then((response) => {
      if (response.ok) {
        // 요청 성공 시 로그인 상태로 간주하고 버튼을 변경
        document.querySelector('.login-btn').classList.add('hidden');
        document.querySelector('.create-event-btn').classList.remove('hidden');
        document.querySelector('.logout-btn').classList.remove('hidden');
        document.querySelector('.my-page-btn').classList.remove('hidden');
      } else {
        document.querySelector('.login-btn').classList.remove('hidden');
        document.querySelector('.create-event-btn').classList.add('hidden');
        document.querySelector('.logout-btn').classList.add('hidden');
        document.querySelector('.my-page-btn').classList.add('hidden');
      }
    })
    .catch((error) => {
      console.error('Error:', error);
    });
}

window.addEventListener('DOMContentLoaded', checkLoginStatus);
