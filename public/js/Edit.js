function changeProfilePic() {
    const fileInput = document.getElementById('profile-pic');
    const file = fileInput.files[0];
  
    const formData = new FormData();
    formData.append('profilePic', file);
  
    fetch('/Profile', {
      method: 'POST',
      body: formData
    })
    .then(response => response.json())
    .then(data => {
      const profilePic = document.getElementById('profile-picture');
      profilePic.src = data.profilePicUrl;
    })
    .catch(error => {
      console.error('Error:', error);
    });
  }
  