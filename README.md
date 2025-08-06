# MitraVet: AI-Powered Veterinary Assistant

MitraVet is a comprehensive web application designed to assist rural and semi-urban users in managing their livestock and pets. It leverages AI to provide instant diagnostic support, offers essential care management tools, and connects users with a local marketplace and veterinary services.

The application is built with a mobile-first approach, featuring a clean, accessible interface and multilingual support (English, Hindi, and Assamese) to cater to a diverse user base.

## Core Features

### 1. **AI Doctor**
-   **Image & Symptom Analysis**: Users can upload a photo of their animal and describe its symptoms (either by typing or by voice recording in their selected language).
-   **Instant Diagnosis**: An AI model analyzes the provided information to suggest a potential diagnosis, assess the urgency, and provide immediate care recommendations.
-   **Text-to-Speech**: The diagnosis results can be read aloud to the user, improving accessibility.

### 2. **Voice Assistant**
-   **Conversational AI**: Users can ask questions about animal care in their native language using their voice.
-   **End-to-End Voice Interaction**: The app records the user's voice query, sends the audio directly to an AI for processing, and plays back the generated audio response, creating a seamless conversational experience.

### 3. **Dashboard & Personalization**
-   **Pet Selection**: On first login, users select their primary animal type (e.g., Cattle, Poultry), which customizes the dashboard features.
-   **Feature Grid**: A central dashboard provides easy access to all the app's features.
-   **Language Selection**: Users can switch the app's language between English, Hindi, and Assamese.

### 4. **Care Management Tools**
-   **Feed Advice**: Provides personalized daily feeding plans based on the animal's species, age, and the user's location (to account for weather).
-   **Health Tracker**: Allows users to log and visualize key health metrics like milk yield and weight over time using interactive charts.
-   **Care Reminders**: Helps users schedule and track important events like vaccinations, deworming, pregnancy due dates, and heat cycles. Includes a visual vaccination calendar.

### 5. **Community & Services**
-   **Vet Connect**: An integrated map that helps users find and get directions to nearby veterinary clinics. It also allows users to book appointments (mocked).
-   **Marketplace**: A platform for users to buy and sell animals, feed, medicine, and accessories. Users can post ads, filter listings by category, and search for items.

### 6. **User Profile & Authentication**
-   **Simple Login**: A mock login system to simulate user accounts.
-   **Profile Management**: Users can view their profile and change their primary animal type.

## Technical Stack

-   **Framework**: Next.js (with App Router)
-   **Language**: TypeScript
-   **Styling**: Tailwind CSS
-   **UI Components**: ShadCN/UI
-   **Generative AI**: Google's Gemini models via Genkit
-   **Database**: Mock data stored in-component (simulating Firestore)

---

## Prompt to Recreate This App

```
You are an expert AI application developer. Your task is to build a comprehensive veterinary assistant application named "MitraVet" from scratch.

**App Name**: MitraVet

**Core Idea**: An AI-powered veterinary assistant for rural and semi-urban users. It should help them detect animal diseases early, manage their animals' health, and connect with local services. The app must be user-friendly, support multiple languages, and work well on mobile devices.

**Key Features to Implement**:

1.  **User Authentication & Onboarding**:
    *   Create a simple login page (email/password). For now, this can be a mock login that uses `localStorage`.
    *   After the first login, prompt the user to select their primary animal type (e.g., Cattle, Poultry, Fish, Other Livestock) in a dialog. Store this choice in `localStorage`.

2.  **Main Dashboard**:
    *   This is the home page after login.
    *   It should welcome the user and display their selected animal type.
    *   Create a grid of feature cards that navigate to the different sections of the app.
    *   Include a special "Fish/Poultry Monitor" card that is only available if the user selected 'Fish' or 'Poultry'.

3.  **AI Doctor**:
    *   A page with a form where the user can upload an animal's photo.
    *   Include a textarea for describing symptoms.
    *   Add a microphone button that allows the user to record their symptoms as a voice note instead of typing.
    *   The form submission should send the image and the symptom description (text or audio) to an AI flow.
    *   The AI flow (`processSymptoms`) should analyze the inputs and return a potential diagnosis, an urgency level (e.g., Urgent, Moderate, Low), and care instructions.
    *   If only an image is provided, a simpler flow (`analyzeAnimalImage`) should be used.
    *   Display the results clearly on the page. The result card should have a "Read Aloud" button that uses a text-to-speech AI flow to read the diagnosis to the user.

4.  **Voice Assistant**:
    *   A full-screen chat interface.
    *   The primary input method is a large microphone button. When pressed, it records the user's voice.
    *   The recorded audio data should be sent directly to an AI flow (`processVoiceQuery`).
    *   This flow will transcribe the audio, generate a text answer, and convert that answer back into an audio response.
    *   The page should display the conversation transcript and automatically play the AI's audio response.

5.  **Care & Management Tools**:
    *   **Feed Advice**: A form where users enter animal species, age, and location. An AI flow (`getFeedAdvice`) should generate a personalized morning/evening feed plan, considering local weather.
    *   **Health Tracker**: A page to log and visualize health data. Use charts (from `recharts`) to display trends for "Milk Yield" and "Weight". Allow users to log new data points.
    *   **Care Reminders**: A page to list upcoming reminders for 'Vaccination', 'Deworming', 'Pregnancy Due', etc. Include a feature to add new reminders and a "Vaccination Calendar" view that visualizes completed and due vaccinations on a calendar component.

6.  **Community & Services**:
    *   **Vet Connect**: Display an embedded map showing nearby vets. List 3-4 sample vet clinics with their address and phone number. Add buttons for "Directions" (opens Google Maps) and "Book Appointment" (a mock booking dialog).
    *   **Marketplace**: A page to browse listings. Include a search bar and a category filter. Allow users to post a new ad for selling animals, feed, or accessories through a dialog form.

**Styling and UI/UX**:

-   **Primary Color**: Calming green (`#8FBC8F`)
-   **Background Color**: Light beige/off-white (`#F5F5DC`)
-   **Accent/Urgent Color**: Terracotta (`#E07A5F`)
-   **Font**: 'PT Sans' for all text.
-   **UI Library**: Use ShadCN/UI components for everything (Cards, Buttons, Dialogs, Inputs, etc.).
-   **Icons**: Use `lucide-react` for all icons.
-   **Layout**: The app should be responsive and mobile-first. Use a consistent header across all pages.

**Technical Implementation (Genkit & AI)**:

-   Use `genkit` for all AI functionality.
-   **Language Support**: The app must support English, Hindi, and Assamese. The user should be able to switch languages from a dropdown in the header. This selection should be stored in `localStorage`.
-   The language selection should be passed to all relevant AI flows so that the AI can understand the user's query and respond in the correct language.
-   For all voice recording features, the selected language must be used to configure the speech-to-text transcription.
-   All server-side logic (calling AI flows) should be handled within Next.js Server Actions. Use the `useActionState` hook for handling form submissions and displaying pending/error states.
```