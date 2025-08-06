# MitraVet: AI-Powered Agri-Tech Platform

MitraVet is a comprehensive web application designed to assist rural and semi-urban users in managing their livestock, pets, and crops. It leverages AI to provide instant diagnostic support, offers essential care and farm management tools, and connects users with a local marketplace and veterinary/agricultural services.

The application is built with a mobile-first approach, featuring a clean, accessible interface and multilingual support (English, Hindi, and Assamese) to cater to a diverse user base.

## Core Features

### 1. **AI Diagnostics**
-   **Animal Doctor**: Users can upload a photo of their animal and describe its symptoms (either by typing or by voice recording in their selected language). An AI model analyzes the provided information to suggest a potential diagnosis, assess the urgency, and provide immediate care recommendations.
-   **Crop Doctor (Krishiek Feature)**: Similar to the Animal Doctor, users can upload a photo of a diseased crop (e.g., a leaf or stem) to get an AI-powered diagnosis, learn about the potential disease, and receive advice on treatment and prevention.
-   **Text-to-Speech**: All diagnostic results can be read aloud to the user, improving accessibility.

### 2. **Voice Assistant**
-   **Conversational AI**: Users can ask questions about animal care or crop management in their native language using their voice.
-   **End-to-End Voice Interaction**: The app records the user's voice query, sends the audio directly to an AI for processing, and plays back the generated audio response, creating a seamless conversational experience.

### 3. **Dashboard & Personalization**
-   **Primary Focus Selection**: On first login, users select their primary focus (e.g., Cattle, Poultry, Farming), which customizes the dashboard features.
-   **Feature Grid**: A central dashboard provides easy access to all the app's features.
-   **Language Selection**: Users can switch the app's language between English, Hindi, and Assamese.

### 4. **Care & Management Tools**
-   **Feed Advice**: Provides personalized daily feeding plans for livestock based on the animal's species, age, and the user's location (to account for weather).
-   **Health & Crop Tracker**: Allows users to log and visualize key health metrics for animals (like milk yield and weight) or crop metrics (like yield and growth stages) over time using interactive charts.
-   **Care & Crop Reminders**: Helps users schedule and track important events like vaccinations, deworming, and pregnancy due dates for animals. For crops, it can track schedules for planting, fertilizing, and harvesting. Includes a visual calendar.
-   **Weather Advisory (Krishiek Feature)**: Provides localized weather forecasts and AI-driven advice, suggesting optimal times for planting, irrigating, or harvesting based on weather predictions.

### 5. **Community & Services**
-   **Vet Connect**: An integrated map that helps users find and get directions to nearby veterinary clinics. It also allows users to book appointments (mocked).
-   **Marketplace**: An expanded platform for users to buy and sell animals, crops, feed, medicine, farming equipment, and accessories. Users can post ads, filter listings by category, and search for items.
-   **Community Forum (Krishiek Feature)**: A space for users to connect with other farmers and veterinary experts, ask questions, and share knowledge and best practices.

### 6. **User Profile & Authentication**
-   **Simple Login**: A mock login system to simulate user accounts.
-   **Profile Management**: Users can view their profile and change their primary focus (animal type or farming).

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
You are an expert AI application developer. Your task is to build a comprehensive agricultural and veterinary assistant application named "MitraVet" from scratch.

**App Name**: MitraVet

**Core Idea**: An AI-powered assistant for rural and semi-urban users. It should help them detect animal and crop diseases early, manage their farm's health and productivity, and connect with local services and a community of peers. The app must be user-friendly, support multiple languages (English, Hindi, Assamese), and work well on mobile devices.

**Key Features to Implement**:

1.  **User Authentication & Onboarding**:
    *   Create a simple mock login page (email/password).
    *   After the first login, prompt the user to select their primary focus (e.g., Cattle, Poultry, Farming) to customize their experience. Store this choice in `localStorage`.

2.  **Main Dashboard**:
    *   The home page after login, welcoming the user.
    *   Display a grid of feature cards that navigate to the different sections of the app.
    *   Include specialized cards that appear based on the user's selected focus.

3.  **AI Diagnostics**:
    *   **AI Animal Doctor**: A page to upload an animal's photo and describe symptoms (via text or voice note). The AI should return a diagnosis, urgency level, and care instructions.
    *   **AI Crop Doctor**: A similar page for crops. Users upload a photo of a plant (e.g., a leaf) to get a disease diagnosis and treatment advice.
    *   **Read Aloud**: All AI-generated results should have a button to read the text aloud using a text-to-speech flow.

4.  **Voice Assistant**:
    *   A full-screen chat interface where the primary input is a microphone button.
    *   The recorded audio data should be sent directly to an AI flow (`processVoiceQuery`) which transcribes, generates an answer, and converts it back to audio.
    *   The page should display the conversation and auto-play the AI's audio response.

5.  **Care & Management Tools**:
    *   **Feed Advice**: An AI flow to generate personalized livestock feeding plans based on species, age, and location (for weather).
    *   **Health/Crop Tracker**: A page to log and visualize data. Use charts to show trends for animal health (milk yield, weight) or crop performance.
    *   **Care & Crop Reminders**: A page to list and add upcoming reminders for animal care (vaccinations, etc.) and farming tasks (planting, fertilizing). Include a visual calendar view.
    *   **Weather Advisory**: An AI-powered feature that provides local weather forecasts and actionable advice for farming activities.

6.  **Community & Services**:
    *   **Vet Connect**: An embedded map showing nearby vet clinics with contact details and mock appointment booking.
    *   **Marketplace**: A page to browse and post ads for animals, crops, feed, medicine, and equipment. Include search and category filters.
    *   **Community Forum**: A section where users can post questions and view discussions, creating a knowledge-sharing community.

**Styling and UI/UX**:

-   **Primary Color**: Calming green (`#8FBC8F`)
-   **Background Color**: Light beige/off-white (`#F5F5DC`)
-   **Accent/Urgent Color**: Terracotta (`#E07A5F`)
-   **Font**: 'PT Sans' for all text.
-   **UI Library**: Use ShadCN/UI components for everything.
-   **Icons**: Use `lucide-react`.
-   **Layout**: The app should be responsive and mobile-first with a consistent header.

**Technical Implementation (Genkit & AI)**:

-   Use `genkit` for all AI functionality.
-   The user's selected language (stored in `localStorage`) must be passed to all relevant AI flows to ensure responses are in the correct language.
-   All server-side logic (calling AI flows) should be handled within Next.js Server Actions, using `useActionState` for form submissions.
```
