# German Articles Quiz (der · die · das)

A small browser game for practicing German noun articles. Each round has 10 random nouns, instant feedback, a score, a streak counter, and a list of the words you got wrong.

**Live demo:** _add your GitHub Pages link here_

![Screenshot](<img width="1200" height="798" alt="image" src="https://github.com/user-attachments/assets/8871f8be-ab4f-4442-a28b-e4934e173b4c" />
)

## Features

- 50 nouns, including customer-service vocabulary (Rechnung, Bestellung, Konto, Passwort, ...)
- Arabic meaning shown for each word
- Instant feedback with color, plus a rule tip for words ending in **-ung** (die) and **-chen** (das)
- Score, streak, and best score saved in the browser (`localStorage`)
- Keyboard support: press **1**, **2** or **3**
- Review screen with the words you missed
- Light and dark mode, works on mobile

## Built with

HTML, CSS and vanilla JavaScript. No frameworks or build step.

## Run it locally

1. Download or clone this repository.
2. Open `index.html` in your browser.

## What I practiced

- DOM selection and updating text and classes
- Events: clicks and keyboard shortcuts
- Arrays, objects, and a shuffle algorithm (Fisher-Yates)
- Keeping the app state in one object
- Saving data with `localStorage` safely (`try/catch`)

## Ideas for next versions

- Choose difficulty or word categories
- Track which words I miss most across rounds
- Add audio pronunciation
- Rewrite it in React
