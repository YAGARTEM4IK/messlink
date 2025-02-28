document.addEventListener('DOMContentLoaded', function() {
    const sendButton = document.getElementById('sendButton');
    const messageInput = document.getElementById('messageInput');
    const messagesContainer = document.getElementById('messages');
    const chatList = document.getElementById('chatList');
    const chatNameElement = document.getElementById('chatName');

    const chatMessages = {
        1: [
            { text: "Привет, это чат 1!", sender: "system" }
        ],
        2: [
            { text: "Привет из чата 2!", sender: "system" }
        ],
        3: [
            { text: "Чат 3 работает!", sender: "system" }
        ]
    };

    let currentChatId = 1;
    let chatIdCounter = 4;
    let chatType = "personal";

    // Переменные для заглушения уведомлений
    let isMuted = false;

    // Массив со смайликами (можно расширить)
    const emojis = [
        '😀', '😃', '😄', '😁', '😆', '😅', '😂', '🤣', '😊', '😇', '🙂', '🙃', '😉', '😌', '😍', '🥰',
        '😘', '😗', '😙', '😚', '😋', '😛', '😝', '😜', '🤪', '🤨', '🧐', '🤓', '😎', '🤩', '🥳', '😏',
        '😒', '😞', '😔', '😟', '😕', '🙁', '☹️', '😣', '😖', '😫', '😩', '🥺', '😢', '😭', '😤', '😠',
        '😡', '🤬', '🤯', '😳', '🥵', '🥶', '😱', '😨', '😰', '😥', '😓', '🫣', '🤗', '🫣', '🤔', '🫡',
        '🤫', '🤭', '🫣', '🤡', '🤥', '🥱', '😴', '🤤', '😵', '🥴', '🤢', '🤮', '🤧', '🤕', '🤒', '🤕',
        '👻', '👽', '👾', '🤖', '🎃', '🙈', '🙉', '🙊', '💋', '💌', '💘', '💝', '💖', '💗', '💓', '💞',
        '💕', '💖', '❣', '💔', '❤️', '🧡', '💛', '💚', '💙', '💜', '🖤', '🤍', '🤎', '💯', '💢', '💥',
        '💫', '💦', '💨', '🕳️', '✨', '🌟', '💫', '💬', '👁️‍🗨️', '💭', '💡', '💯', '✅', '❤️', '👍',
    ];

    function displayMessages() {
        messagesContainer.innerHTML = '';

        const messages = chatMessages[currentChatId] || [];

        messages.forEach(message => {
            const messageElement = document.createElement('div');
            messageElement.classList.add('message');
            if (message.sender === "user") {
                messageElement.classList.add('user-message');
            } else if (message.sender === "system") {
                messageElement.classList.add('system-message');
            }

            if (message.text) {
                messageElement.textContent = message.text;
            }

            if (message.image) {
                const imgElement = document.createElement('img');
                imgElement.src = message.image;
                messageElement.appendChild(imgElement);
            }

            if (message.file) {
                const fileLink = document.createElement('a');
                fileLink.href = URL.createObjectURL(message.file);
                fileLink.textContent = message.file.name;
                fileLink.download = message.file.name;
                fileLink.classList.add('file-link');
                messageElement.appendChild(fileLink);
            }

            messagesContainer.appendChild(messageElement);
        });

        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    function addMessage(text, sender = "user") {
        chatMessages[currentChatId].push({ text: text, sender: sender });
        displayMessages();
        // Здесь добавим логику для уведомлений, если они не заглушены
        if (!isMuted) {
            // Показываем уведомление (например, с использованием API Notification)
            showNotification(`Новое сообщение в чате ${chatNameElement.textContent}`);
        }
    }

    function showNotification(message) {
        if (!("Notification" in window)) {
            alert(message); // Fallback для браузеров, не поддерживающих Notification API
            return;
        }

        if (Notification.permission === "granted") {
            new Notification(message);
        } else if (Notification.permission !== "denied") {
            Notification.requestPermission().then(function (permission) {
                if (permission === "granted") {
                    new Notification(message);
                }
            });
        }
    }

    function addImageMessage(dataURL) {
        chatMessages[currentChatId].push({ image: dataURL, sender: "user" });
        displayMessages();
    }

    function addFileMessage(file) {
        chatMessages[currentChatId].push({ file: file, sender: "user" });
        displayMessages();
    }

    sendButton.addEventListener('click', function() {
        const messageText = messageInput.value.trim();

        if (messageText !== '') {
            addMessage(messageText);
            messageInput.value = '';
        }
    });

    messageInput.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
            sendButton.click();
            event.preventDefault();
        }
    });

    chatList.addEventListener('click', function(event) {
        const chatItem = event.target.closest('li');
        if (chatItem && chatItem.dataset.chatId) {
            const chatId = parseInt(chatItem.dataset.chatId);

            if (chatId === currentChatId) {
                return;
            }

            const activeChat = chatList.querySelector('.active');
            if (activeChat) {
                activeChat.classList.remove('active');
            }

            chatItem.classList.add('active');
            currentChatId = chatId;
            displayMessages();
            loadMuteState(); // Загружаем состояние при смене чата

            chatNameElement.textContent = chatItem.textContent;
        }
    });

    displayMessages();

    const initialActiveChat = chatList.querySelector('.active');
    if (initialActiveChat) {
        chatNameElement.textContent = initialActiveChat.textContent;
    }

    const profileMenu = document.querySelector('.profile-menu');
    const profileModal = document.getElementById('profileModal');
    const settingsModal = document.getElementById('settingsModal');
    const featuresModal = document.getElementById('featuresModal');

    const createChatButton = document.getElementById('createChatButton');
    const createChatModal = document.getElementById('createChatModal');
    const newChatNameInput = document.getElementById('newChatNameInput');
    const confirmCreateChat = document.getElementById('confirmCreateChat');

    const createPersonalChatButton = document.getElementById('createPersonalChatButton');
    const createGroupChatButtonInModal = document.getElementById('createGroupChatButtonInModal');

    const dropdownToggle = document.querySelector('.dropdown-toggle');
    const dropdownMenu = document.querySelector('.dropdown-menu');
    const dropdown = document.querySelector('.dropdown');
    const chatInfoModal = document.getElementById('chatInfoModal');
    const chatInfoContent = document.getElementById('chatInfoContent');
    const closeModalButtons = document.querySelectorAll('.close');

    if (profileMenu && profileModal && settingsModal && featuresModal) {
        profileMenu.addEventListener('click', function(event) {
            const target = event.target;
            if (target.tagName === 'A') {
                event.preventDefault();
                const menuItem = target.textContent.trim();

                if (menuItem === 'Основные данные') {
                    profileModal.style.display = "block";
                } else if (menuItem === 'Настройки') {
                    settingsModal.style.display = "block";
                } else if (menuItem === 'Возможности') {
                    featuresModal.style.display = "block";
                }

                console.log(`Выбран пункт меню: ${menuItem}`);
            }
        });
    }

    if (createChatButton && createChatModal && createPersonalChatButton && createGroupChatButtonInModal) {
        createChatButton.addEventListener('click', function() {
            createChatModal.style.display = "block";
        });

        createPersonalChatButton.addEventListener('click', function() {
            chatType = "personal";
        });

        createGroupChatButtonInModal.addEventListener('click', function() {
            chatType = "group";
        });
    }

    const addFileButton = document.getElementById('addFileButton');
    if (addFileButton) {
        addFileButton.addEventListener('click', function() {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.addEventListener('change', function(event) {
                const file = event.target.files[0];
                if (file) {
                    addFileMessage(file);
                }
            });
            fileInput.click();
        });
    }

    if (newChatNameInput && confirmCreateChat && chatList) {
        confirmCreateChat.addEventListener('click', function() {
            const newChatName = newChatNameInput.value.trim();
            if (newChatName !== '') {
                const newChatItem = document.createElement('li');
                newChatItem.dataset.chatId = chatIdCounter;
                newChatItem.textContent = newChatName;
                newChatItem.innerHTML += `<i class="fas fa-bell-slash muted-icon" data-chat-id="${chatIdCounter}" style="display: none;"></i>`; // Добавляем иконку для нового чата

                chatList.appendChild(newChatItem);

                const activeChat = chatList.querySelector('.active');
                if (activeChat) {
                    activeChat.classList.remove('active');
                }

                newChatItem.classList.add('active');

                currentChatId = chatIdCounter;
                chatMessages[currentChatId] = [];
                displayMessages();
                loadMuteState();

                chatNameElement.textContent = newChatName;

                chatIdCounter++;

                createChatModal.style.display = "none";
                newChatNameInput.value = '';
            }
        });
    }

    if (dropdownToggle && dropdownMenu && dropdown) {
        dropdownToggle.addEventListener('click', function(event) {
            event.stopPropagation();
            dropdown.classList.toggle('show');
        });

        document.addEventListener('click', function(event) {
            if (!dropdown.contains(event.target)) {
                dropdown.classList.remove('show');
            }
        });

        const chatInfoLink = document.getElementById('chatInfoLink');
        if (chatInfoLink) {
            chatInfoLink.addEventListener('click', function(event) {
                event.preventDefault();
                displayChatInfo();
                chatInfoModal.style.display = "block";
                dropdown.classList.remove('show');
            });
        }

        const muteChatLink = document.getElementById('muteChatLink');
        if (muteChatLink) {
            muteChatLink.addEventListener('click', function(event) {
                event.preventDefault();
                toggleMute();
                dropdown.classList.remove('show');
            });
        }

        const deleteChatLink = document.getElementById('deleteChatLink');
        if (deleteChatLink) {
            deleteChatLink.addEventListener('click', function(event) {
                event.preventDefault();
                deleteChat();
                dropdown.classList.remove('show');
            });
        }
    }

    function displayChatInfo() {
        let chatInfo = "";
        if (currentChatId === 1) {
            chatInfo = "<p><strong>Название:</strong> Чат 1</p><p><strong>Тип:</strong> Личный чат</p><p><strong>Участники:</strong> Тёма Клочков, Пользователь 1</p>";
        } else if (currentChatId === 2) {
            chatInfo = "<p><strong>Название:</strong> Чат 2</p><p><strong>Тип:</strong> Личный чат</p><p><strong>Участники:</strong> Тёма Клочков, Пользователь 2</p>";
        } else if (currentChatId === 3) {
            chatInfo = "<p><strong>Название:</strong> Чат 3</p><p><strong>Тип:</strong> Личный чат</p><p><strong>Участники:</strong> Тёма Клочков, Пользователь 3</p>";
        } else {
            const chatName = document.querySelector(`#chatList li[data-chat-id="${currentChatId}"]`).textContent;
            chatInfo = `<p><strong>Название:</strong> ${chatName}</p><p><strong>Тип:</strong> Групповой чат</p><p><strong>Участники:</strong> Тёма Клочков (Вы)</p>`;
        }

        chatInfoContent.innerHTML = chatInfo;
    }

    function deleteChat() {
        const chatItem = document.querySelector(`#chatList li[data-chat-id="${currentChatId}"]`);
        if (chatItem) {
            chatItem.remove();
            delete chatMessages[currentChatId];

            const chatListItems = document.querySelectorAll('#chatList li');
            if (chatListItems.length > 0) {
                currentChatId = parseInt(chatListItems[0].dataset.chatId);
                chatListItems[0].classList.add('active');
                chatNameElement.textContent = chatListItems[0].textContent;
                loadMuteState();
            } else {
                currentChatId = null;
                chatNameElement.textContent = "";
            }
            displayMessages();
        }
    }

    function toggleMute() {
        isMuted = !isMuted;
        const mutedIcon = document.querySelector(`.sidebar li[data-chat-id="${currentChatId}"] .muted-icon`);
        const muteChatLink = document.getElementById('muteChatLink');
        const muteText = document.getElementById('muteText');

        if (muteChatLink && muteText) {
            if (isMuted) {
                muteText.textContent = "Включить уведомления";
                mutedIcon.style.display = 'inline'; // Показываем иконку
            } else {
                muteText.textContent = "Заглушить уведомления";
                mutedIcon.style.display = 'none'; // Скрываем иконку
            }
        }
        localStorage.setItem(`chat_${currentChatId}_muted`, isMuted);
        console.log(`Уведомления для чата ${currentChatId} ${isMuted ? 'заглушены' : 'включены'}`);
    }

    function loadMuteState() {
        const storedMuteState = localStorage.getItem(`chat_${currentChatId}_muted`);
        const mutedIcon = document.querySelector(`.sidebar li[data-chat-id="${currentChatId}"] .muted-icon`);
        const muteChatLink = document.getElementById('muteChatLink');
        const muteText = document.getElementById('muteText');

        if (storedMuteState !== null) {
            isMuted = (storedMuteState === 'true');

            if (muteChatLink && muteText && mutedIcon) {
                if (isMuted) {
                    muteText.textContent = "Включить уведомления";
                    mutedIcon.style.display = 'inline'; // Показываем иконку
                } else {
                    muteText.textContent = "Заглушить уведомления";
                    mutedIcon.style.display = 'none'; // Скрываем иконку
                }
            }
        }
    }

    function populateEmojiPanel() {
        const emojiGrid = document.querySelector('.emoji-grid');
        emojis.forEach(emoji => {
            const emojiSpan = document.createElement('span');
            emojiSpan.textContent = emoji;
            emojiSpan.addEventListener('click', () => {
                messageInput.value += emoji; // Добавляем смайлик в input
                messageInput.focus();
            });
            emojiGrid.appendChild(emojiSpan);
        });
    }

    // Обработчик клика по кнопке смайликов
    const emojiButton = document.getElementById('emojiButton');
    const emojiPanel = document.getElementById('emojiPanel');

    if (emojiButton) {
        emojiButton.addEventListener('click', () => {
            if (emojiPanel.style.display === 'none') {
                emojiPanel.style.display = 'block';
                // Закрываем панель по клику вне её области
                document.addEventListener('click', closeEmojiPanelOnClickOutside);
            } else {
                emojiPanel.style.display = 'none';
                document.removeEventListener('click', closeEmojiPanelOnClickOutside);
            }
        });
    }
    // Функция для закрытия панели смайликов по клику вне её области
    function closeEmojiPanelOnClickOutside(event) {
        if (!emojiPanel.contains(event.target) && event.target !== emojiButton) {
            emojiPanel.style.display = 'none';
            document.removeEventListener('click', closeEmojiPanelOnClickOutside);
        }
    }


    // Вызываем функцию для заполнения панели при загрузке страницы
    populateEmojiPanel();
    loadMuteState();

    closeModalButtons.forEach(function(button) {
        button.addEventListener('click', function() {
            const modal = button.closest('.modal');
            if (modal) {
                modal.style.display = "none";
            }
        });
    });

    window.addEventListener('click', function(event) {
        if (event.target === chatInfoModal || event.target === profileModal || event.target === settingsModal || event.target === featuresModal || event.target === createChatModal) {
            chatInfoModal.style.display = "none";
            profileModal.style.display = "none";
            settingsModal.style.display = "none";
            featuresModal.style.display = "none";
            createChatModal.style.display = "none";
        }
    });
});

// v.0.2
