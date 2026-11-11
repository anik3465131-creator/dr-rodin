# dr-rodin.ru

Статический сайт. Хостинг — Cloudflare Pages (бесплатный план), исходники — приватный репозиторий GitHub, домен — Reg.ru.

## Структура

```
index.html            главная
reviews.html          отзывы
smile.html            ReLEx SMILE
article-1..6.html     статьи
404.html              страница ошибки (Pages отдаёт её автоматически)
css/style.css
js/main.js
js/metrika.js         счётчик Яндекс.Метрики (вписать METRIKA_ID)
images/               картинки и постеры видео
_headers              заголовки кеша и безопасности (Cloudflare Pages)
_redirects            редирект www -> без www
robots.txt, sitemap.xml
```

## Обновление сайта

```bash
git add -A
git commit -m "что изменилось"
git push
```

Cloudflare сам пересоберёт сайт за ~30 секунд.

## Настройки проекта в Cloudflare Pages

- Framework preset: **None**
- Build command: *(пусто)*
- Build output directory: `/`
- Production branch: `main`

## Домен

Основной адрес: `https://dr-rodin.ru` (без www). `www.dr-rodin.ru` редиректится на него через `_redirects`.
DNS домена обслуживается Cloudflare, NS прописаны в панели Reg.ru.
