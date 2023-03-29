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

    for (let index = 0; index < 2; index++) {
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