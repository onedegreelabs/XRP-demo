document
  .getElementById('eventForm')
  .addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = new FormData(this);
    const eventData = {};
    formData.forEach((value, key) => {
      eventData[key] = value;
    });

    // 이미지 업로드 요청
    const imageFile = formData.get('coverImage');
    let imageKey = null;

    if (imageFile) {
      try {
        const imageFormData = new FormData();
        imageFormData.append('image', imageFile);

        const imageResponse = await fetch('/events/cover-image', {
          method: 'POST',
          body: imageFormData,
        });

        if (!imageResponse.ok) {
          throw new Error('Failed to upload image');
        }

        const imageResult = await imageResponse.json();
        imageKey = imageResult.data.key;
      } catch (error) {
        alert('Image upload failed. Please try again.');
        return;
      }
    }

    // 이벤트 생성 요청
    try {
      const response = await fetch('/events', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: eventData.title,
          field: eventData.field,
          description: eventData.description,
          coverImage: imageKey, // 업로드된 이미지의 키
          startAt: eventData.startAt,
          location: {
            type: 'GOOGLE',
            shortAddress: eventData.location,
          },
          price: eventData.price,
          registrationCapacity: eventData.capacity,
        }),
      });

      if (response.ok) {
        window.location.href = '/';
      } else {
        throw new Error('Failed to create event');
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  });
