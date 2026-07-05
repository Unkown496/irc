- Бэкэнд
  - [Запуск](#бэкэнд-деплой)
- Фронтэнд
  - [Запуск](#фронтэнд-деплой)

# Бэкэнд деплой

Для запуска нужно зайти в корень проекта потом перейти в папку server <br/>
Заполнить .env, по .env.example

```
    # Приложу заполненный вариант на всякий случай
    # Server
    SERVER_PORT=3000

    # Cors
    CORS_WHITELIST=http://localhost:3000,http://localhost:3001,http://localhost:5173
    CORS_ALLOWED_HEADERS=Content-Type,Host

    # Database
    DATABASE_URL=postgres://postgres:root@localhost:5432/irc
```

<br/>
Установить зависимости

```
 cd server # Если еще не перешли
 npm i
```

Если произошли ошибки при установке зависимостей удалите `package-lock.json` и попробуйте снова

```
 npm run dev # Запуск в дев режиме
 npm run build
 npm start # Запуск в прод режиме
```

# Фронтэнд деплой

Для запуска нужно зайти в корень проекта потом перейти в папку client <br/>
Заполнить .env, по .env.example

```
    # Приложу заполненный вариант на всякий случай
    # Api
    VITE_API_BASE_URL=http://localhost:3000/api/v1
```

<br/>
Установить зависимости

```
 cd client # Если еще не перешли
 npm i
```

Если произошли ошибки при установке зависимостей удалите `package-lock.json` и попробуйте снова

```
 npm run dev # Для запуска в деве
 npm run build
 npm start # Для запуска в проде
```
