# CoreSoft Solutions - B2B SaaS Dashboard

Современный дашборд для управления клиентами, проектами и задачами. Демонстрирует полный стек технологий для B2B SaaS приложений.

## 🚀 Быстрый старт

```bash
# Установка зависимостей
npm install

# Запуск dev-сервера
npm run dev

# Сборка для production
npm run build

# Preview production сборки
npm run preview
```

Приложение будет доступно по адресу: **http://localhost:3000**

## 🔑 Демо доступ

- **Email:** любой (например, `admin@coresoft.com`)
- **Пароль:** любой (минимум 6 символов)

## 📦 Технологический стек

| Категория | Технологии |
|-----------|------------|
| **Framework** | Vue 3.5 + TypeScript |
| **State Management** | Pinia |
| **Routing** | Vue Router 4 с guards |
| **UI Components** | Element Plus |
| **Styling** | Tailwind CSS 3 |
| **HTTP Client** | Axios + interceptors |
| **Forms** | vee-validate + yup |
| **Charts** | ECharts (vue-echarts) |
| **Drag & Drop** | vuedraggable |
| **Utilities** | @vueuse/core |
| **Build** | Vite 8 |

## 📁 Структура проекта

```
src/
├── api/                    # API слой
│   ├── client.ts          # Axios instance с interceptors
│   └── endpoints.ts       # API endpoint функции
├── assets/                # Статические файлы
├── components/
│   ├── layout/            # Layout компоненты
│   │   └── AppLayout.vue  # Основной layout
│   └── common/            # Переиспользуемые компоненты
├── composables/           # Composition API хуки
├── plugins/               # Плагины приложения
│   └── element-plus.ts    # Настройка Element Plus
├── router/                # Vue Router
│   └── index.ts           # Конфигурация роутов + guards
├── stores/                # Pinia stores
│   ├── auth.ts            # Authentication
│   ├── clients.ts         # Clients management
│   ├── projects.ts        # Projects management
│   └── tasks.ts           # Tasks management
├── types/                 # TypeScript типы
│   └── index.ts           # Все интерфейсы
├── utils/                 # Утилиты
│   └── helpers.ts         # Helper функции
├── validators/            # Yup схемы валидации
│   └── forms.ts           # Схемы для форм
├── views/                 # Страницы приложения
│   ├── LoginView.vue      # Страница входа
│   ├── DashboardView.vue  # Главная с графиками
│   ├── ClientsView.vue    # Управление клиентами
│   ├── ProjectsView.vue   # Kanban доска проектов
│   ├── TasksView.vue      # Drag & drop задачи
│   ├── AnalyticsView.vue  # Аналитика и отчеты
│   └── SettingsView.vue   # Настройки профиля
├── App.vue                # Корневой компонент
├── main.ts                # Точка входа
└── style.css              # Глобальные стили
```

## 🎯 Реализованные функции

### ✅ Авторизация
- Страница входа с валидацией
- JWT токены в localStorage
- Axios interceptors для токенов
- Route guards для защищенных страниц
- Автоматический logout при 401

### ✅ Dashboard
- KPI карточки с метриками
- Линейный график доходов (ECharts)
- Pie chart распределения проектов
- Таблица последних активностей
- Quick tasks overview

### ✅ Clients (CRUD)
- Таблица с сортировкой и фильтрацией
- Поиск по имени/email/компании
- Пагинация
- Создание/редактирование/удаление
- Валидация форм (vee-validate + yup)
- Status badges

### ✅ Projects (Kanban)
- Drag & drop между статусами
- 5 колонок: Planning, In Progress, Review, Completed, On Hold
- Карточки проектов с прогрессом
- Table view альтернатива
- Фильтр по статусам
- CRUD операции

### ✅ Tasks
- 3 колонки: To Do, In Progress, Done
- Drag & drop между колонками
- Приоритеты (Low/Medium/High)
- Назначение исполнителей
- Due dates с подсветкой просроченных
- Фильтры по проекту и исполнителю

### ✅ Analytics
- Revenue trend chart
- Client growth bar chart
- Project status pie chart
- Task completion gauge
- Priority distribution
- Monthly performance chart
- Export кнопка (demo)

### ✅ Settings
- Профиль пользователя
- Смена аватара (UI)
- Изменение пароля
- Переключатели уведомлений
- Dark mode toggle
- Выбор языка
- Danger zone (delete account)

## 🎨 Особенности реализации

### Типизация
- Полная TypeScript типизация
- Интерфейсы для всех сущностей
- Generic типы для API ответов
- Strict mode включен

### Валидация
- Двойная валидация (Element Plus + yup)
- Reusable схемы валидации
- Real-time обратная связь
- Кастомные сообщения об ошибках

### State Management
- Модульные Pinia stores
- Actions для async операций
- Mock данные для демонстрации
- Реактивные computed свойства

### UI/UX
- Responsive дизайн
- Collapsible sidebar
- Breadcrumb навигация
- Loading states
- Toast уведомления
- Confirm диалоги
- Transition анимации

## 📊 Mock данные

Приложение использует mock данные для демонстрации:

- **5 клиентов** с разной информацией
- **5 проектов** во всех статусах
- **6 задач** с разными приоритетами
- **Активности** для dashboard

## 🔧 Конфигурация

### Переменные окружения

Создайте файл `.env` на основе `.env.example`:

```env
VITE_API_URL=https://api.coresoft.example.com
```

### Alias

В `vite.config.ts` настроен alias `@` для `src/`:

```typescript
import { something } from '@/utils/helpers'
```

## 📈 Производительность

Размер production сборки:

- **Total:** ~1.7 MB (gzip: ~400 KB)
- **Vue:** 122 KB (gzip: 48 KB)
- **Element Plus:** 369 KB (gzip: 51 KB)
- **ECharts:** 1 MB (gzip: 324 KB)

Рекомендации для production:
- Включить code splitting
- Lazy load для тяжелых компонентов
- Tree shaking для иконок

## 🎯 Демонстрируемые навыки

Этот проект демонстрирует:

1. **Vue 3 Composition API** - script setup, реактивность, lifecycle
2. **TypeScript** - типизация, generics, utility types
3. **State Management** - Pinia stores, actions, getters
4. **Routing** - nested routes, guards, params
5. **Forms** - валидация, обработка ошибок, UX
6. **HTTP** - axios interceptors, error handling
7. **UI/UX** - адаптивность, анимации, accessibility
8. **Charts** - визуализация данных с ECharts
9. **Drag & Drop** - интерактивные канбан доски
10. **Code Organization** - модульная архитектура

## 📝 Лицензия

MIT - свободно для использования в учебных и коммерческих целях.

---

**CoreSoft Solutions** © 2024. Built with Vue 3 + TypeScript + Pinia + Element Plus + Tailwind CSS.
