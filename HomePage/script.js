let subMenu =  document.getElementById("subMenu");
const apiUrl = 'https://fortnite-api.com/v2/cosmetics/br';
const container = document.querySelector('.skin-container');

function toggleMenu(){
  subMenu.classList.toggle("open-menu");
}

fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    const skins = data.data.filter(item => item.type.value === 'outfit');

    for (let index = 0; index < 31; index++) {
      const skin = skins[index];

      if (skin.name != "null" && skin.images.featured != null) {

        const card = document.createElement('div');
        card.classList.add('skin-card');
        card.innerHTML = `
        <img src="${skin.images.icon}" alt="${skin.description}" data-src="${skin.images.featured}" data-name="${skin.name}">
        <h3>${skin.name}</h3>
      `;
        container.appendChild(card);
      }

    }

  })
  .catch(error => console.error(error));

container.addEventListener('click', event => {
  const skinCard = event.target.closest('.skin-card');
  if (skinCard) {
    const popup = document.createElement('div');
    popup.classList.add('popup');
    popup.innerHTML = `
        <div class="popup-content">
          <button class="btn-close">&times;</button>
          <img src="${skinCard.querySelector('img').dataset.src}" alt="${skinCard.querySelector('img').alt}">
          <h1>${skinCard.querySelector('img').dataset.name}</h1>
          <h3>${skinCard.querySelector('img').alt}</h3>
        </div>
      `;
    document.body.appendChild(popup);

    const closeBtn = popup.querySelector('.btn-close');
    closeBtn.addEventListener('click', () => {
      popup.remove();
    });
  }
});