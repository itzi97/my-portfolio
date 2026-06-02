---
title: "Vacumcite"
description: "A UX design project for a COVID-19 vaccination appointment website, built as a group project for the Fundamentals of UX course at U-tad."
pubDate: 2026-06-02
tags: ["UX / Design", "Figma"]
---

This was a group project for the Fundamentals of UX course at U-tad, done in 2021 right in the middle of the COVID-19 vaccination rollout in Spain. The brief was to design a web application for booking vaccination appointments. The timing made it feel unusually grounded as a brief since this was something people were actually doing and struggling with at the time, so there was a real reference point for what worked and what didn't.

The team was four people: Jorge, Jaime, Raul, and me. We each did individual low-fidelity wireframes first, then converged on a shared design. Most of the interesting decisions came out of that convergence, where each person's instincts pulled the design in slightly different directions.

## The user flow

Before touching any screens, we mapped out the full user journey. The path goes: log in, enter date of birth (which determines which vaccine you'll receive), confirm consent, select a medical centre, pick a time slot, pick a date, fill in health insurance details, declare any relevant conditions, review a summary, then confirm or cancel.

![User flow diagram for Vacumcite](https://raw.githubusercontent.com/itzi97/vacumcite/main/assets/imgs/diagrama-flujo.png)

A few decisions came out of the group discussion that shaped the flow in ways the individual wireframes hadn't captured. I proposed that the vaccine information box should appear both for a user who just filled in their date of birth and for a returning user who has already logged in, so the relevant context is always visible regardless of entry point. Raul added a "I have no conditions" option on the pathologies screen so users with nothing to declare don't get stuck. Jaime flagged that in a large region like Madrid many time slots would be unavailable due to simultaneous demand, so the appointment selection was split into two separate screens, picking a time first and then a date, to make that clearer.

## Wireframes

Each of us built individual low-fidelity wireframes before the group session. They turned out to be fairly similar in structure, which made merging straightforward. The main contributions each person brought:

- **Jorge:** the login layout with the remember-me checkbox; the health centre list with name, address, and minimap; the appointment summary layout
- **Itziar:** the dynamic vaccine information box that updates as you type your date of birth; the persistent vaccination stats bar across all pages
- **Raul:** the no-conditions shortcut on the pathologies screen
- **Jaime:** the calendar component with unavailable days greyed out; splitting time and date selection into two steps

![Calendar wireframe showing available and unavailable dates](https://raw.githubusercontent.com/itzi97/vacumcite/main/assets/imgs/wire-calendar.png)

The pathologies screen was the one where the individual wireframes diverged most. Nobody's individual design felt right, so we designed that screen from scratch as a group: a scrollable list of conditions where you can select multiple, with an information box that updates to show relevant warnings for whatever you've selected.

## From wireframes to mockups

The colour decisions were deliberate. Blue for the header bar because users already associate blue with medical contexts. Red and green for action buttons so the intent is obvious without reading the label. The rest of the page stays near-white with minimal colour to keep the focus on the content.

A few specific things changed between the wireframe and mockup stages:

- Login: enlarged the remember-me checkbox and brought the username and password fields closer together
- Date of birth: split the input into three separate day, month, year fields to reduce errors, as Jorge suggested
- Medical centre: replaced a generic map icon with a Google Maps style pin so clicking it obviously opens a map
- Appointment time: consolidated the time options into a centred block instead of spreading them across the page
- Calendar: changed to show only the calendar grid, with available times appearing in a dropdown when you click a day
- Health insurance: changed the public/private selection from checkboxes to radio buttons since only one can be chosen
- Appointment summary: replaced a shopping cart icon next to the conditions section with something less e-commerce looking
- Cancellation screen: made the cancel confirmation button red to signal the weight of the action

## Usability testing

We ran a usability study with 22 participants using the System Usability Scale, a standardised 10-question questionnaire scored from 1 to 5. The participants were mostly middle-aged adults, median age 50 with a range of 18 to 60, roughly half men and half women.

The final SUS score was **89.66 out of 100**, which sits well into the excellent range. Most questions came back strongly positive: 17 of 22 found it easy to use, 19 of 22 said it wasn't difficult, 16 of 22 said it wasn't complex.

Two questions gave weaker results worth noting. The first was "I would use VacumCite frequently", which still scored well but is a slightly awkward question for a one-time service. People booking a vaccination appointment aren't going to come back weekly, so high scores here reflect general satisfaction rather than literal intent to return.

The second was "The functions of VacumCite are well integrated", which was the most split response. One participant commented that showing the national vaccination counter on every page felt out of place. That's probably right. The persistent stats bar was my suggestion and the intention was to give users a sense of the broader rollout context. But once you're mid-flow trying to book an appointment that information is irrelevant and just adds visual noise. Scoping it to the login screen only would have been the cleaner call.

Full repo and wireframes on [GitHub](https://github.com/itzi97/vacumcite).
