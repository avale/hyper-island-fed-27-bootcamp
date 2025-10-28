const BASE_URL = "https://image-feed-api.vercel.app/api"
const $photos = document.querySelector('#photos');

const getPhotos = async () => {
  const res = await fetch(`${BASE_URL}/images`);
  const {data} = await res.json();
  return data;
};

const likePhoto = async (id) => {
  const res = await fetch(`${BASE_URL}/images/${id}/like`, { method: "POST" });
  return await res.json()
}

const resetList = () => {
  $photos.innerHTML = '';
};

const handleDoubleClick = async (e, $parent, data) => {
    const $wrapper = $parent.querySelector('.js-image-wrapper')
    showLikeOverlay($wrapper)
    const response = await likePhoto(data?.id)
    if (response?.success) {
      const $likes = $parent.querySelector('.js-likes')
      $likes.innerHTML = `Likes: ${response.likes_count}`
    }
}

const showLikeOverlay = ($root) => {
  const $overlay = document.createElement('div')
  $overlay.classList.add('overlay')
  $overlay.style = 'opacity: 0'
  $root.append($overlay)
  setTimeout(() => {
    $overlay.style = 'opacity: 1'
  }, 10)
  setTimeout(() => {
    $overlay.style = 'opacity: 0'
  }, 800)
  setTimeout(() => {
    $overlay.remove()
  }, 1000)
}

const createPhoto = (photoData) => {
  const $card = document.createElement('div');
  $card.classList.add('card')
  $card.setAttribute('data-id', photoData?.id)

  const $wrapper = document.createElement('div');
  $wrapper.classList.add('image-wrapper', 'js-image-wrapper');
  $card.append($wrapper)

  const $img = document.createElement('img');
  $img.setAttribute('src', photoData.image_url);
  $img.classList.add('image');
  $img.addEventListener('dblclick', (e) => handleDoubleClick(e, $card, photoData))
  $wrapper.append($img);

  const $likes = document.createElement('div');
  $likes.classList.add('likes', 'js-likes');
  $likes.innerHTML = `Likes: ${photoData.likes_count}`;
  $card.append($likes);

  return $card;
};

const render = async () => {
  resetList();
  const photos = await getPhotos();

  photos.forEach((i) => {
    const $photo = createPhoto(i);
    $photos.append($photo);
  });
};

render();
