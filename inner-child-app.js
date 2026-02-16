// Инициализация Telegram Web App
let tg = window.Telegram.WebApp;
tg.expand();

// Состояние приложения
let appState = {
    emotionalHealth: 30,
    dialogCount: 0,
    insightCount: 0,
    achievementCount: 0,
    currentEmotion: 'neutral',
    messages: [],
    diary: [],
    insights: []
};

// Загрузка состояния из localStorage
function loadState() {
    const saved = localStorage.getItem('innerChildState');
    if (saved) {
        appState = JSON.parse(saved);
        updateUI();
    }
}

// Сохранение состояния
function saveState() {
    localStorage.setItem('innerChildState', JSON.stringify(appState));
}

// Обновление UI
function updateUI() {
    document.getElementById('progressPercent').textContent = appState.emotionalHealth + '%';
    document.getElementById('progressFill').style.width = appState.emotionalHealth + '%';
    document.getElementById('dialogCount').textContent = appState.dialogCount;
    document.getElementById('insightCount').textContent = appState.insightCount;
    document.getElementById('achievementCount').textContent = appState.achievementCount;
    
    updateChildEmotion();
}

// Обновление эмоции ребёнка
function updateChildEmotion() {
    const img = document.getElementById('childImage');
    const status = document.getElementById('childStatus');
    
    if (appState.emotionalHealth < 40) {
        img.src = 'https://www.genspark.ai/api/files/s/fVBtz8Ft';
        status.textContent = 'Спокойный';
        appState.currentEmotion = 'neutral';
    } else if (appState.emotionalHealth < 70) {
        img.src = 'https://www.genspark.ai/api/files/s/rlKoaXHA';
        status.textContent = 'Задумчивый';
        appState.currentEmotion = 'thoughtful';
    } else {
        img.src = 'https://www.genspark.ai/api/files/s/4Dx8lDIg';
        status.textContent = 'Счастливый';
        appState.currentEmotion = 'happy';
    }
}

// Навигация между экранами
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(screenId).classList.add('active');
}

function showMainScreen() {
    showScreen('mainScreen');
}

function showDialogueScreen() {
    showScreen('dialogueScreen');
}

function goBack() {
    // Вернуться в главное приложение
    window.location.href = 'index.html';
}

// Начало диалога
function startDialogue() {
    showDialogueScreen();
    
    // Если это первый диалог
    if (appState.messages.length === 0) {
        setTimeout(() => {
            addChildMessage(getFirstMessage());
        }, 500);
    } else {
        // Отобразить предыдущие сообщения
        const messagesContainer = document.getElementById('messages');
        messagesContainer.innerHTML = '';
        appState.messages.forEach(msg => {
            addMessageToDOM(msg.text, msg.type);
        });
    }
}

// Первое сообщение от ребёнка
function getFirstMessage() {
    const messages = [
        "Привет... Ты помнишь меня? Я тот маленький ребёнок, которым ты был когда-то...",
        "Мне иногда бывает одиноко и страшно... Ты можешь поговорить со мной?",
        "Я так рад, что ты пришёл... Я так долго ждал, когда ты обратишь на меня внимание..."
    ];
    return messages[Math.floor(Math.random() * messages.length)];
}

// Добавление сообщения
function addChildMessage(text) {
    // Показать индикатор печатания
    document.getElementById('typing').style.display = 'flex';
    
    setTimeout(() => {
        document.getElementById('typing').style.display = 'none';
        addMessageToDOM(text, 'child');
        
        // Сохранить сообщение
        appState.messages.push({
            text: text,
            type: 'child',
            timestamp: new Date().toISOString()
        });
        saveState();
    }, 1500);
}

function addMessageToDOM(text, type) {
    const messagesContainer = document.getElementById('messages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = text;
    messagesContainer.appendChild(messageDiv);
    
    // Скролл вниз
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

// Отправка сообщения
function sendMessage() {
    const input = document.getElementById('userInput');
    const text = input.value.trim();
    
    if (!text) return;
    
    // Добавить сообщение пользователя
    addMessageToDOM(text, 'user');
    appState.messages.push({
        text: text,
        type: 'user',
        timestamp: new Date().toISOString()
    });
    
    input.value = '';
    
    // Вибрация
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
    
    // Получить ответ от "ребёнка"
    setTimeout(() => {
        const response = generateChildResponse(text);
        addChildMessage(response);
        
        // Обновить прогресс
        appState.emotionalHealth = Math.min(100, appState.emotionalHealth + 5);
        appState.dialogCount++;
        
        // Проверить достижения
        checkAchievements();
        
        updateUI();
        saveState();
    }, 1000);
}

// Генерация ответа ребёнка (упрощённая версия без API)
function generateChildResponse(userMessage) {
    const responses = {
        'привет': [
            "Привет... Я рад, что ты со мной разговариваешь...",
            "Здравствуй... Мне так не хватало этого..."
        ],
        'как': [
            "Мне бывает страшно... Но когда ты здесь, мне легче...",
            "Иногда мне грустно... Но я стараюсь быть сильным..."
        ],
        'почему': [
            "Я не знаю... Мне просто хотелось, чтобы меня любили...",
            "Я думаю... Я просто хотел быть важным для них..."
        ],
        'люблю': [
            "Правда? Мне так нужно это слышать... Спасибо...",
            "Это так важно для меня... Я тоже тебя люблю..."
        ],
        'прости': [
            "Ты не виноват... Я просто хочу, чтобы ты меня понимал...",
            "Всё хорошо... Главное, что ты сейчас здесь со мной..."
        ],
        'default': [
            "Спасибо, что говоришь со мной... Мне нужно это...",
            "Я рад, что ты здесь... Продолжай, пожалуйста...",
            "Мне важно знать, что ты слышишь меня...",
            "Я чувствую, что ты меня понимаешь... Это так ценно..."
        ]
    };
    
    // Поиск ключевого слова
    const lowerMessage = userMessage.toLowerCase();
    for (let key in responses) {
        if (lowerMessage.includes(key)) {
            const options = responses[key];
            return options[Math.floor(Math.random() * options.length)];
        }
    }
    
    // Дефолтный ответ
    const defaultOptions = responses.default;
    return defaultOptions[Math.floor(Math.random() * defaultOptions.length)];
}

// Проверка достижений
function checkAchievements() {
    const achievements = [];
    
    if (appState.dialogCount === 1) {
        achievements.push('Первый диалог');
    }
    if (appState.dialogCount === 5) {
        achievements.push('5 диалогов');
    }
    if (appState.dialogCount === 10) {
        achievements.push('10 диалогов');
    }
    if (appState.emotionalHealth >= 50) {
        achievements.push('Половина пути');
    }
    if (appState.emotionalHealth >= 100) {
        achievements.push('Полное исцеление');
    }
    
    if (achievements.length > 0) {
        appState.achievementCount = achievements.length;
        
        // Показать достижение
        achievements.forEach(ach => {
            if (tg.showPopup) {
                tg.showPopup({
                    title: '🏆 Достижение!',
                    message: ach,
                    buttons: [{type: 'ok'}]
                });
            }
        });
    }
}

// Enter для отправки
function handleKeyPress(event) {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        sendMessage();
    }
}

// Дневник
function showDiary() {
    showScreen('diaryScreen');
    const diaryList = document.getElementById('diaryList');
    
    if (appState.diary.length === 0) {
        diaryList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">📖</div>
                <div class="empty-text">Ещё нет записей в дневнике<br>Начните диалог, чтобы создать первую запись</div>
            </div>
        `;
    } else {
        diaryList.innerHTML = appState.diary.map(entry => `
            <div class="diary-entry">
                <div class="diary-date">${new Date(entry.date).toLocaleDateString('ru-RU')}</div>
                <div class="diary-preview">${entry.preview}</div>
            </div>
        `).join('');
    }
}

// Инсайты
function showInsights() {
    showScreen('insightsScreen');
    const insightsList = document.getElementById('insightsList');
    
    if (appState.insights.length === 0) {
        insightsList.innerHTML = `
            <div class="empty-state">
                <div class="empty-icon">💡</div>
                <div class="empty-text">Пока нет инсайтов<br>Продолжайте диалоги для получения новых озарений</div>
            </div>
        `;
    } else {
        insightsList.innerHTML = appState.insights.map(insight => `
            <div class="insight-card">
                <div class="insight-date">${new Date(insight.date).toLocaleDateString('ru-RU')}</div>
                <div class="insight-text">${insight.text}</div>
            </div>
        `).join('');
    }
}

// Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    tg.ready();
});