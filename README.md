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

