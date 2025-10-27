const $photos = document.querySelector('#photos');

const getPhotos = async () => {
  const res = await fetch('https://image-feed-api.vercel.app/api/images');
  const {data} = await res.json();
  return data;
};

const resetList = () => {
  $photos.innerHTML = '';
};

const createPhoto = (photoData) => {
  const $wrapper = document.createElement('div');
  $wrapper.classList.add('image-wrapper');
  $wrapper.setAttribute('data-id', photoData?.id)

  const $img = document.createElement('img');
  $img.setAttribute('src', photoData.image_url);
  $img.classList.add('image');
  $wrapper.append($img);

  const $likes = document.createElement('div');
  $likes.classList.add('likes');
  $likes.innerHTML = `Likes: ${photoData.likes_count}`;
  $wrapper.append($likes);

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
