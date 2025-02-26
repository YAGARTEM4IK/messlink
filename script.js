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
    let chatType = "personal"; // Тип чата по умолчанию

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

            // Обработка текстовых сообщений
            if (message.text) {
                messageElement.textContent = message.text;
            }

            // Обработка изображений
            if (message.image) {
                const imgElement = document.createElement('img');
                imgElement.src = message.image;
                messageElement.appendChild(imgElement);
            }

            // Обработка файлов
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

    const addPhotoButton = document.getElementById('addPhotoButton');
    const addFileButton = document.getElementById('addFileButton');

    if (addPhotoButton && addFileButton) {
        addPhotoButton.addEventListener('click', function() {
            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.accept = 'image/*';
            fileInput.addEventListener('change', function(event) {
                const file = event.target.files[0];
                if (file) {
                    const reader = new FileReader();
                    reader.onload = function(e) {
                        addImageMessage(e.target.result);
                    }
                    reader.readAsDataURL(file); // Читаем файл как Data URL
                }
            });
            fileInput.click();
        });

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
                // Создаем новый элемент списка чатов
                const newChatItem = document.createElement('li');
                newChatItem.dataset.chatId = chatIdCounter;
                newChatItem.textContent = newChatName;

                // Добавляем чат в список
                chatList.appendChild(newChatItem);

                // Снимаем класс active с текущего активного элемента
                const activeChat = chatList.querySelector('.active');
                if (activeChat) {
                    activeChat.classList.remove('active');
                }

                // Делаем новый чат активным
                newChatItem.classList.add('active');

                // Обновляем currentChatId и отображаем сообщения для нового чата
                currentChatId = chatIdCounter;
                chatMessages[currentChatId] = [];  // Создаем пустой массив сообщений для нового чата
                displayMessages();

                // Обновляем имя чата в header
                chatNameElement.textContent = newChatName;

                // Увеличиваем счетчик ID для следующего чата
                chatIdCounter++;

                // Закрываем модальное окно и очищаем поле ввода
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

        // Получаем ссылку "Информация о чате"
        const chatInfoLink = dropdownMenu.querySelector('a[href="#"]');
        if (chatInfoLink) {
            chatInfoLink.addEventListener('click', function(event) {
                event.preventDefault();

                // Отображаем информацию о чате
                displayChatInfo();

                // Показываем модальное окно
                chatInfoModal.style.display = "block";

                // Закрываем выпадающее меню
                dropdown.classList.remove('show');
            });
        }

        const deleteChatLink = document.getElementById('deleteChatLink'); // Получаем ссылку "Удалить чат"
            if (deleteChatLink) {
                deleteChatLink.addEventListener('click', function(event) {
                    event.preventDefault(); // Предотвращаем переход по ссылке

                    // Удаляем чат
                    deleteChat();

                    // Закрываем выпадающее меню
                    dropdown.classList.remove('show');
                });
            }
    }

    // Функция для отображения информации о чате
    function displayChatInfo() {
        let chatInfo = "";

        //  В зависимости от текущего chatID, отображаем разную информацию
        if (currentChatId === 1) {
            chatInfo = "<p><strong>Название:</strong> Чат 1</p><p><strong>Тип:</strong> Личный чат</p><p><strong>Участники:</strong> Тёма Клочков, Пользователь 1</p>";
        } else if (currentChatId === 2) {
            chatInfo = "<p><strong>Название:</strong> Чат 2</p><p><strong>Тип:</strong> Личный чат</p><p><strong>Участники:</strong> Тёма Клочков, Пользователь 2</p>";
        } else if (currentChatId === 3) {
            chatInfo = "<p><strong>Название:</strong> Чат 3</p><p><strong>Тип:</strong> Личный чат</p><p><strong>Участники:</strong> Тёма Клочков, Пользователь 3</p>";
        } else { // Для динамически созданных чатов
            const chatName = document.querySelector(`#chatList li[data-chat-id="${currentChatId}"]`).textContent; // Получаем имя чата

            chatInfo = `<p><strong>Название:</strong> ${chatName}</p><p><strong>Тип:</strong> Групповой чат</p><p><strong>Участники:</strong> Тёма Клочков (Вы)</p>`;  // Базовая информация
        }

        chatInfoContent.innerHTML = chatInfo;
    }

    function deleteChat() {
            // Получаем элемент чата из списка
            const chatItem = document.querySelector(`#chatList li[data-chat-id="${currentChatId}"]`);

            if (chatItem) {
                // Удаляем элемент из списка
                chatItem.remove();

                // Удаляем сообщения из объекта chatMessages
                delete chatMessages[currentChatId];

                // Если есть другие чаты, делаем активным первый из них
                const chatListItems = document.querySelectorAll('#chatList li');
                if (chatListItems.length > 0) {
                    currentChatId = parseInt(chatListItems[0].dataset.chatId); // Получаем ID первого чата

                    chatListItems[0].classList.add('active');  // Делаем первый чат активным
                    chatNameElement.textContent = chatListItems[0].textContent; // Обновляем имя текущего чата
                }
                else {
                    // Если чатов больше нет
                    currentChatId = null;  // Сбрасываем currentChatId
                    chatNameElement.textContent = "";  // Очищаем заголовок чата
                }
                // Отображаем сообщения для нового активного чата
                displayMessages();
            }
        }

    // Добавим закрытие модальных окон по клику на крестик
        closeModalButtons.forEach(function(button) {
            button.addEventListener('click', function() {
                const modal = button.closest('.modal');
                if (modal) {
                    modal.style.display = "none";
                }
            });
        });

        // Добавим закрытие по клику вне окна
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