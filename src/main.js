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

const createPhoto = (photoData) => {
  const $wrapper = document.createElement('div');
  $wrapper.classList.add('image-wrapper');
  $wrapper.setAttribute('data-id', photoData?.id)
  $wrapper.setAttribute('data-likes', photoData?.likes_count)

  const $img = document.createElement('img');
  $img.setAttribute('src', photoData.image_url);
  $img.classList.add('image');
  $wrapper.append($img);

  const $likes = document.createElement('div');
  $likes.classList.add('likes');
  $likes.innerHTML = `Likes: ${photoData.likes_count}`;
  $wrapper.append($likes);

  $wrapper.addEventListener('dblclick', async () => {
    const likeData = await likePhoto(photoData?.id)
    if (likeData?.success) {
      $likes.innerHTML = `Likes: ${likeData.likes_count}`
    }
  })

  return $wrapper;
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
