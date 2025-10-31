import { getPhotos, likePhoto, postComment } from "./api";

const COMMENTER_NAME = 'Andreas Valegård'
const $photos = document.querySelector('#photos');

const $create = (elementType = 'div', classList = []) => {
  const elem = document.createElement(elementType)
  if (classList && classList.length > 0) {
    elem.classList = classList.join(" ")
  }
  return elem
}

const resetList = () => {
  $photos.innerHTML = '';
};

const createLikesString = (likes) => {
  return `${likes} likes`
}

const handleDoubleClick = async (e, $parent, data) => {
    const $wrapper = $parent.querySelector('.js-image-wrapper')
    showLikeOverlay($wrapper)
    const response = await likePhoto(data?.id)
    if (response?.success) {
      const $likes = $parent.querySelector('.js-likes')
      $likes.innerHTML = createLikesString(response.likes_count)
    }
}

const handlePostComment = async (e, imageId, $parent) => {
  const comment = $parent.querySelector('.js-comment-input')?.value
  if (!comment) return

  const res = await postComment(imageId, COMMENTER_NAME, comment);

  if (res.success) {
    $parent.querySelector('.js-add-comment').remove()
    const $commentButton = $parent.querySelector('.js-comment-button')
    $commentButton.style.display = 'block'
  }
}

const handleComment = (e, $parent, $button) => {
  $button.style.display = 'none'
  const imageId = $parent.getAttribute('data-id');
  const $addComment = $create('div', ['add-comment', 'js-add-comment'])
  const $input = $create('input', ['js-comment-input'])
  const $postCommentButton = $create('button', ['js-post-comment-button'])
  $input.setAttribute('placeholder', 'Enter comment...')
  $postCommentButton.textContent = 'Post comment'
  $postCommentButton.addEventListener('click', (e) => handlePostComment(e, imageId, $parent))
  $addComment.append($input)
  $addComment.append($postCommentButton)
  $parent.append($addComment)
}

const showLikeOverlay = ($root) => {
  const $overlay = $create('div', ['overlay'])
  $overlay.innerHTML = '❤️'
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

const renderComments = ($elem, comments) => {
  if (!comments || comments.length === 0) return
  comments.forEach((comment) => {
    const $comment = $create('div', ['comment'])
    const $name = $create('div', ['commenter-name'])
    const $text = $create('div', ['comment-text'])
    
    $name.textContent = comment.commenter_name
    $text.textContent = comment.comment

    $comment.append($name)
    $comment.append($text)

    $elem.append($comment)
  })
}

const createCard = (photoData) => {
  const $card = $create('div', ['card']);
  $card.setAttribute('data-id', photoData?.id)

  const $header = $create('div', ['header'])
  const $author = $create('div', ['author'])
  const $authorAvatar = $create('div', ['author-avatar'])
  const $authorName = $create('div', ['author-name'])
  $authorName.textContent = 'Andreas Valegård'
  const $postedAt = $create('div', ['posted-at'])
  $postedAt.innerHTML = `<span>•</span><span>16h</span>`
  $author.append($authorAvatar)
  $author.append($authorName)
  $author.append($postedAt)
  $header.append($author)

  const $actions = $create('div', ['actions'])
  $actions.textContent = '•••'
  $header.append($actions)

  $card.append($header)

  const $wrapper = $create('div', ['image-wrapper', 'js-image-wrapper']);
  $card.append($wrapper)

  const $img = $create('img', ['image']);
  $img.setAttribute('src', photoData.image_url);
  $img.addEventListener('dblclick', (e) => handleDoubleClick(e, $card, photoData))
  $wrapper.append($img);

  const $footer = $create('div', ['footer'])
  $card.append($footer)

  const $commentSection = $create('div', ['comments', 'js-comments'])
  renderComments($commentSection, photoData.comments)
  $card.append($commentSection);

  const $likesContainer = $create('div', ['likes-container'])
  const $likeProfiles = $create('div', ['like-profiles']);
  $likeProfiles.append($create('span'))
  $likesContainer.append($likeProfiles)
  const $likes = $create('div', ['likes', 'js-likes']);
  $likes.innerHTML = createLikesString(photoData.likes_count);
  $likesContainer.append($likes);
  $footer.append($likesContainer)

  const $commentButton = $create('button', ['comment-button', 'js-comment-button'])
  $commentButton.textContent = 'Comment'
  $commentButton.addEventListener('click', (e) => handleComment(e, $card, $commentButton))
  $footer.append($commentButton)

  return $card;
};

const render = async () => {
  resetList();
  console.log('getPhotos', await getPhotos())
  const photos = await getPhotos();

  photos.forEach((i) => {
    const $photo = createCard(i);
    $photos.append($photo);
  });
};

render();
