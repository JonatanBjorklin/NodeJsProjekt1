fetch('/displayUsers', { method: 'GET' })
.then(response => response.json())
.then(data => {
  displayUsers(data);
})
.catch(error => {
  console.error('Error:', error);
});

const displayUsers = (users) => {
const usersContainer = document.getElementById('usersContainer');

users.forEach((user, index) => {
  const userDiv = document.createElement('div');
  const image = document.createElement('img');
  const userInfo = document.createElement('div');
  const usernamePara = document.createElement('p');
  const professionPara = document.createElement('p');

  userDiv.id = `user_${index}`;
  userDiv.classList.add('card', 'm-1', 'mt-4', 'border-secondary');
  userDiv.style.width = '18rem';
  image.src = '/img/' + user.userImage;
  console.log('Image URL:', './img/' + user.userImage);
  image.alt = 'User Image';
  image.style = "min-height: 238px;";

  userInfo.classList.add('card-body');
  usernamePara.classList.add('card-text');
  professionPara.classList.add('card-text');

  usernamePara.textContent = `${user.username}`;
  professionPara.textContent = `${user.work}`;

  userInfo.appendChild(usernamePara);
  userInfo.appendChild(professionPara);

  userDiv.appendChild(image);
  userDiv.appendChild(userInfo);

  usersContainer.appendChild(userDiv);

  const targetId = document.getElementById(`user_${index}`);
  targetId.addEventListener("click", (event) => {
    location.href=`http://localhost:999/edit?user=${index}`;
  });
});
};