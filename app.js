// Инициализация Telegram Web App
let tg = window.Telegram.WebApp;

// Раскрываем приложение на полный экран
tg.expand();

// Применяем тему Telegram
if (tg.colorScheme === 'dark') {
    document.body.classList.add('telegram-theme-dark');
}

// Устанавливаем цвет заголовка
tg.setHeaderColor('#4A90A4');

// Функция для открытия бесплатного эфира
function openWebinar() {
    // Haptic feedback
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
    
    // Открываем ссылку на вебинар
    tg.openLink('https://meleshkod.ru/webinar-2');
}

// Функция для открытия курса "Циклы Силы"
function openCourse() {
    // Haptic feedback
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
    
    // Открываем ссылку на курс
    tg.openLink('https://meleshkod.ru/ciklsily');
}

// Функция для открытия основного сайта
function openWebsite() {
    // Haptic feedback
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
    
    // Открываем главную страницу сайта
    tg.openLink('http://meleshkod.ru');
}

// Уведомляем Telegram, что приложение готово
tg.ready();

// Логируем информацию о пользователе (для отладки)
console.log('Telegram User Info:', {
    id: tg.initDataUnsafe.user?.id,
    first_name: tg.initDataUnsafe.user?.first_name,
    last_name: tg.initDataUnsafe.user?.last_name,
    username: tg.initDataUnsafe.user?.username,
    language_code: tg.initDataUnsafe.user?.language_code
});

// Обработка события закрытия приложения
tg.onEvent('backButtonClicked', function() {
    tg.close();
});