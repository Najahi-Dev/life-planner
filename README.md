# 🌟 LifePlanner - Production Mobile App

A high-performance, design-first personal life planner mobile application built with **Expo SDK 57**, **React Native**, **TypeScript (strict mode)**, **Expo Router**, and **Firebase**.

---

## 📱 Modules & Complete Feature Capabilities

1. **Plans & Agendas**:
   - Daily, weekly, and monthly planner views.
   - Priority levels (`urgent`, `high`, `medium`, `low`), category tags (`work`, `study`, `uni`, `health`, `personal`, `finance`).
   - Repeat rules (`daily`, `weekly`, `monthly`), date/time pickers, and interactive completion confetti celebrations.
   - TanStack Query caching with optimistic updates and offline fallbacks.

2. **Work Schedule**:
   - Shift tracking with start/end times, hourly rates, location reminders, and earnings estimates.
   - Automated **overlap conflict detection** banner.
   - Weekly scheduled hours & projected earnings cards with calendar and list views.

3. **Learning & Spaced Repetition**:
   - Mastery progress tracking for courses, frameworks, and textbooks.
   - **Automated Spaced Repetition Engine** adhering to the `1 ➔ 3 ➔ 7 ➔ 14 ➔ 30` day memory retention schedule.
   - 7-day study hours distribution chart and study streak counter (`🔥 5 Day Study Streak`).
   - Rich study session logger with 5-star comprehension rating and notes.

4. **University Hub**:
   - Course enrollment (code, credits, semester, target & achieved grades, lecturer).
   - Assignment deadline checklists with interactive step-by-step progress tracking.
   - Exam scheduling with venue, time window, and revision progress sliders (+10% / +25% quick bumps).
   - **Weighted Semester & Cumulative GPA Engine** (4.0 scale) with honors status (`Dean's High Honors / Summa Cum Laude 🏆`).

5. **Events & Activities**:
   - Multi-dot month calendar indicators by event type (`academic`, `work`, `social`, `health`, `personal`, `deadline`).
   - Chronological timeline grouping (`Today`, `Tomorrow`, `This Week`, `Upcoming Later`).
   - Venue, start/end times, and reminder lead time alerts (`5m`, `15m`, `30m`, `1h`, `1d`).

6. **Push Notifications & SMS System**:
   - Native push notifications via `expo-notifications` with Android channel configuration.
   - Automatic FCM device token registration in Firestore at `users/{uid}/devices/{deviceId}`.
   - Local reminder scheduling and immediate test notification trigger.
   - In-app notification inbox with category deep-linking and unread badges.
   - Firebase Cloud Functions cron scheduler reference for automated push & SMS dispatch.

7. **Customizable Themes & Design System**:
   - Real-time Light, Dark, and System color scheme switcher.
   - 5 selectable accent themes: **Indigo**, **Emerald**, **Rose**, **Amber**, and **Sky**.
   - 8pt spacing grid (`4, 8, 12, 16, 24, 32, 48`), radius tokens (`card: 16`, `button: 12`, `input: 12`), and Inter typography scale.
   - UI Component Gallery preview route at `/gallery`.

---

## 🛠️ Tech Stack

- **Framework**: Expo (SDK 57) + React Native 0.86 + React 19
- **Navigation**: Expo Router (File-based navigation under `src/app`)
- **Backend & Auth**: Firebase JS SDK (Authentication, Firestore Offline Persistence, Cloud Messaging)
- **Async Data & Caching**: TanStack Query (`@tanstack/react-query` v5)
- **State Management**: Zustand v5
- **Forms & Validation**: React Hook Form + Zod
- **Animations & Gestures**: `react-native-reanimated`, `react-native-gesture-handler`, `expo-haptics`
- **Bottom Sheets**: `@gorhom/bottom-sheet`
- **Calendars & Charts**: `react-native-calendars`, `react-native-svg`
- **Icons & Typography**: `lucide-react-native`, `@expo-google-fonts/inter`
- **Date Handling**: `date-fns`

---

## 📁 Architecture & Feature Structure

```
mobile-app/
├── assets/                    # App icons, splashes, adaptive icons
├── src/
│   ├── app/                   # Expo Router routes & layout
│   │   ├── (auth)/            # Auth stack (login, register, forgot-password, onboarding)
│   │   ├── (tabs)/            # 5 Core Bottom Tabs:
│   │   │   ├── index.tsx      # Home Dashboard (Streak, Tasks, Next Shift, Deadlines, Chart)
│   │   │   ├── plans.tsx      # Plans & Agendas (Daily, Weekly, Monthly)
│   │   │   ├── schedule.tsx   # Work Shifts & Hours Summary
│   │   │   ├── learn.tsx      # Learning & Spaced Repetition (1-3-7-14-30d)
│   │   │   └── uni.tsx        # University Hub (Courses, Assignments, Exams, GPA)
│   │   ├── events/            # Events & Activities screen (Multi-Dot Calendar & Agenda)
│   │   ├── notifications/     # In-app notifications inbox & test triggers
│   │   ├── settings/          # Theme, notification, and planning preferences
│   │   ├── profile/           # Bio and stats editor
│   │   ├── gallery.tsx        # Interactive UI Component Gallery preview
│   │   └── _layout.tsx        # Root layout with GestureHandler & Modal providers
│   ├── components/
│   │   ├── ui/                # Button, Input, Select, DateTimeField, Card, Chip, Sheet, EmptyState, Skeleton, Header, ProgressRing, ProgressBar, SegmentedControl, ConfettiCelebration
│   │   ├── navigation/        # CustomTabBar with Floating Action Add Button
│   │   └── create/            # QuickCreateSheet (universal creation modal)
│   ├── features/              # Feature modules (components, hooks, services, schemas, types)
│   │   ├── auth/              # Auth schemas, service, session store
│   │   ├── dashboard/         # Greeting header, streak card, tasks list, upcoming cards
│   │   ├── plans/             # Task schemas, service, daily/weekly/monthly views
│   │   ├── schedule/          # Shift schemas, service, calendar/list views, overlap warning
│   │   ├── learning/          # Learning schemas, service, streak header, review section, hours chart
│   │   ├── university/        # Uni schemas, service, course cards, assignment checklist, exam cards, GPA calculator
│   │   ├── events/            # Event schemas, service, month calendar, grouped agenda
│   │   ├── notifications/     # Notification schemas, push service, inbox service
│   │   └── settings/          # Preferences & profile
│   ├── services/
│   │   ├── firebase/          # Firebase config, client auth, firestore offline cache
│   │   └── notifications/     # Local & push notification scheduler, Cloud Functions
│   ├── store/                 # Zustand global stores (themeStore, authStore)
│   ├── theme/                 # Design tokens (tokens, colors, types)
│   └── types/                 # Shared TypeScript interfaces
├── firestore.rules            # Firestore security rules with user-isolated subcollections
├── firestore.indexes.json     # Firestore composite index definitions
├── eas.json                   # EAS Build and Submit configurations
├── app.json                   # Expo application manifest & plugins
├── tsconfig.json              # Strict TypeScript compiler options & aliases
└── .env.example               # Environment variables template
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory:

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Cloud Functions Base URL
EXPO_PUBLIC_FUNCTIONS_BASE_URL=https://us-central1-your_project.cloudfunctions.net

# App Environment
EXPO_PUBLIC_APP_ENV=development
```

---

## 🚀 Development & Commands

```bash
# Start local Metro dev server
npx expo start

# Run TypeScript strict typecheck
npm run typecheck

# Run Expo Doctor diagnostic
npx expo-doctor

# Linting & Code formatting
npm run lint
npm run format
```

---

## 📦 Building with EAS (Expo Application Services)

### 1. Install EAS CLI
```bash
npm install -g eas-cli
```

### 2. Build for Android & iOS

- **Development Build (Internal Testing)**:
  ```bash
  npx eas-cli@latest build --profile development --platform all
  ```

- **Preview APK / iOS Simulator**:
  ```bash
  npx eas-cli@latest build --profile preview --platform all
  ```

- **Production App Store / Google Play**:
  ```bash
  npx eas-cli@latest build --profile production --platform all
  ```

- **Submit to Stores**:
  ```bash
  npx eas-cli@latest submit --platform all
  ```

---

## 🗺️ Project Phases Summary

- [x] **Phase 1**: Scaffolding, TypeScript strict config, EAS setup, Firestore rules & indexes.
- [x] **Phase 2**: 8pt design token system, light/dark/system themes, 5 accent palettes, all shared UI components, interactive UI Gallery preview.
- [x] **Phase 3**: Firebase Authentication, onboarding walkthrough (3 animated slides), sign in/up, 1-tap instant demo mode.
- [x] **Phase 4**: Expo Router navigation shell, custom tab bar with centered FAB, quick-create bottom sheet, Home dashboard.
- [x] **Phase 5**: Plans module with daily/weekly/monthly views, priority & category filters, confetti celebrations.
- [x] **Phase 6**: Work schedule module with shift calendar/list views, overlap warning banner, weekly hours & earnings tracker.
- [x] **Phase 7**: Learning module with automated 1-3-7-14-30 day spaced repetition, study streak counter, 7-day hours distribution chart, and 5-star session logger.
- [x] **Phase 8**: University module with courses, assignment milestone checklists, exam countdowns, and weighted 4.0 GPA calculator with honors status.
- [x] **Phase 9**: Events module with multi-dot month calendar, timeline agenda grouping, and venue reminders.
- [x] **Phase 10**: Push notifications via `expo-notifications`, device registration, local reminder scheduling, in-app inbox, and Cloud Functions cron dispatcher.
- [x] **Phase 11**: Animation & polish pass, 60fps transitions, haptic feedback, accessibility, and settings preferences.
- [x] **Phase 12**: Final release preparation, EAS build profiles, production readiness audit, and documentation.
