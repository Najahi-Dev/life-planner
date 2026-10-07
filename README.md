# 🌟 LifePlanner - Production Mobile App

A high-performance, design-first personal life planner mobile application built with **Expo SDK 57**, **React Native**, **TypeScript (strict mode)**, **Expo Router**, and **Firebase**.

---

## 📱 Modules & Features

1. **Plans**: Daily, weekly, and monthly planner with task priority, category tags, drag-to-reorder, repeat rules, and swipe actions.
2. **Work Schedule**: Shift tracking, conflict detection, weekly hours calculation, earnings estimates, and location reminders.
3. **Learning & Spaced Repetition**: Course topic tracking, study session timer, streak counter, spaced repetition intervals (1, 3, 7, 14, 30 days), and weekly hours charts.
4. **University Hub**: Courses, credit tracking, assignment deadline checklists, weighted GPA summary, and countdowns to upcoming exams.
5. **Events & Activities**: Month calendar with multi-dot indicators, event types, map locations, and reminder alerts.
6. **Notifications & Cloud Functions**: Local push notifications via `expo-notifications`, FCM device token registration, and SMS dispatch via Firebase Cloud Functions + Twilio.
7. **Customizable Themes**: Light, Dark, System modes + 5 vibrant accent colors (`indigo`, `emerald`, `rose`, `amber`, `sky`).

---

## 🛠️ Tech Stack

- **Framework**: Expo (SDK 57) + React Native 0.86 + React 19
- **Navigation**: Expo Router (File-based navigation under `src/app`)
- **Backend & Auth**: Firebase JS SDK (Authentication, Firestore Offline Persistence, Cloud Messaging)
- **Async Data & Caching**: TanStack Query (`@tanstack/react-query` v5)
- **UI & State**: Zustand v5
- **Forms & Validation**: React Hook Form + Zod
- **Animations**: `react-native-reanimated`, `react-native-gesture-handler`, `lottie-react-native`, `expo-haptics`
- **High-Performance Lists**: `@shopify/flash-list`
- **Bottom Sheets**: `@gorhom/bottom-sheet`
- **Calendar & Charts**: `react-native-calendars`, `react-native-gifted-charts`, `react-native-svg`
- **Icons & Typography**: `lucide-react-native`, `@expo-google-fonts/inter`
- **Date Handling**: `date-fns`

---

## 📁 Feature-Based Folder Structure

```
mobile-app/
├── assets/                    # App icons, splashes, adaptive icons
├── src/
│   ├── app/                   # Expo Router routes & layout
│   │   ├── (auth)/            # Auth stack (login, register, forgot-password)
│   │   ├── (tabs)/            # Main bottom tabs (Home, Plans, Schedule, Learn, Uni)
│   │   ├── (modals)/          # Fullscreen modals and sheets
│   │   ├── _layout.tsx        # Root layout with providers & font loader
│   │   └── index.tsx          # Initial routing handler
│   ├── components/
│   │   └── ui/                # Reusable design system components
│   │       ├── Button.tsx
│   │       ├── Input.tsx
│   │       ├── Select.tsx
│   │       ├── DateTimeField.tsx
│   │       ├── Card.tsx
│   │       ├── Chip.tsx
│   │       ├── Sheet.tsx
│   │       ├── EmptyState.tsx
│   │       ├── Skeleton.tsx
│   │       ├── Header.tsx
│   │       └── ProgressRing.tsx
│   ├── features/              # Feature modules
│   │   ├── auth/              # {components, hooks, services, schemas, types}
│   │   ├── dashboard/         # {components, hooks, services, schemas, types}
│   │   ├── plans/             # {components, hooks, services, schemas, types}
│   │   ├── schedule/          # {components, hooks, services, schemas, types}
│   │   ├── learning/          # {components, hooks, services, schemas, types}
│   │   ├── university/        # {components, hooks, services, schemas, types}
│   │   ├── events/            # {components, hooks, services, schemas, types}
│   │   ├── notifications/     # {components, hooks, services, schemas, types}
│   │   └── settings/          # {components, hooks, services, schemas, types}
│   ├── hooks/                 # Shared React hooks (offline, haptics, theme)
│   ├── services/              # External services
│   │   ├── firebase/          # Firebase config, client auth, firestore
│   │   └── notifications/     # Local & push notification scheduler
│   ├── store/                 # Zustand global stores (theme, filters, ui)
│   ├── theme/                 # Design tokens (colors, spacing, typography, radius)
│   ├── types/                 # Shared TypeScript interfaces & Firestore schemas
│   └── utils/                 # Date helpers, formatters, calculations
├── firestore.rules            # Firestore security rules
├── firestore.indexes.json     # Firestore composite index definitions
├── eas.json                   # EAS Build and Submit configurations
├── app.json                   # Expo application manifest & plugins
├── tsconfig.json              # Strict TypeScript compiler options & aliases
└── .env.example               # Environment variables template
```

---

## ⚙️ Environment Configuration

Create a `.env` file in the root directory based on `.env.example`:

```env
# Firebase Configuration
EXPO_PUBLIC_FIREBASE_API_KEY=your_api_key
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=your_measurement_id

# Cloud Functions / Twilio
EXPO_PUBLIC_FUNCTIONS_BASE_URL=https://us-central1-your_project.cloudfunctions.net

# App Environment
EXPO_PUBLIC_APP_ENV=development
```

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Dev Server
```bash
npx expo start
```

### 3. Run Typecheck & Linting
```bash
npm run typecheck
npm run lint
```

---

## 📦 EAS Build Profiles

- **Development Build**: `npx eas-cli@latest build --profile development --platform android|ios`
- **Internal Preview**: `npx eas-cli@latest build --profile preview --platform android|ios`
- **Production Store Build**: `npx eas-cli@latest build --profile production --platform android|ios`

---

## 🗺️ Roadmap & Phases

- [x] **Phase 1**: Project scaffold, folder structure, env setup, EAS config, README.
- [ ] **Phase 2**: Design system, theme engine, all shared UI components, and UI Gallery preview.
- [ ] **Phase 3**: Firebase setup, auth screens, onboarding, session handling, security rules.
- [ ] **Phase 4**: Navigation shell, Home dashboard, create bottom sheet.
- [ ] **Phase 5**: Plans module.
- [ ] **Phase 6**: Work schedule module.
- [ ] **Phase 7**: Learning module.
- [ ] **Phase 8**: University module.
- [ ] **Phase 9**: Events module.
- [ ] **Phase 10**: Notifications (local, push, SMS Cloud Functions).
- [ ] **Phase 11**: Animation and polish pass, accessibility, performance check.
- [ ] **Phase 12**: Testing checklist, EAS build for Android and iOS, release notes.
