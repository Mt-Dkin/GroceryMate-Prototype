# GroceryMate - High-Fidelity Prototype
# Figma Link: https://review-crisp-84254803.figma.site

> **SIT317: Task 8.2HD High-Fidelity Prototype**  
> **Author:** Mack Turley (Student ID: s224876985)  
> **Team:** Group 13  

---

## Overview

**GroceryMate** is a mobile application concept designed to help Australian households tackle the rising cost of groceries. Unlike traditional tools that only compare individual products, GroceryMate prices an entire grocery basket across nearby supermarkets (e.g., Aldi, Coles, and Woolworths) simultaneously. It highlights the single cheapest store for a one-stop trip as well as the optimal multi-store split—complete with net dollar savings.

This repository contains the interactive high-fidelity prototype assets and user flow documentation, including an individually developed **Meal Planner** feature extension.

---

## Key Features

* **Home & Budget Dashboard:** Instantly displays exact dollar savings from the prior shop, provides quick controls to adjust weekly budgets, and surfaces daily cheapest prices for favorite items.
* **Full-Basket Price Comparison:** Compares a 12-item basket across major retailers at once. Evaluates whether a multi-store split provides meaningful savings or if a single retailer is more economical.
* **In-Store Barcode Scanner:** Features a high-contrast dark theme optimized for supermarket lighting, confirming product matches and ranking nearby store prices by distance and cost.
* **Price History & Trends:** Offers per-item tracking toggles alongside price drop/rise alerts, using clear percentage and dollar metrics to illustrate trends over time.
* **Integrated Meal Planner (Feature Extension):** Connects weekly meal planning directly to basket pricing. Features cost-per-serve estimates, dynamic budget tips tied to weekly sales, and a one-tap action to add ingredients straight into the basket comparison.

---

## Design System & Principles

* **Brand Palette:** Green (freshness and cheapest options), Blue (trust and primary actions), White/Off-White (clarity), Amber (non-alarming budget callouts), and Dark Navy (scanner contrast).
* **Core UX Principles:**
  * **Price is the hero:** Pricing and savings represent the highest-contrast elements on every screen.
  * **Dollars over percentages:** Real dollar savings eliminate mental arithmetic during quick buying decisions.
  * **One-handed reach:** Essential navigation and primary actions sit within comfortable thumb reach for easy use while pushing a shopping trolley.

---

## User Personas & Target Audience

Targeted at budget-conscious Australian households aged 18–65, grounded in three primary personas:
* **Priya (Melbourne):** Time-poor parent who cannot manually check multiple store catalogues.
* **Daniel (Geelong):** University student managing an irregular budget who needs quick, automated cost decisions.
* **Margaret (Bendigo):** Retiree on a fixed income looking to verify genuine weekly specials.

---

## Prototype Deliverables & Testing Strategy

* **Figma Prototype:** Designed and tested as a clickable, high-fidelity experience to evaluate user comprehension and navigation speed before native development commitments.
* **Usability Testing Plan:** Moderated remote think-aloud sessions across 5–8 participants reflecting target personas, tracking task completion, speed, and navigation friction across core flows.

* ## 🛠️ Extracting & Running Code from the Figma Prototype

If you want to inspect the design tokens, extract React component code, or export the screens into your own project, follow the steps below.

### Prerequisites
- Access to the [GroceryMate Figma File](INSERT_FIGMA_URL_HERE).
- A free or Deakin-affiliated Figma account.
- [Node.js](https://nodejs.org/) (v18+) and `npm` installed locally (if running an exported React build).

---

### Option A: Inspect & Copy Code Directly (Figma Dev Mode)

Use this method to grab clean React JSX and CSS/Tailwind classes for individual components (e.g., cards, bottom nav, budget widgets):

1. **Open the Project in Figma:**  
   Click the project file link above.
2. **Switch to Dev Mode:**  
   Click the green **Dev Mode toggle switch (`</>`)** in the top-right corner of the interface (or press `Shift + D`).
3. **Select Code Language:**  
   In the right-hand inspection panel under **Code**, select your desired framework:
   - **React** (JSX)
   - **Tailwind CSS** or standard **CSS**
4. **Select a Component:**  
   Click any frame or UI element (such as the *Weekly Budget Bar*, *Compare Store Card*, or *Meal Planner Card*).
5. **Copy Code & Assets:**  
   - Copy the generated JSX and styling directly into your local project's component files.
   - For icons and images: select the asset, scroll down to **Export** in the right panel, select **SVG** (for icons) or **PNG** (for product imagery), and click **Export**.

---

### Option B: Export the Full Prototype as a React App (Using Plugins)

To export entire screens with functional layouts and boilerplate code:

1. **Install a Figma-to-Code Plugin:**
   - In Figma, open the actions menu (`Ctrl + /` on Windows or `Cmd + /` on Mac).
   - Search for and run an export plugin such as **Locofy.ai**, **Anima for Figma**, or **Builder.io**.
2. **Select Screens to Export:**
   - Highlight the 5 target prototype screens:
     - `1. Home`
     - `2. Basket Comparison`
     - `3. Scan a Product`
     - `4. Price History`
     - `5. Meal Planner`
3. **Generate Code:**
   - Select your export preferences (e.g., **React + Tailwind CSS** or **Next.js**).
   - Click **Export Code** / **Download as Zip**.

---

### Option C: Running the Exported Code Locally

Once you have downloaded or cloned the generated React repository:

1. **Navigate to the Project Directory:**
   ```bash
   cd grocerymate-frontend
