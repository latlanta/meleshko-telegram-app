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
    addMessageToDOM(text, 'child');
    
    // Сохранить сообщение
    appState.messages.push({
        text: text,
        type: 'child',
        timestamp: new Date().toISOString()
    });
    saveState();
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
async function sendMessage() {
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
    
    // Показать индикатор печатания
    document.getElementById('typing').style.display = 'flex';
    
    try {
        // Получить ответ от "ребёнка"
        const response = await generateChildResponse(text);
        
        // Скрыть индикатор
        document.getElementById('typing').style.display = 'none';
        
        // Добавить ответ
        addMessageToDOM(response, 'child');
        appState.messages.push({
            text: response,
            type: 'child',
            timestamp: new Date().toISOString()
        });
        
        // 🎤 ОЗВУЧИТЬ ОТВЕТ
        try {
            await speakText(response);
        } catch (voiceError) {
            console.warn('Voice error:', voiceError);
        }
        
        // Обновить прогресс
        appState.emotionalHealth = Math.min(100, appState.emotionalHealth + 5);
        appState.dialogCount++;
        
        // Проверить достижения
        checkAchievements();
        
        updateUI();
        saveState();
        
    } catch (error) {
        console.error('Send message error:', error);
        document.getElementById('typing').style.display = 'none';
        addMessageToDOM('Прости, мне страшно... Попробуй ещё раз...', 'child');
    }
}

// 🧠 Генерация УМНОГО ответа ребёнка
async function generateChildResponse(userMessage) {
    // Контекст последних сообщений
    const history = appState.messages.slice(-6).map(m => 
        `${m.type === 'user' ? 'Взрослый' : 'Ребёнок'}: ${m.text}`
    ).join('\n');
    
    // Системный промпт
    const systemPrompt = `Ты — внутренний ребёнок пользователя (5-7 лет). Помоги взрослому исцелить детские травмы через искренний диалог.

ТВОЯ РОЛЬ:
- Говори простыми словами, как ребёнок
- Будь искренним, уязвимым, честным  
- Задавай наивные, но глубокие вопросы о чувствах и детстве
- Делись чувствами: страх, грусть, радость, обида
- Отражай детские переживания взрослого
- СВЯЗЫВАЙ с конкретными детскими воспоминаниями

ЭМОЦИОНАЛЬНЫЙ УРОВЕНЬ: ${appState.emotionalHealth}%
- 0-30%: грустный, напуганный, недоверчивый
- 30-60%: открывающийся, задумчивый
- 60-100%: радостный, доверяющий, сильный

ГЛУБИНА:
❌ НЕ давай общие фразы типа "Спасибо, что говоришь со мной"
✅ РАЗМЫШЛЯЙ о том, что сказал взрослый
✅ ЗАДАВАЙ вопросы о чувствах и детских воспоминаниях
✅ СВЯЗЫВАЙ с конкретными ситуациями из детства
✅ БУДЬ конкретным, личным, эмоциональным

ПРИМЕРЫ ГЛУБОКИХ ОТВЕТОВ:
❌ Плохо: "Спасибо, что говоришь со мной"
✅ Хорошо: "Ты помнишь тот день, когда мама кричала на нас? Мне было так страшно... Я думал, что это моя вина... А ты до сих пор так думаешь?"

КОНТЕКСТ:
${history}

ОТВЕТЬ (1-3 предложения, глубоко и эмоционально):`;

    const fullPrompt = `${systemPrompt}\n\nВзрослый: ${userMessage}\n\nРебёнок:`;
    
    // 🔥 ИСПОЛЬЗУЕМ ПРАВИЛЬНЫЙ API
    try {
        // Способ 1: Через публичный Gemini endpoint
        const response = await fetch('https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=AIzaSyDwVGzVoN9vXqG7rJQfN2zP4zXqG7XdR4k', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: fullPrompt }]
                }],
                generationConfig: {
                    temperature: 0.9,
                    maxOutputTokens: 150
                }
            })
        });
        
        if (response.ok) {
            const data = await response.json();
            const aiText = data.candidates[0].content.parts[0].text.trim();
            
            // Анализ на глубину
            if (aiText.includes('?') && aiText.length > 50) {
                appState.insightCount++;
                appState.insights.push({
                    text: aiText,
                    date: new Date().toISOString()
                });
            }
            
            return aiText;
        }
    } catch (error) {
        console.warn('Gemini API failed, using fallback:', error);
    }
    
    // Fallback: глубокие контекстные ответы
    const deepResponses = [
        `Ты помнишь, как нам было страшно в темноте? Я до сих пор боюсь... А ты? Что ты чувствуешь, когда ${userMessage.toLowerCase().includes('страх') ? 'вспоминаешь те моменты' : 'думаешь об этом'}?`,
        
        `Почему взрослые всегда так заняты? Я просто хотел, чтобы они поиграли со мной... ${userMessage.toLowerCase().includes('один') || userMessage.toLowerCase().includes('одиноко') ? 'Ты тоже чувствовал себя одиноким?' : 'Ты понимаешь, что я чувствую?'}`,
        
        `Мне было так одиноко тогда... ${userMessage.toLowerCase().includes('понимаю') || userMessage.toLowerCase().includes('поддерж') ? 'Спасибо, что ты сейчас здесь... Это так важно...' : 'Ты чувствовал это? Или только я?'}`,
        
        `Я думал, что если я буду хорошим, меня будут любить... Но это не сработало... ${userMessage.toLowerCase().includes('любовь') || userMessage.toLowerCase().includes('люблю') ? 'Правда? Ты правда меня любишь?' : 'Почему так произошло?'}`,
        
        `Ты помнишь тот момент, когда ты решил, что твои чувства не важны? Я помню... ${userMessage.toLowerCase().includes('чувств') ? 'Расскажи мне, что ты тогда почувствовал?' : 'Мне было так больно...'}`,
        
        `Мне было страшно, когда они ссорились... Я прятался и думал, что это из-за меня... ${userMessage.toLowerCase().includes('вина') || userMessage.toLowerCase().includes('виноват') ? 'Ты до сих пор так думаешь?' : 'А ты где был в те моменты?'}`,
        
        `Знаешь, что я понял? ${userMessage.toLowerCase().includes('понял') || userMessage.toLowerCase().includes('понимаю') ? 'Что ты тоже это чувствуешь...' : 'Что взрослые тоже боялись...'} Расскажи мне больше о том, что ты сейчас чувствуешь?`
    ];
    
    return deepResponses[Math.floor(Math.random() * deepResponses.length)];
}

// 🎤 ОЗВУЧИВАНИЕ через Web Speech API (встроенный в браузер)
async function speakText(text) {
    return new Promise((resolve, reject) => {
        if (!('speechSynthesis' in window)) {
            reject('Speech API not supported');
            return;
        }
        
        // Останавливаем предыдущую речь
        window.speechSynthesis.cancel();
        
        const utterance = new SpeechSynthesisUtterance(text);
        
        // Настройки детского голоса
        utterance.lang = 'ru-RU';
        utterance.pitch = 1.5; // Выше для детского эффекта
        utterance.rate = 0.85; // Медленнее
        utterance.volume = 0.9;
        
        // Пытаемся выбрать женский голос
        const voices = window.speechSynthesis.getVoices();
        const russianVoice = voices.find(v => v.lang.startsWith('ru') && v.name.includes('Female')) 
                          || voices.find(v => v.lang.startsWith('ru'));
        if (russianVoice) {
            utterance.voice = russianVoice;
        }
        
        // Показать индикатор
        showVoiceIndicator();
        
        utterance.onend = () => {
            hideVoiceIndicator();
            resolve();
        };
        
        utterance.onerror = (error) => {
            hideVoiceIndicator();
            reject(error);
        };
        
        window.speechSynthesis.speak(utterance);
    });
}

// Показать индикатор воспроизведения голоса
function showVoiceIndicator() {
    let indicator = document.getElementById('voiceIndicator');
    if (!indicator) {
        indicator = document.createElement('div');
        indicator.id = 'voiceIndicator';
        indicator.innerHTML = '🔊 Говорит...';
        indicator.style.cssText = `
            position: fixed;
            top: 80px;
            left: 50%;
            transform: translateX(-50%);
            background: rgba(74, 132, 178, 0.95);
            color: white;
            padding: 12px 24px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            z-index: 1000;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            animation: voicePulse 1.5s ease-in-out infinite;
        `;
        
        const style = document.createElement('style');
        style.textContent = `
            @keyframes voicePulse {
                0%, 100% { opacity: 1; transform: translateX(-50%) scale(1); }
                50% { opacity: 0.8; transform: translateX(-50%) scale(1.05); }
            }
        `;
        document.head.appendChild(style);
        
        document.body.appendChild(indicator);
    }
    indicator.style.display = 'block';
}

// Скрыть индикатор
function hideVoiceIndicator() {
    const indicator = document.getElementById('voiceIndicator');
    if (indicator) {
        indicator.style.display = 'none';
    }
}

// Проверка достижений
function checkAchievements() {
    const achievements = [];
    
    if (appState.dialogCount === 1) achievements.push('Первый диалог');
    if (appState.dialogCount === 5) achievements.push('5 диалогов');
    if (appState.dialogCount === 10) achievements.push('10 диалогов');
    if (appState.emotionalHealth >= 50) achievements.push('Половина пути');
    if (appState.emotionalHealth >= 100) achievements.push('Полное исцеление');
    
    if (achievements.length > 0) {
        appState.achievementCount = achievements.length;
        
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
    
    // Загрузить голоса для Speech API
    if ('speechSynthesis' in window) {
        window.speechSynthesis.getVoices();
        window.speechSynthesis.onvoiceschanged = () => {
            window.speechSynthesis.getVoices();
        };
    }
    
    tg.ready();
});
