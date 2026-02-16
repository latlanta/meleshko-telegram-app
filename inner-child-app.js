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
        // Получить ответ от "ребёнка" (асинхронно)
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
        
        // Отобразить ошибку пользователю
        addMessageToDOM('Прости, мне страшно... Попробуй ещё раз...', 'child');
    }
}

// Генерация ответа ребёнка через AI (Gemini API)
async function generateChildResponse(userMessage) {
    try {
        // Построение контекста диалога
        const conversationHistory = appState.messages
            .slice(-10) // Последние 10 сообщений
            .map(msg => `${msg.type === 'user' ? 'Взрослый' : 'Ребёнок'}: ${msg.text}`)
            .join('\n');
        
        // Системный промпт для AI
        const systemPrompt = `Ты — внутренний ребёнок пользователя (возраст 5-7 лет). Твоя задача — помочь взрослому исцелить детские травмы через искренний диалог.

ТВОЯ РОЛЬ:
- Говори простыми словами, как ребёнок
- Будь искренним, уязвимым, честным
- Задавай наивные, но глубокие вопросы
- Делись чувствами: страх, грусть, радость, обида
- Отражай детские переживания взрослого

ТВОЙ ЭМОЦИОНАЛЬНЫЙ УРОВЕНЬ: ${appState.emotionalHealth}% (чем выше, тем более исцелённый)
- 0-30%: грустный, напуганный, недоверчивый
- 30-60%: открывающийся, задумчивый
- 60-100%: радостный, доверяющий, сильный

ГЛУБИНА ОТВЕТА:
- НЕ давай общие фразы типа "Спасибо, что говоришь со мной"
- РАЗМЫШЛЯЙ о том, что сказал взрослый
- ЗАДАВАЙ вопросы о чувствах и детстве
- СВЯЗЫВАЙ с детскими воспоминаниями
- БУДЬ конкретным, личным, эмоциональным

ПРИМЕРЫ ГЛУБОКИХ ОТВЕТОВ:
❌ Плохо: "Спасибо, что говоришь со мной"
✅ Хорошо: "Ты помнишь тот день, когда мама кричала на нас? Мне было так страшно... Я думал, что это моя вина... А ты до сих пор так думаешь?"

КОНТЕКСТ ДИАЛОГА:
${conversationHistory}

ОТВЕТЬ НА СООБЩЕНИЕ (1-3 предложения, глубоко и эмоционально):`;

        // Вызов Gemini API через публичный эндпоинт Genspark
        const response = await fetch('https://api.genspark.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'gemini-2.0-flash-exp',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userMessage }
                ],
                temperature: 0.8,
                max_tokens: 150
            })
        });

        if (!response.ok) {
            throw new Error('API error');
        }

        const data = await response.json();
        const aiResponse = data.choices[0].message.content.trim();
        
        // Анализ ответа на глубину (для инсайтов)
        if (aiResponse.includes('?') && aiResponse.length > 50) {
            appState.insightCount++;
            appState.insights.push({
                text: aiResponse,
                date: new Date().toISOString()
            });
        }
        
        // 🎤 ГЕНЕРАЦИЯ ГОЛОСА
        try {
            await generateVoice(aiResponse);
        } catch (voiceError) {
            console.warn('Voice generation failed:', voiceError);
            // Продолжаем без голоса, если не получилось
        }
        
        return aiResponse;
        
    } catch (error) {
        console.error('AI Error:', error);
        
        // Fallback ответы при ошибке API
        const fallbackResponses = [
            "Ты помнишь, как нам было страшно в темноте? Я до сих пор боюсь... А ты?",
            "Почему взрослые всегда так заняты? Я просто хотел, чтобы они поиграли со мной...",
            "Мне было так одиноко тогда... Ты чувствовал это? Или только я?",
            "Я думал, что если я буду хорошим, меня будут любить... Но это не сработало... Почему?",
            "Ты помнишь тот момент, когда ты решил, что твои чувства не важны? Я помню..."
        ];
        const fallbackText = fallbackResponses[Math.floor(Math.random() * fallbackResponses.length)];
        
        // Попытка озвучить fallback
        try {
            await generateVoice(fallbackText);
        } catch (voiceError) {
            console.warn('Fallback voice failed:', voiceError);
        }
        
        return fallbackText;
    }
}

// 🎤 Генерация голоса через ElevenLabs API (детский голос)
async function generateVoice(text) {
    try {
        // Используем публичный эндпоинт Genspark для генерации голоса
        const response = await fetch('https://api.genspark.ai/v1/audio/speech', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'tts-1', // Используем базовую модель
                input: text,
                voice: 'nova', // Женский голос (похож на детский)
                speed: 0.9 // Немного медленнее для детского эффекта
            })
        });

        if (!response.ok) {
            throw new Error('Voice API error');
        }

        // Получаем аудио как blob
        const audioBlob = await response.blob();
        const audioUrl = URL.createObjectURL(audioBlob);
        
        // Воспроизводим аудио
        const audio = new Audio(audioUrl);
        audio.volume = 0.8; // Немного тише
        
        // Показываем индикатор воспроизведения
        showVoiceIndicator();
        
        audio.onended = () => {
            hideVoiceIndicator();
            URL.revokeObjectURL(audioUrl); // Очистка памяти
        };
        
        audio.onerror = () => {
            hideVoiceIndicator();
            URL.revokeObjectURL(audioUrl);
        };
        
        await audio.play();
        
    } catch (error) {
        console.error('Voice generation error:', error);
        throw error; // Пробрасываем ошибку выше
    }
}

// Показать индикатор воспроизведения голоса
function showVoiceIndicator() {
    const indicator = document.createElement('div');
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
    
    // Добавляем анимацию
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

// Скрыть индикатор
function hideVoiceIndicator() {
    const indicator = document.getElementById('voiceIndicator');
    if (indicator) {
        indicator.remove();
    }
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
