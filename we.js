
function hideAllPages() {
  document.getElementById('users-page').style.display = 'none';
  document.getElementById('chat-page').style.display = 'none';
}

function highlightIcon(which) {
  document.getElementById('link-chat')?.classList.remove('active');
  document.getElementById('link-users')?.classList.remove('active');
  if (which === 'users') {
    document.getElementById('link-users')?.classList.add('active');
  } else if (which === 'chat') {
    document.getElementById('link-chat')?.classList.add('active');
  }
}

function renderUsersList() {
  const usersPage = document.getElementById('users-page');
  usersPage.innerHTML = ''; // 清空旧内容

  // 获取缓存用户数据（如果还没有，就从 API 获取并生成颜色）
  let users = JSON.parse(localStorage.getItem('user_list'));
  if (!users) {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(fetchedUsers => {
        // 为每个用户生成随机颜色
        const enhancedUsers = fetchedUsers.map(user => ({
          ...user,
          color: `rgba(${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(Math.random() * 256)}, 1)`
        }));

        localStorage.setItem('user_list', JSON.stringify(enhancedUsers));
        window.__USERS__ = enhancedUsers;
        renderUsersList(); // 再次调用自身渲染
      });
    return;
  }

  // 若已存在缓存
  window.__USERS__ = users;

  const list = document.createElement('div');
  list.classList.add('user-list');

  users.forEach(user => {
    const item = document.createElement('div');
    item.classList.add('chat-list-item');
    item.dataset.id = user.id;

    let avatar;

    avatar = document.createElement('div');
    avatar.classList.add('user-avatar');
    avatar.textContent = user.name.charAt(0).toUpperCase();
    avatar.style.backgroundColor = user.color || '#999'; // 如果颜色为空给默认值
    

    const nameSpan = document.createElement('span');
    nameSpan.textContent = user.name;

    item.appendChild(avatar);
    item.appendChild(nameSpan);

    item.addEventListener('click', () => {
      addChatToMiddle(user.id, user.name);
      window.location.hash = `#chat?id=${user.id}&name=${encodeURIComponent(user.name)}`;
    });

    list.appendChild(item);
  });

  usersPage.appendChild(list);
}

// 当前聊天窗口
function highlightCurrentChat(contactId) {
  document.querySelectorAll('.chat-list-item').forEach(item => {
    item.classList.remove('active');
    if (item.dataset.id === contactId) {
      item.classList.add('active');
    }
  });
}

function addChatToMiddle(contactId, contactName) {
  const chatList = document.getElementById('chat-list-page');
  const idStr = String(contactId);

  // 检查是否已存在
  const existingItem = chatList.querySelector(`.chat-list-item[data-id="${idStr}"]`);
  if (existingItem) return;

  const item = document.createElement('div');
  item.classList.add('chat-list-item');
  item.dataset.id = idStr;

  let avatar;

  if (contactName === '文件传输助手') {
    avatar = document.createElement('img');
    avatar.classList.add('chat-avatar');
    avatar.src = './assets/icons/文件传输助手.svg';
  } else {
    const userData = window.__USERS__?.find(u => String(u.id) === idStr);
    avatar = document.createElement('div');
    avatar.classList.add('user-avatar');
    avatar.textContent = contactName.charAt(0).toUpperCase();
    if (userData && userData.color) {
      avatar.style.backgroundColor = userData.color;
    }
  }

  const nameSpan = document.createElement('span');
  nameSpan.textContent = contactName;

  item.appendChild(avatar);
  item.appendChild(nameSpan);

  item.addEventListener('click', () => {
    window.location.hash = `#chat?id=${idStr}&name=${encodeURIComponent(contactName)}`;
  });

  chatList.appendChild(item);

  const contactList = JSON.parse(localStorage.getItem('chat_contacts') || '[]');
  contactList.push({ id: contactId, name: contactName });
  localStorage.setItem('chat_contacts', JSON.stringify(contactList));
}

function loadChatContactsFromStorage() {
  const savedContacts = JSON.parse(localStorage.getItem('chat_contacts') || '[]');
  savedContacts.forEach(contact => {
    addChatToMiddle(contact.id, contact.name);
  });
}

window.addEventListener('load', function () {
  loadChatContactsFromStorage();  // 渲染中间联系人栏
  window.onhashchange();          // 渲染页面内容
});

function renderChatWindow() {
  const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const contactId = params.get('id');
  const contactName = params.get('name') ? decodeURIComponent(params.get('name')) : `用户 ${contactId}`;

  const chatPage = document.getElementById('chat-page');
  const headerEl = chatPage.querySelector('.chat-header');
  headerEl.textContent = contactName;

  const contentEl = chatPage.querySelector('.chat-body');
  contentEl.innerHTML = '';

  const msg = document.createElement('div');
  msg.classList.add('msg-o');

  const bubble = document.createElement('div');
  bubble.classList.add('message-bubble-white');
  bubble.textContent = `你好,我的名字是 ${contactName},很高兴认识你`;

  let avatar;
  if (contactName === '文件传输助手') {
    avatar = document.createElement('img');
    avatar.src = './assets/icons/文件传输助手.svg';
    avatar.classList.add('user-avatar');
  } else {
    const userData = window.__USERS__?.find(u => String(u.id) === contactId);
    avatar = document.createElement('div');
    avatar.classList.add('user-avatar');
    avatar.textContent = contactName.charAt(0).toUpperCase();
    if (userData && userData.color) {
      avatar.style.backgroundColor = userData.color;
    }
  }

  const triangleLeft = document.createElement('div');
  triangleLeft.classList.add('triangle-left');

  msg.appendChild(avatar);
  msg.appendChild(triangleLeft);
  msg.appendChild(bubble);

  contentEl.appendChild(msg);

  highlightCurrentChat(contactId);

  const messageHistory = JSON.parse(localStorage.getItem(`chat_messages_${contactId}`)) || [];
  messageHistory.forEach(msg => {
    if (msg.type === 'sent') {
      renderMyMessage(msg.text);
    }
  });
}


function renderMyMessage(text) {
  const chatPage = document.getElementById('chat-page');

  const contentEl = chatPage.querySelector('.chat-body');

  const msg = document.createElement('div');
  msg.classList.add('msg-i'); 

  const bubble = document.createElement('div');
  bubble.classList.add('message-bubble');
  bubble.textContent = text;

  const avatar = document.createElement('img');
  avatar.classList.add('chat-avatar');
  avatar.src = './assets/icons/avatar.jpg'; 

  const triangleRight = document.createElement('div');
  triangleRight.classList.add('triangle-right');

  msg.appendChild(bubble);
  msg.appendChild(triangleRight);
  msg.appendChild(avatar);

  contentEl.appendChild(msg);

  contentEl.scrollTop = contentEl.scrollHeight;
}  

const inputChat = document.getElementById('input-chat');
inputChat.addEventListener("keyup", function(event){
  if (event.code === "Enter") {
    const text = inputChat.value.trim();
    if (text) {
      renderMyMessage(text); // 把消息显示到聊天窗口
      cacheMyMessage(text);
      inputChat.value = '';  // 清空输入框
    }
  }
});

function cacheMyMessage(text) {
  const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
  const contactId = params.get('id');
  if (!contactId) return;

  const key = `chat_messages_${contactId}`;
  const history = JSON.parse(localStorage.getItem(key)) || [];

  history.push({
    type: 'sent',
    text: text,
    timestamp: Date.now()
  });

  localStorage.setItem(key, JSON.stringify(history));
}

window.onhashchange = function () {
  const hash = window.location.hash.split('?')[0];

  hideAllPages(); 

  switch (hash) {
    case '#users':
      document.getElementById('users-page').style.display = 'block';
      document.getElementById('chat-list-page').style.display = 'none';
      renderUsersList();
      highlightIcon('users');
      break;

    case '#chat':
      document.getElementById('chat-page').style.display = 'block';
      document.getElementById('chat-list-page').style.display = 'block';

      const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
      const id = params.get('id');
      

      renderChatWindow();
      highlightIcon('chat');
      break;

    default:
      location.hash = '#users';
  }
};




window.addEventListener('load', function () {
  window.onhashchange();
});

