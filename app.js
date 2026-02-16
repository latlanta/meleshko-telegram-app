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

// ========== ПЛАТНЫЕ ПРОГРАММЫ ==========

// Циклы Силы
function openCourse() {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
    tg.openLink('https://meleshkod.ru/ciklsily');
}

// Программа для ВДА (взрослые дети алкоголиков)
function openVDA() {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
    tg.openLink('https://meleshkod.ru/growing-ground');
}

// Мастер личных границ
function openBoundaries() {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
    tg.openLink('https://meleshkod.ru/kurs/mastergranic');
}

// Сепарация. Путь к личной свободе
function openSeparation() {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
    tg.openLink('https://meleshkod.ru/separacia');
}

// Самооценка. Я окей - Ты окей
function openSelfEsteem() {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
    tg.openLink('https://meleshkod.ru/samoocenka');
}

// ========== БЕСПЛАТНЫЕ ЭФИРЫ ==========

// Выход из модели созависимых отношений
function openWebinar() {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
    tg.openLink('https://meleshkod.ru/webinar-2');
}

// Эффективные инструменты самотерапии
function openSelfTherapy() {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
    tg.openLink('https://meleshkod.ru/web2');
}

// ========== ПОДКАСТЫ ==========

// Подкасты в Telegram
function openPodcastTelegram() {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
    tg.openLink('https://t.me/mavestreambot/app?startapp=meleshko');
}

// Подкасты на Яндекс.Музыке
function openPodcastYandex() {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
    tg.openLink('https://music.yandex.ru/album/22198698');
}

// Подкасты в Apple Podcasts
function openPodcastApple() {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
    tg.openLink('https://podcasts.apple.com/ru/podcast/психология-подкасты-психотерапия-дмитрий-мелешко/id1616817624');
}

// ========== СЛУЖБА ЗАБОТЫ ==========

// Написать в Telegram
function openSupport() {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
    tg.openTelegramLink('https://t.me/MeleshkoDmitrii');
}

// ========== КОНСУЛЬТАЦИЯ ПСИХОЛОГА ==========

function openConsultation() {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('medium');
    }
    tg.openLink('https://meleshkod.ru/consultations');
}

// ========== СОЦИАЛЬНЫЕ СЕТИ ==========

// YouTube канал
function openYouTube() {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
    tg.openLink('https://www.youtube.com/channel/UCODeAI8gjTn28c72n5-MfvQ');
}

// Группа ВКонтакте
function openVK() {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
    tg.openLink('https://vk.com/meleshkod');
}

// VK Видео
function openVKVideo() {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
    tg.openLink('https://vkvideo.ru/@meleshkod');
}

// Дзен
function openDzen() {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
    tg.openLink('https://dzen.ru/meleshkod');
}

// Rutube
function openRutube() {
    if (tg.HapticFeedback) {
        tg.HapticFeedback.impactOccurred('light');
    }
    tg.openLink('https://rutube.ru/channel/28536025/');
}

// ========== СИСТЕМНЫЕ ФУНКЦИИ ==========

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
