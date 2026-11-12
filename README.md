# dr-rodin.ru

Статический сайт. Хостинг — GitHub Pages (бесплатно), исходники — публичный репозиторий GitHub, домен — Reg.ru.

## Структура

```
index.html            главная
reviews/index.html    отзывы            → /reviews/
smile/index.html      ReLEx SMILE       → /smile/
article-N/index.html  статьи            → /article-N/
404.html              страница ошибки
CNAME                 кастомный домен для GitHub Pages
css/style.css
js/main.js
js/metrika.js         счётчик Яндекс.Метрики (вписать METRIKA_ID)
images/               картинки и постеры видео
robots.txt, sitemap.xml, sitemap-pages.xml, sitemap-images.xml
```

Страницы лежат в папках, чтобы адреса оставались без `.html` (GitHub Pages
не умеет отдавать `/smile` из файла `smile.html`).

## Обновление сайта

```bash
git add -A
git commit -m "что изменилось"
git push
```

GitHub сам пересоберёт сайт за ~30–60 секунд.

## Настройки в GitHub

- Settings → Pages → Source: **Deploy from a branch**, ветка `main`, папка `/ (root)`
- Custom domain: `dr-rodin.ru` (лежит в файле `CNAME`), Enforce HTTPS — включено

## Домен

Основной адрес: `https://dr-rodin.ru` (без www), `www.dr-rodin.ru` — CNAME на
`anik3465131-creator.github.io`.

DNS-серверы домена (прописаны в панели Reg.ru): `ns1.reg.ru`, `ns2.reg.ru`.

Записи в зоне Reg.ru:

| Тип   | Subdomain | Значение                    |
|-------|-----------|-----------------------------|
| A     | @         | 185.199.108.153             |
| A     | @         | 185.199.109.153             |
| A     | @         | 185.199.110.153             |
| A     | @         | 185.199.111.153             |
| CNAME | www       | anik3465131-creator.github.io |

## Файлы Cloudflare Pages (больше не используются)

`_headers` и `_redirects` остались от прежнего хостинга, GitHub Pages их игнорирует.
