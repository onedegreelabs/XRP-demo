// Fetch events from the API
fetch('/events?take=10')
  .then((response) => response.json())
  .then((data) => {
    // Ensure data is an array of events, then proceed with sorting and grouping
    const events = data.data.items; // Assuming the data is directly an array of events

    // Sort events by startAt
    events.sort((a, b) => new Date(a.startAt) - new Date(b.startAt));

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

    // 날짜별로 이벤트를 그룹화
    const groupedEvents = events.reduce((acc, event) => {
      const eventDate = new Date(event.startAt).toLocaleDateString();
      if (!acc[eventDate]) {
        acc[eventDate] = [];
      }
      acc[eventDate].push(event);
      return acc;
    }, {});

    // 각 날짜별로 그룹화된 이벤트들을 표시
    Object.keys(groupedEvents).forEach((eventDate) => {
      // 날짜 제목을 추가
      const dateGroup = document.createElement('div');
      dateGroup.className = 'date-group';

      const dateTitle = document.createElement('h2');
      dateTitle.className = 'date-title';
      dateTitle.textContent = formatDate(eventDate);

      // 해당 날짜의 이벤트 카드들을 추가
      const eventCards = document.createElement('div');
      eventCards.className = 'event-cards';

      groupedEvents[eventDate].forEach((event) => {
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
              ${event.tickets[0].price} XRP
           </div>
          </div>
        `;

        // 카드 클릭 시 팝업 띄우기
        card.addEventListener('click', () => showPopup(event.id));

        eventCards.appendChild(card);
      });

      // 그룹에 날짜 제목과 이벤트 카드를 추가
      dateGroup.appendChild(dateTitle);
      dateGroup.appendChild(eventCards);

      eventList.appendChild(dateGroup);
    });

    // showPopup 함수: 팝업을 보이게 하고 내용을 동적으로 채움
    function showPopup(eventId) {
      const event = events.find((e) => e.id === eventId);

      // 팝업 내용 설정
      const popupContent = document.querySelector('#popup .popup-content');
      popupContent.innerHTML = `
        <h2 class="popup-title">${event.title}</h2>
        <p class="popup-description">Would you like to register for this event?</p>
        <div class="popup-button-group">
          <button class="buy-btn" id="buy-btn-${event.id}">Buy Ticket</button>
          <button class="close-btn" id="close-btn-${event.id}">Close</button>
        </div> 
      `;

      // 팝업에 대한 이벤트 리스너 추가
      const registerButton = document.getElementById(`buy-btn-${event.id}`);
      const closeButton = document.getElementById(`close-btn-${event.id}`);

      registerButton.addEventListener('click', () => registerEvent(event.id));
      closeButton.addEventListener('click', closePopup);

      // 팝업 보이기
      document.getElementById('popup').classList.remove('hidden');
    }

    // closePopup 함수: 팝업을 숨김
    function closePopup() {
      document.getElementById('popup').classList.add('hidden');
    }

    // registerEvent 함수: 등록 버튼 클릭 시 처리
    function registerEvent(eventId) {
      const event = events.find((e) => e.id === eventId);

      fetch(`events/${event.id}/tickets/${event.tickets[0].id}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      })
        .then((response) => response.json())
        .then((data) => {
          if (data.statusCode === 200) {
            alert(`You have registered for ${event.title}`);
          } else {
            if (data.errorCode === 'G20004') {
              throw new Error('Host cannot register for their own event');
            } else {
              throw new Error(`Failed to register for ${event.title}`);
            }
          }
        })
        .catch((error) => {
          alert(error);
        });
      closePopup(); // 등록 후 팝업 닫기
    }
  })
  .catch((error) => {
    console.error('Error fetching events:', error);
  });

function formatDate(input) {
  const months = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  const [year, month, day] = input.split('.');
  const formattedMonth = months[parseInt(month, 10) - 1]; // 0-based index
  const formattedDay = parseInt(day, 10); // 숫자로 변환해 앞의 0 제거

  return `${formattedMonth} ${formattedDay}`;
}
