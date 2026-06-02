---
title: "Firearm Homicides vs Legislation"
description: "A Tableau data visualisation project exploring the relationship between firearm laws and homicide rates across U.S. states from 1976 to 2023."
pubDate: 2026-06-02
tags: ["Data Visualisation", "Tableau", "Data Analysis"]
---

This was a data visualisation project for the Data Visualization course at U-tad. The central question: is there a relationship between the type and strength of firearm laws a U.S. state has in place and its firearm homicide rate? The answer that emerged from the data across multiple views and groupings was consistent, but more on that at the end.

## The data

Two public datasets were combined, joined on state and year in Tableau:

- **Kang et al. (Harvard Dataverse):** a state-year dataset covering 1949–2023 that uses the firearm suicide proxy (FSS) to estimate household gun ownership. FSS is the share of suicides committed with a firearm, a method with a long track record in public health research. The key outcome column used here is firearm homicide rate.
- **Tufts CTSI State Firearm Law Database:** 72 binary law indicators per state per year from 1976 to 2024, tracking whether each provision (permit requirements, waiting periods, background checks, assault weapon restrictions, and so on) was in effect.

The join was configured as many-to-many with "some records match" on both sides, which keeps rows even when a key exists in only one table. The analysis window is 1976–2023, the overlapping range, with Washington D.C. excluded since it only appears in one of the datasets.

## Three research questions

After exploring the data I settled on three questions, each adding a layer of complexity to the one before:

1. Is a state's firearm homicide rate associated with the number and type of firearm laws it has?
2. How have homicide rates changed over time across states grouped by their law profile?
3. For a specific state, does an increase in firearm laws correspond to a better ranking relative to other states?

## Law categorisation

Two grouping schemes run through every chart, controlled by a shared parameter that lets the viewer switch between them.

**By quantity**, states fall into three tiers based on total law count: Low (10 or fewer), Medium (11–25), High (more than 25).

**By type**, rather than using all 72 laws, I picked two subsets. The three most commonly adopted laws (Popular): concealed-carry permit requirement, waiting period, state-level background check. The three with the strongest evidence base in the research literature (Evidence-Based): universal background checks, gun-violence restraining orders, assault weapon restrictions. States are then placed in one of four categories depending on how many laws from each group they have adopted: Weak, Popular, Evidence, or Both.

## The visualisations

### Q1: Homicide rates and the law landscape

The choropleth map shows firearm homicide rate by state for any chosen year, with an orange severity gradient where darker means higher. A year parameter controls the view, and two-letter state abbreviations are shown on each mark via a calculated field.

![Choropleth map of firearm homicide rate by state](https://raw.githubusercontent.com/itzi97/DV_Tableau/main/figures/Q1Chart1.png)

A scatter plot places each state by law count on one axis and estimated ownership (FSS) on the other, coloured by law profile. The same law categorisation parameter used throughout the project switches between the quantity and type groupings.

![Scatter plot of law count vs estimated gun ownership, coloured by law profile](https://raw.githubusercontent.com/itzi97/DV_Tableau/main/figures/Q1Chart2.png)

### Q2: Homicide trends over time

A line chart covers the full 1976–2023 period. Each line is a group of states. A vertical reference line marks the currently selected year, linked to the year parameter from the map. The gap between groups becomes one of the clearest signals in the whole project.

![Line chart of firearm homicide rate over time by law profile](https://raw.githubusercontent.com/itzi97/DV_Tableau/main/figures/Q2Chart.png)

### Q3: State-level law history and homicide standing

A line chart shows how a selected state's total law count has grown over time.

![Line chart of firearm laws in effect over time for a selected state](https://raw.githubusercontent.com/itzi97/DV_Tableau/main/figures/Q3Chart1.png)

A bar chart ranks all states by firearm homicide rate for a chosen year, with the selected state highlighted using a Tableau set and a national average reference line overlaid. The two charts are linked by a shared state parameter, so clicking a state on the map updates both views at once.

![Bar chart of firearm homicide rate by state with selected state highlighted](https://raw.githubusercontent.com/itzi97/DV_Tableau/main/figures/Q3Chart2.png)

### Dashboards

The two dashboards tie everything together. Dashboard 1 combines the map, scatter, and Q2 line chart, with a filter action that propagates map selections to the scatter. The year parameter drops a reference line in the trend chart simultaneously.

![Dashboard 1: geographic overview, law-homicide scatter, and law profile trends](https://raw.githubusercontent.com/itzi97/DV_Tableau/main/figures/Dashboard1.png)

Dashboard 2 focuses on Q3, with the map kept as a geographic anchor and the bar and law history charts updating together whenever a state is selected.

![Dashboard 2: geographic map, state homicide ranking, and selected state law history](https://raw.githubusercontent.com/itzi97/DV_Tableau/main/figures/Dashboard2.png)

## A supplementary event study

To complement the Tableau work, I also ran an event-study style analysis in Python using the same two datasets. The idea was to compare how firearm homicide rates evolve in the years around the adoption of popular laws versus evidence-based ones, averaging across all adopting states.

The chart plots each law's average homicide rate trajectory from five years before adoption to ten years after. All five laws show a post-adoption decline, but the steepness and persistence differ. Evidence-based laws, especially Universal Background Checks and GVRO, show a noticeably sharper and more sustained drop. Popular laws show improvement too, but more gradually.

![Event study: average firearm homicide rate from 5 years before to 10 years after law adoption](https://raw.githubusercontent.com/itzi97/DV_Tableau/main/figures/LawAdoptionChart.png)

## What the data says

Across every view and grouping, the same story comes through:

- States with fewer or weaker laws sit at the higher end of the homicide rate distribution.
- The gap between high-law and low-law groups has widened since the 1990s, not narrowed.
- For many individual states, sustained legislative growth aligns with an improving ranking relative to other states.
- Evidence-based laws appear to be associated with steeper post-adoption declines than the more widely adopted but weaker popular laws.
- FSS (estimated ownership) adds context, but the policy profile of a state is a stronger signal than ownership levels alone.

This project doesn't prove causality and doesn't control for every confounding variable. But it consistently points in the same direction: how a state chooses to regulate firearms is closely linked to how often guns are used to kill. The type of law matters, not just whether laws exist.

The full Tableau workbook and data are [on GitHub](https://github.com/itzi97/DV_Tableau).
