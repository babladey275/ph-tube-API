/**
 * 1. fetch, load and show categories on html
 * 
 */
function getTimeString(time){
  const hour = parseInt(time / 3600);
  let remainingSecond = time % 3600;
  const minute = parseInt(remainingSecond / 60);
  remainingSecond = remainingSecond % 60;
  return `${hour} hour ${minute} ${remainingSecond} second ago`;
}


//categories
const loadCategories = () => {
    fetch('https://openapi.programming-hero.com/api/phero-tube/categories')
    .then(res => res.json())
    .then(data => displayCategories(data.categories))
    .catch(error => console.log(error));
}

const displayCategories = (categories) => {
    const categoryContainer = document.getElementById('categories');
    categories.forEach(item => {
        const button = document.createElement('button');
        button.classList = 'btn';
        button.innerText = item.category;

        categoryContainer.appendChild(button);
    });
}

//videos
const loadVideos = () => {
    fetch('https://openapi.programming-hero.com/api/phero-tube/videos')
    .then(res => res.json())
    .then(data => displayVideos(data.videos))
    .catch(error => console.log(error))
}

const displayVideos = (videos) => {
    const videoContainer = document.getElementById('videos');
    videos.forEach(video => {
        console.log(video)
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
        </div>
        `;
        videoContainer.append(card);
    });
}

loadCategories();
loadVideos();