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
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
    tg.openLink('https://meleshkod.ru/webinar-2');
}

// Функция для открытия курса "Циклы Силы"
function openCourse() {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
    tg.openLink('https://meleshkod.ru/ciklsily');
}

// Функция для открытия подкастов в Telegram
function openPodcastTelegram() {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
    tg.openLink('https://t.me/mavestreambot/app?startapp=meleshko');
}

// Функция для открытия подкастов на Яндекс.Музыке
function openPodcastYandex() {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
    tg.openLink('https://music.yandex.ru/album/22198698');
}

// Функция для открытия подкастов в Apple Podcasts
function openPodcastApple() {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
    tg.openLink('https://podcasts.apple.com/ru/podcast/психология-подкасты-психотерапия-дмитрий-мелешко/id1616817624');
}

// Функция для открытия службы заботы
function openSupport() {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
    tg.openTelegramLink('https://t.me/MeleshkoDmitrii');
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
