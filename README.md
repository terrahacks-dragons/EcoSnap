# EcoSnap

## Purpose

EcoSnap is a personal assistant application designed to empower users to make environmentally conscious decisions. By leveraging emerging technologies such as Ray-Ban Meta smart glasses, smart devices, and OpenAI’s APIs, our application analyzes and determines the best course of action for consumers to reduce their carbon footprint. This involves suggesting sustainable alternatives in what they eat, buy, and consume. EcoSnap integrates real-time insights and actionable recommendations into everyday activities to foster sustainable habits, reduce individual carbon footprints, and promote a broader culture of environmental awareness and responsibility.

## Inspiration

Our inspiration for this project stemmed from a desire to explore how we can lead more sustainable lifestyles without sacrificing convenience or time. Recognizing the importance of making environmentally conscious choices, we developed a tool that seamlessly integrates sustainability into daily decisions. By focusing on real-time insights and recommendations, we aim to simplify the process of choosing sustainable options that benefit both individuals and the environment. Utilizing emerging technologies, such as artificial intelligence and OpenAI's powerful language models, we analyze data to deliver personalized suggestions. Our goal is to empower users to embrace sustainability as a natural and convenient part of their everyday lives.

## What it does

**Eco-Friendly Shopping Companion:**
- **Barcode/QR Code Scanning:** Utilizes the smart glasses' camera to identify products and retrieve sustainability ratings.
- **Sustainability Ratings:** Provides real-time information about the environmental impact of products and suggests eco-friendly alternatives.
- **Brand Transparency:** Offers detailed brand profiles and user reviews focusing on sustainability practices.

**Eco-Friendly Food Companion:**
- **Food Item Analysis:** Scans and evaluates food items for their environmental impact, offering sustainability ratings.
- **Alternative Suggestions:** Recommends eco-friendly food alternatives tailored to dietary preferences.
- **Educational Insights:** Provides information on food miles, seasonal produce, and recipes with sustainable ingredients.

**Eco-Friendly Waste Reduction Guide/Companion:**
- **Location-Based Recycling Guidance:** Offers recycling and waste disposal instructions tailored to the user's location.
- **Waste Reduction Tips:** Provides tips and reminders for reducing waste and suggests reusable alternatives.
- **Recycling Center Information:** Connects users with local recycling centers and eco-friendly initiatives.

**Restaurant Companion:**
- **Sustainable Restaurant Recommendations:** Suggests restaurants with sustainable practices and provides menu item analyses.
- **Environmental Impact Scores:** Rates menu items based on their environmental impact, emphasizing plant-based options.
- **Food Miles and Seasonal Produce:** Educates users about ingredient sourcing and promotes locally-sourced, seasonal dishes.

**Sustainability Ratings and Leaderboard:**
- **Daily Sustainability Score:** Calculates scores based on users' eco-friendly actions and decisions throughout the day.
- **Leaderboards and Challenges:** Encourages friendly competition through weekly or monthly leaderboards and eco challenges.

## How we built it

We used OpenAI API, Node.js, JavaScript, HTML, CSS, Machine Learning, Prompt Engineering, Bun, and Python to develop EcoSnap.

## Challenges we ran into

Working with Meta Smart glasses presented a unique challenge due to the lack of an SDK, necessitating the creation of a workaround. We tackled this by setting up a web server and implementing an API, which we then trained using a database. Initially, we experimented with different approaches, such as using Bun and a bookmarking web scraper. However, these solutions proved too unpredictable and inconsistent, leading us to refine our strategy for more reliable results.

## What we learned

During our project, we gained valuable insights into API integration, JavaScript, and Next.js, as well as the intricacies of both frontend and backend development. We discovered that documentation can be challenging, as it's often written for a specific programming language, requiring us to adapt it to our needs. This experience taught us the importance of creative problem-solving when faced with obstacles.

## What we learned and could have done better

In hindsight, we realized that conducting more thorough research or choosing tools we were more familiar with could have streamlined our development process. Familiarity with the technologies used would have allowed us to anticipate potential challenges and navigate them more effectively. Additionally, reviewing documentation in advance would have provided us with a clearer understanding of the functionalities and limitations of the tools at our disposal, enabling us to make more informed decisions. This preparation could have saved us time and effort, allowing us to focus on innovation and problem-solving rather than troubleshooting unforeseen issues. Ultimately, this experience underscored the importance of preparation and knowledge when working with new technologies.

## What's next for EcoSnap

- **Recycling Center Information** (Future)
- **Waste Reduction Tips** (Future)
- **Location-Based Recycling Guidance** (Future)
