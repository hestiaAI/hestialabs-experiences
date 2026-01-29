import Shepherd from 'shepherd.js'

export function createTour({ onSwitchTab }) {
  const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      scrollTo: true,
      cancelIcon: { enabled: true },
      classes: 'shadow-lg bg-white rounded'
    }
  })

  /* ------------------------------
      FIRST TAB: Overview
  ------------------------------ */
  tour.addStep({
    id: 'intro-overview',
    text: 'Welcome! This page shows your weekly or monthly performance overview.',
    buttons: [
      { text: 'Skip', action: tour.cancel },
      { text: 'Start Tutorial', action: tour.next }
    ]
  })

  tour.addStep({
    id: 'timeline-chart',
    attachTo: { element: '.box2', on: 'top' },
    text: 'This timeline shows the exact times you were working: offline, open, enroute, and on trip.',
    buttons: [{ text: 'Next', action: tour.next }]
  })

  tour.addStep({
    id: 'period-switch',
    attachTo: { element: '.period-switch', on: 'bottom' },
    text: 'Use these buttons to switch between weekly, monthly, or overall data.',
    buttons: [{ text: 'Next', action: tour.next }]
  })

  tour.addStep({
    id: 'week-nav-wrapper',
    attachTo: { element: '.week-nav-wrapper', on: 'bottom' },
    text: 'Navigate between time periods here to view data from previous or upcoming weeks.',
    buttons: [{ text: 'Next', action: tour.next }]
  })

  tour.addStep({
    id: 'go-to-routes',
    text: 'Next, let’s take a look at your routes on the map.',
    buttons: [
      {
        text: 'Next',
        action: () => {
          // Make Shepherd wait for the next page to load
          window.__continueRoutesTour = () => tour.next()

          // Click the button that navigates to MyTrips
          const btn = document.getElementById('csv_courier_trips')
          if (btn) btn.click()
        }
      }
    ]
  })

  /* ------------------------------
      SECOND TAB: MyTrips
  ------------------------------ */

  tour.addStep({
    id: 'map-div',
    attachTo: { element: '.map-div', on: 'top' },
    text: 'Here you can see all your routes for the selected period. The green marker shows where a route started, the blue marker shows where it ended, and the surrounding circle indicates the delivery area.',
    buttons: [{ text: 'Next', action: tour.next }]
  })

  tour.addStep({
    id: 'selected-routes',
    attachTo: { element: '.selected-routes', on: 'top' },
    text: 'This list shows all route points displayed on the map. Click a point to highlight it and focus on that specific route.',
    buttons: [{ text: 'Next', action: tour.next }]
  })

  tour.addStep({
    id: 'go-to-earnings',
    text: 'Finally, let’s look at your earnings overview.',
    buttons: [
      {
        text: 'Next',
        action: () => {
          // Make Shepherd wait for the next page to load
          window.__continueRoutesTour = () => tour.next()

          // Click the button that navigates to Earnings
          const btn = document.getElementById('earnings')
          if (btn) btn.click()
        }
      }
    ]
  })

  /* ------------------------------
      THIRD TAB: Earnings
  ------------------------------ */

  tour.addStep({
    id: 'chart-container',
    attachTo: { element: '.chart-container', on: 'top' },
    text: 'This chart shows your total earnings per day. Tips are shown in green and your base earnings in blue.',
    buttons: [{ text: 'Next', action: tour.next }]
  })

  tour.addStep({
    id: 'toggle-wrapper',
    attachTo: { element: '.toggle-wrapper', on: 'bottom' },
    text: 'Use this toggle to switch between total daily earnings and earnings adjusted by working hours.',
    buttons: [{ text: 'Next', action: tour.next }]
  })

  tour.addStep({
    id: 'go-to-overview',
    text: 'Let’s return to the main overview. This concludes your tour!',
    buttons: [
      {
        text: 'Finish',
        action: () => {
          // Navigate back to Overview
          const btn = document.getElementById('combined_data_pipeline')
          if (btn) btn.click()

          // End the tour immediately
          tour.complete()
        }
      }
    ]
  })

  return tour
}
