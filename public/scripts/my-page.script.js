fetch('/me/profile', {
  method: 'GET',
})
  .then((response) => response.json())
  .then((data) => {
    const user = data.data;

    const profileCard = document.querySelector('.profile-card');
    profileCard.innerHTML = `
        <img src="https://cdn.glimpse.rsvp/users/avatars/3e150170-5a0c-4f78-9776-074db7e11df0.png" alt="Profile Image" class="avatar"/>
        <div class="profile-details">
          <p class="username">${user.name}</p>
          <p class="handle">${user.handle}</p>
        </div>
      `;
    const wallet = document.querySelector('.wallet-top');
    const xrpdevnetURL = `https://devnet.xrpl.org/accounts/${user.wallet.address}/transactions`;
    wallet.innerHTML = `
        <div class="wallet-balance">
          <p style="font-size: 16px; color: #171717; margin: 8px 0;">Balance</p>
          <p style="font-size: 28px; font-weight: bold; color: #171717; margin: 6px 0;">${
            user.wallet.balance ?? 0
          } <span style="font-size: 16px">XRP</span></p>
        </div>
        <a href=${xrpdevnetURL} class="wallet-address" target="_blank">
          <i class="fa-solid fa-arrow-up-right-from-square" style="color: #171717"></i>
        </a>
      `;
  })
  .catch((error) => {
    console.error('Error fetching user data:', error);
    window.location.href = '/discover';
  });

fetch('/me/events')
  .then((response) => response.json())
  .then((data) => {
    const events = data.data; // Assuming the data is directly an array of events

    const eventList = document.getElementById('event-list');

    if (events.length <= 0) {
      eventList.innerHTML = `
        <div style="height: 240px; text-align: center; font-weight: bold; color: #b0b0b0; display: flex; flex-direction: column; justify-content: center">
          <i style="font-size: 50px;" class="fa-solid fa-xmark"></i>
          <p style="font-size: 24px; margin: 14px 0;">No events found.</p>
        </div>
      `;
      return;
    }

    events.forEach((event) => {
      const card = document.createElement('div');
      card.className = 'event-card';

      card.innerHTML = `
          <img src="${event.coverImage ?? ''}" alt="${
            event.title
          }" class="event-cover">
          <div class="event-info">
            <div class="event-tags">${event.field}</div>
            <div class="event-title">${event.title}</div>
            <div class="event-host" style="display: flex;">
              <div style="width: 14px; margin-right: 10px; display: flex; flex-direction: column; justify-content: center">
                <i class="fa-solid fa-user" style="color: #c4c4c4; margin: 0 auto;"></i>
              </div>
              by ${event.hosts[0].user?.name}
            </div>
            <div class="event-location" style="display: flex;">
              <div style="width: 14px; margin-right: 10px; display: flex; flex-direction: column; justify-content: center">
                <i class="fa-solid fa-location-dot" style="color: #c4c4c4; margin: 0 auto;"></i>          
              </div>
              ${event.location?.shortAddress}
            </div>
            <div class="event-ticket-price" style="display: flex;">
              <div style="width: 14px; margin-right: 10px; display: flex; flex-direction: column; justify-content: center">
                <i class="fa-solid fa-ticket" style="font-size: 14px; color: #c4c4c4; margin: 0 auto;"></i>
              </div>
              ${event.tickets[0]?.price} XRP
           </div>
          </div>
          <div class="see-ticket-btn">See Ticket</div>
        `;

      const seeTicketButton = card.querySelector('.see-ticket-btn');
      seeTicketButton.addEventListener('click', () => showPopup(event.id));

      eventList.appendChild(card);
    });

    // showPopup 함수: 팝업을 보이게 하고 내용을 동적으로 채움
    function showPopup(eventId) {
      const event = events.find((e) => e.id === eventId);
      const devnetURL = `https://devnet.xrpl.org/nft/${event.participants[0].user.eventTicketNfts[0].nftId}`;

      const popupContent = document.querySelector('#popup .popup-content');
      popupContent.innerHTML = `
          <div class="popup-header">
            <button id="close-btn-${event.id}" class="close-btn">✖</button>
          </div>
          <div class="popup-body">
            <div class="qr-code">
              <p>${event.participants[0].ticket.id}</p>
            </div>
            <div class="ticket-info">
              <h3>${event.title}</h3>
              <div class="ticket-details" style="font-size: 14px; width: 100%;">
                <div style="display: flex; justify-content: space-between; width: 100%; gap: 14px;">
                  <div style="margin: 8px 0; width: 50%;">
                    <div style="text-align: left;">Name</div>
                    <div style="overflow: hidden; text-overflow: ellipsis; text-align: left; margin-top: 6px; font-weight: bold; font-size: 16px;">${event.participants[0].user.name}</div>
                  </div> 
                  <div style="width: 50%; margin: 8px 0;">
                    <div style="text-align: left;">Email</div>
                    <div style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; text-align: left; margin-top: 6px; font-weight: bold; font-size: 16px;">${event.participants[0].email}</div>
                  </div>
                </div>
                <div style="width: 100%; margin-top: 16px;">
                  <div style="text-align: left; display: flex;">
                    <div>NFT</div>
                    <a target="_blank" href=${devnetURL} style="margin-left: 10px; color: #171717; text-decoration: none; text-align: left;">
                      <i class="fa-solid fa-arrow-up-right-from-square" style="color: #171717"></i>
                    </a>
                  </div>
                  <div style="width: 100%; text-align: left; margin: 8px 0;">
                    <a target="_blank" style="color: #171717; text-decoration: underline;" href=${event.participants[0].user.eventTicketNfts[0].uri} style="text-align: left">See Metadata</a>                
                  </div>
                </div>
              </div>
            </div>
          </div>
        `;

      // QR 코드 생성 및 삽입
      const qrCodeContainer = document.querySelector('.qr-code');
      const ticketId = event.participants[0].ticket.id;

      // QR 코드 라이브러리를 사용해 이미지 생성
      QRCode.toDataURL(ticketId, { errorCorrectionLevel: 'H' })
        .then((url) => {
          qrCodeContainer.innerHTML = `<img src="${url}" alt="QR Code">`;
        })
        .catch((err) => {
          console.error('QR 코드 생성 실패:', err);
          qrCodeContainer.innerHTML = `<p>QR Code 생성에 실패했습니다.</p>`;
        });

      const closeButton = document.getElementById(`close-btn-${event.id}`);
      closeButton.addEventListener('click', closePopup);
      document.getElementById('popup').classList.remove('hidden');
    }

    function closePopup() {
      document.getElementById('popup').classList.add('hidden');
    }
  })
  .catch((error) => {
    console.error('Error fetching events:', error);
    window.location.href = '/discover';
  });
// Fetch events from the API

function withdrawXRP() {
  const addressInput = document.querySelector('.address_input');
  const amountInput = document.querySelector('.amount_input');
  const destination = addressInput.value;
  const amount = amountInput.value;

  const spinner = document.querySelector('.spinner');
  const withdrawText = document.querySelector('.withdraw-text');

  if (!destination) {
    alert('Please enter the XRP Wallet Address you want to transfer XRP to.');
    return;
  }

  withdrawText.style.display = 'none';
  spinner.style.display = 'block';

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000);
  fetch('/me/wallets/withdraw', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ destination, amount }),
    signal: controller.signal,
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.errorCode === 'G00017') {
        alert('Insufficient balance to withdraw XRP.');
      } else if (data.errorCode === 'G00018') {
        alert('Invalid destination address.');
      }
      if (data.statusCode === 200) {
        alert('Transaction successful! Please check your XRP Wallet.');
      } else {
        throw new Error('Failed to withdraw XRP.');
      }
    })
    .catch((error) => {
      alert('Failed to withdraw XRP. Please try again later.');
    })
    .finally(() => {
      // 스피너 숨기기
      spinner.style.display = 'none';
      withdrawText.style.display = 'block';
      window.location.href = '/my';
      clearTimeout(timeoutId);
    });
}
const withdrawButton = document.querySelector('.withdraw-btn');
withdrawButton.addEventListener('click', withdrawXRP);

const tabButtons = document.querySelectorAll('.tab-btn');
const tabContents = document.querySelectorAll('.tab-content');

// Add click event to each button
tabButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const targetTab = button.dataset.tab;

    // Remove 'active' class from all buttons and contents
    tabButtons.forEach((btn) => btn.classList.remove('active'));
    tabContents.forEach((content) => content.classList.remove('active'));

    // Add 'active' class to clicked button and target content
    button.classList.add('active');
    document.getElementById(targetTab).classList.add('active');
  });
});
