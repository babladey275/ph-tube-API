/**
 * 1. fetch, load and show categories on html
 * 
 */
function getTimeString(time){
  const hour = parseInt(time / 3600);
  let remainingSecond = time % 3600;
  const minute = parseInt(remainingSecond / 60);
  remainingSecond = remainingSecond % 60;
  return `${hour}hour ${minute}minute ${remainingSecond}second ago`;
}

const removeActiveClass = () => {
  const buttons = document.getElementsByClassName("category-btn");
  for(const button of buttons){
    button.classList.remove("bg-red-500", "text-white");
  }
};

//categories
const loadCategories = () => {
    fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
    .then(res => res.json())
    .then(data => displayCategories(data.categories))
    .catch(error => console.log(error));
}

//videos
const loadVideos = (searchText = "") => {
  fetch(`https://openapi.programming-hero.com/api/phero-tube/videos?title=${searchText}`)
  .then(res => res.json())
  .then(data => displayVideos(data.videos))
  .catch(error => console.log(error))
}

const loadCategoriesVideos = (id) => {
  fetch(`https://openapi.programming-hero.com/api/phero-tube/category/${id}`)
  .then(res => res.json())
  .then(data => {
    removeActiveClass();
    const activeBtn = document.getElementById(`btn-${id}`);
    activeBtn.classList.add("bg-red-500", "text-white");
    displayVideos(data.category);
  })
  .catch(error => console.log(error));
};

const displayCategories = (categories) => {
    const categoryContainer = document.getElementById('categories');
    categories.forEach(item => {
        const buttonContainer = document.createElement('div');
        buttonContainer.innerHTML = `
        <button id="btn-${item.category_id}" onclick="loadCategoriesVideos(${item.category_id})" class="btn category-btn">${item.category}</button>
        `;

        categoryContainer.append(buttonContainer);
    });
}

const loadDetails = async (videoId) => {
  console.log(videoId);
  const url = `https://openapi.programming-hero.com/api/phero-tube/video/${videoId}`;
  const res = await fetch(url);
  const data = await res.json();
  displaDetails(data.video);
}
const displaDetails = (video) => {
  const detailContainer = document.getElementById('modal-content');

  document.getElementById('customModal').showModal();

  detailContainer.innerHTML = `
  <img src="${video.thumbnail}">
  <p>${video.description}</p>
  `;
}

const displayVideos = (videos) => {
    const videoContainer = document.getElementById('videos');
    videoContainer.innerHTML = "";

    if(!videos.length){
      videoContainer.classList.remove('grid');
      videoContainer.innerHTML = `
      <div class="min-h-[300px] w-full flex flex-col justify-center items-center gap-5">
        <img src="assets/Icon.png" alt="">
        <h2 class="font-bold text-center text-xl">No content here in this category</h2>
      </div>
      `;
      return;
    }
    else{
      videoContainer.classList.add('grid');
    }

    videos.forEach(video => {
        const card = document.createElement('div');
        card.classList = "card card-compact"
        card.innerHTML = `
        <figure class="h-full relative">
            <img
              src="${video.thumbnail}" class="h-full w-full object-cover"
              alt="" />
              ${
                video.others.posted_date?.length === 0 ? "" : `<span class="absolute text-white bg-black right-2 bottom-2 rounded p-1">${getTimeString(video.others.posted_date)}</span>`
              }
        </figure>
        <div class="px-0 py-2 flex gap-2">
          <div>
            <img class="w-10 h-10 rounded-full object-cover" src="${video.authors[0].profile_picture}" alt="">
          </div>
          <div>
            <h2 class="font-bold"> ${video.title} </h2>
          <div class="flex items-center gap-2">
            <p class="text-gray-400">${video.authors[0].profile_name}</P>
            ${video.authors[0].verified === true ? `<img class="w-5" src="https://img.icons8.com/?size=96&id=D9RtvkuOe31p&format=png">` : ""}
          </div>
          <div>
          <button onclick="loadDetails('${video.video_id}')" class="btn btn-sm btn-error mt-1">Details</button>
          </div>
        </div>
        `;
        videoContainer.append(card);
    });
}

document.getElementById("search-input").addEventListener("keyup", (event) => {
  loadVideos(event.target.value);
});
loadCategories();
loadVideos();