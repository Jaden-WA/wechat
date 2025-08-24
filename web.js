window.onhashchange = function(){
    const hash = window.location.hash;
    switch (hash){
        case '#users':
            const usersPage = document.getElementById('users-page');
            usersPage.style.display = 'block';
            renderUsersList();       
            break;

        case '#chat':
            const chatPage = document.getElementById('chat-page');
            chatPage.style.display = 'block';
            renderChatWithAssistant();
            break;

        default:
            location.hash = '#users';
    }
}

function renderUsersList() {
    const ul = document.querySelector('#users-page #list');
    ul.innerHTML = '';  // 先清空

    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => {
        if (!res.ok) throw new Error(`网络错误：${res.status}`);
        return res.json();
      })
      .then(data => {
        data.forEach(user => {
          const li = document.createElement('li');
          li.innerText = user.username;
          li.classList.add('username');
          li.addEventListener('click', () => {
            alert(`你点击了用户：${user.name}（ID=${user.id}）`);
          });
          ul.appendChild(li);
        });
      })
      .catch(err => {
        console.error(err);
        ul.innerHTML = '<li>加载用户失败，请稍后重试。</li>';
      });
  }


fetch('https://jsonplaceholder.typicode.com/users')
    .then(res => res.json())
    .then(data =>{
        const list = document.querySelector('#list');
        data.forEach(item => {
            const li = document.createElement('li');
            li.innerText = item.username;
            li.classList = 'username';
            list.appendChild(li);
        });

    })