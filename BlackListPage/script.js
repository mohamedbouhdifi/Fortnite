let subMenu = document.getElementById("subMenu");
const apiUrl = 'https://fortnite-api.com/v2/cosmetics/br';
const container = document.querySelector('.skin-container');

const toggleBtn = document.querySelector('.toggle_btn')
    const toggleBtnIcon = document.querySelector('.toggle_btn i')
    const dropDownMenu = document.querySelector('.dropdown_menu')

    toggleBtn.onclick = function () {
      dropDownMenu.classList.toggle('open')
      const isOpen = dropDownMenu.classList.contains('open')

      toggleBtnIcon.classList = isOpen ? 'fa-solid fa-xmark' : 'fa-solid fa-bars'

    }

function toggleMenu() {
  subMenu.classList.toggle("open-menu");
}
function showConfirmationPopup() {
    document.getElementById("confirmation-popup").style.display = "block";
}

function hideConfirmationPopup() {
    document.getElementById("confirmation-popup").style.display = "none";
}

function deleteItem() {
    console.log("Item deleted.");
    hideConfirmationPopup();
}


fetch(apiUrl)
  .then(response => response.json())
  .then(data => {
    const skins = data.data.filter(item => item.type.value === 'outfit');

    for (let index = 8; index < 16; index++) {
      const skin = skins[index];

      if (skin.name != "null" && skin.images.featured != null) {
        if (skin.rarity.displayValue == "Legendary" || skin.rarity.displayValue == "Epic" || skin.rarity.displayValue == "Rare" || skin.rarity.displayValue == "Uncommon") {
          const card = document.createElement('div');
          card.classList.add('skin-card');
          if (skin.rarity.displayValue == "Legendary") {
            card.innerHTML = 
          `<img src="${skin.images.icon}" style="background-image: linear-gradient( 90.5deg,  rgba(255,207,139,0.50) 1.1%, rgba(255,207,139,1) 81.3% );" alt="${skin.description}" data-src="${skin.images.featured}" data-name="${skin.name}">
          <h3>${skin.name}</h3>`;
          }
          else if (skin.rarity.displayValue == "Epic") {
            card.innerHTML = 
          `<img src="${skin.images.icon}" style="background-image: radial-gradient( circle farthest-corner at 83.7% 4.3%,  rgba(173,0,171,1) 0%, rgba(15,51,92,1) 90% );" alt="${skin.description}" data-src="${skin.images.featured}" data-name="${skin.name}">
          <h3>${skin.name}</h3>`;
          }
          else if (skin.rarity.displayValue == "Uncommon") {
            card.innerHTML = 
          `<img src="${skin.images.icon}" style="background-image: linear-gradient( 73.1deg,  rgba(34,126,34,1) 8%, rgba(99,162,17,1) 86.9% );" alt="${skin.description}" data-src="${skin.images.featured}" data-name="${skin.name}">
          <h3>${skin.name}</h3>`;
          } 
          else {
            card.innerHTML = 
          `<img src="${skin.images.icon}" style="background-image: linear-gradient( 96.5deg,  rgba(39,103,187,1) 10.4%, rgba(16,72,144,1) 87.7% );" alt="${skin.description}" data-src="${skin.images.featured}" data-name="${skin.name}">
          <h3>${skin.name}</h3>`;
          }
          container.appendChild(card);
      
        }
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

        <span class="delete-icon" onclick="showConfirmationPopup()"><i class="fa fa-trash-o" style="color:red"></i></span>
    
        <div class="popupDelete" id="confirmation-popup">
            <h2>Are you sure you want to delete?</h2>
            <button onclick="deleteItem()">Yes</button>
            <button onclick="hideConfirmationPopup()">No</button>
        </div>
          <span class="btn-close"><i class="fa fa-close"></i></span>
          
          <img src="${skinCard.querySelector('img').dataset.src}" alt="${skinCard.querySelector('img').alt}">
          <h1>${skinCard.querySelector('img').dataset.name}</h1>
          <h3>${skinCard.querySelector('img').alt}</h3><br>
          <div>
          <div class="comment-box">
          <h3>Reason:</h3>
          <textarea id="comment" placeholder="Enter your reason here..."></textarea><br>
          <button onclick="saveComment()" class= "buttonC" >Save</button>
          </div>         
        
        </div>
      `;
    document.body.appendChild(popup);

    const closeBtn = popup.querySelector('.btn-close');
    closeBtn.addEventListener('click', () => {
      popup.remove();
    });
  }
});