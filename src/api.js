const BASE_URL = "https://image-feed-api.vercel.app/api"

export const getPhotos = async () => {
  const res = await fetch(`${BASE_URL}/images`);
  const { data } = await res.json();
  return data;
};

export const likePhoto = async (id) => {
  const res = await fetch(`${BASE_URL}/images/${id}/like`, { method: "POST" });
  return await res.json()
}

export const postComment = async (imageId, commenterName, comment) => {
    const res = await fetch(`${BASE_URL}/images/${imageId}/comment`, {
        method: "POST",
        body: JSON.stringify({
            commenter_name: commenterName,
            comment
        })
    })
    return await res.json()
}