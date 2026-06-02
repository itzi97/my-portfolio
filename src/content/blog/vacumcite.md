---
title: "Vacumcite"
description: "A UX design project for a COVID-19 vaccination appointment website, built as a group project for the Fundamentals of UX course at U-tad."
pubDate: 2026-06-02
tags: ["UX / Design", "Figma"]
---

This was a group project for the Fundamentals of UX course at U-tad, done in 2021 right in the middle of the COVID-19 vaccination rollout in Spain. The brief was to design a web application that lets users book a vaccination appointment. The timing made it feel unusually concrete — this was something people were actually doing and struggling with at the time, so there was a real reference point for what good and bad looked like.

The team was four people: Jorge, Jaime, Raul, and me. We each did individual low-fidelity wireframes first, then converged on a shared design. Most of the interesting decisions came out of that convergence, where each person's priorities pulled the design in slightly different directions.

## The user flow

Before touching any screens, we mapped out the full user flow. The path goes: log in → enter date of birth (which determines which vaccine you'll receive) → confirm consent → select a medical centre → pick a time slot → pick a date → fill in your health insurance details → declare any relevant conditions → review a summary → confirm or cancel.

![User flow diagram for Vacumcite](https://raw.githubusercontent.com/itzi97/vacumcite/main/assets/imgs/diagrama-flujo.png)

A few decisions that came out of the group discussion: I proposed that the vaccine information box should be shown both to a user who just filled in their date of birth *and* to a returning user who's already logged in, so the relevant context is always visible. Raul added the "I have no conditions" option on the pathologies screen so users don't get stuck if they have nothing to declare. Jaime flagged that in a large region like Madrid, many time slots would be unavailable due to simultaneous demand, so the appointment selection was split into two separate screens — pick a time first, then a date — to make that clearer.

## Wireframes

Each of us built individual low-fidelity wireframes before the group session. They turned out to be fairly similar in structure, which made the merge straightforward. The main things we took from each person's work:

- **Jorge:** the login layout with the remember-me checkbox; the health centre selection with name, address, and minimap; the appointment summary layout
- **Itziar:** the dynamic vaccine information box that updates as you type your date of birth; showing vaccination stats in a persistent top bar across all pages
- **Raul:** the "no conditions" shortcut on the pathologies screen
- **Jaime:** the calendar component with unavailable days greyed out; splitting time and date selection into two steps

![Calendar wireframe showing available and unavailable dates](https://raw.githubusercontent.com/itzi97/vacumcite/main/assets/imgs/wire-calendar.png)

The pathologies screen was the one where the individual wireframes diverged most. Nobody's individual design felt right, so we designed that one from scratch as a group: a scrollable list of conditions where you can select multiple, with an information box that updates to show any relevant warnings for the selected conditions.

## From wireframes to mockups

The colour decisions were deliberate. Blue for the header bar because users already associate blue with medical contexts. Red and green for action buttons — red for cancel/destructive actions, green for confirm — so the intent of each button is obvious without reading the label. The rest of the page is near-white with minimal colour, keeping the focus on the content rather than the chrome.

A few specific improvements between wireframe and mockup stages:

- Login: enlarged the remember-me checkbox and brought the username/password fields closer together
- Date of birth: split the input into three separate day/month/year fields to reduce errors, as Jorge suggested
- Medical centre: replaced a generic map icon with a Google Maps-style pin icon so it's obvious that clicking it opens a map
- Appointment time: consolidated the time options into a centred block instead of spreading them across the page
- Calendar: changed to show only the calendar itself, with available times appearing as a dropdown when you click a day
- Health insurance: changed the public/private selection from checkboxes to radio buttons, since only one can be chosen
- Appointment summary: replaced a shopping cart icon next to the conditions section (which looked like an e-commerce page) with something more appropriate
- Cancellation screen: made the cancel confirmation button red to signal the severity of the action

## Usability testing

We ran a usability study with 22 participants using the System Usability Scale (SUS), a standardised 10-question questionnaire scored from 1 (strongly disagree) to 5 (strongly agree). The demographic was mostly middle-aged adults (median age 50, range 18–60), roughly half men and half women.

The final SUS score was **89.66 out of 100**, which is well into the "excellent" range. Most questions came back strongly positive: 17 of 22 participants found it easy to use, 19 of 22 said it wasn't difficult, 16 of 22 said it wasn't complex.

Two questions gave weaker results and are worth noting:

- **"I would use VacumCite frequently"** — a lot of 4s and 5s, but this question is a bit awkward for a single-use service. You'd expect to use a vaccination booking site once, maybe twice. The high scores here probably reflect general satisfaction rather than literal intent to return.
- **"The functions of VacumCite are well integrated"** — this was the most split response. One user commented that showing the national vaccination counter on every page felt out of place. That's probably right — it made more sense on the login screen as context, but became noise once you were in the booking flow.

That second point is a genuine design mistake in hindsight. The persistent stats bar was my suggestion, and the intention was to give users a sense of the rollout progress. But once you're mid-flow trying to book an appointment, that information is irrelevant and it adds visual clutter without adding value. Scoping it to the login screen only would have been the cleaner call.

Full repo and wireframes on [GitHub](https://github.com/itzi97/vacumcite).
