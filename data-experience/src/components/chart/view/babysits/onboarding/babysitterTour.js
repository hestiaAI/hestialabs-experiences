import Shepherd from 'shepherd.js'

export function createBabysitterTour() {
  const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      scrollTo: true,
      cancelIcon: { enabled: true },
      classes: 'shadow-lg bg-white rounded'
    }
  })

  /* ------------------------------
    STEP 1 – Welcome
  ------------------------------ */
  tour.addStep({
    id: 'intro',
    text: 'Welcome! This page shows all your babysitting jobs and earnings.',
    buttons: [
      { text: 'Skip', action: tour.cancel },
      { text: 'Next', action: tour.next }
    ]
  })

  /* ------------------------------
    STEP 2 – Period switch buttons
  ------------------------------ */
  tour.addStep({
    id: 'period-switch',
    attachTo: { element: '.period-switch', on: 'bottom' },
    text: 'Use these buttons to switch between week, month or total views.',
    buttons: [{ text: 'Next', action: tour.next }]
  })

  /* ------------------------------
     STEP 3 – Week navigation
  ------------------------------ */
  tour.addStep({
    id: 'week-nav',
    attachTo: { element: '.week-nav', on: 'bottom' },
    text: 'Navigate between weeks or months here.',
    buttons: [{ text: 'Next', action: tour.next }]
  })

  /* ------------------------------
     STEP 4 – Timeline chart
  ------------------------------ */
  tour.addStep({
    id: 'timeline',
    attachTo: { element: '.box2', on: 'top' },
    text: 'This timeline shows your job shifts for each day.',
    buttons: [{ text: 'Next', action: tour.next }]
  })

  /* ------------------------------
     STEP 5 – Legend
  ------------------------------ */
  tour.addStep({
    id: 'legend',
    attachTo: { element: '.legend', on: 'top' },
    text: 'Here you can see what each job status color means.',
    buttons: [{ text: 'Next', action: tour.next }]
  })

  /* ------------------------------
     STEP 6 – Stats (top box)
  ------------------------------ */
  tour.addStep({
    id: 'stats',
    attachTo: { element: '.box1', on: 'bottom' },
    text: 'This section summarizes your totals: earnings, hours worked and number of jobs.',
    buttons: [{ text: 'Finish', action: tour.complete }]
  })

  tour.addStep({
    id: 'go-to-activity',
    text: 'Next, let\'s look at your Activity Types overview.',
    buttons: [{
      text: 'Next',
      action: () => {
        window.__continueBabysitterTour = () => tour.next()

        const btn = document.getElementById('activityTypes')
        if (btn) btn.click()
      }
    }
    ]
  })

  /* ------------------------------
    ACTIVITY DIAGRAM
  ------------------------------ */
  tour.addStep({
    id: 'activity-chart',
    attachTo: { element: '.tour-activity-chart', on: 'top' },
    text: 'This chart shows your shifts grouped by activity types and times.',
    buttons: [{ text: 'Next', action: tour.next }]
  })

  /* ------------------------------
    JOB TYPE FILTER
  ------------------------------ */
  tour.addStep({
    id: 'jobtype-filter',
    attachTo: { element: '.tour-jobtype-filter', on: 'left' },
    text: 'Here you can filter jobs by activity type to narrow down what’s displayed.',
    buttons: [{ text: 'Finish', action: tour.complete }]
  })

  /* ------------------------------
    GO TO EARNINGS TAB
  ------------------------------ */
  tour.addStep({
    id: 'go-to-earnings',
    text: 'Now let’s check how your earnings are distributed.',
    buttons: [
      {
        text: 'Next',
        action: () => {
          window.__continueBabysitterTour = () => tour.next()

          const btn = document.getElementById('earningsDistribution')
          if (btn) btn.click()
        }
      }
    ]
  })

  /* ------------------------------
    EARNINGS CHART
  ------------------------------ */
  tour.addStep({
    id: 'earnings-chart',
    attachTo: {
      element: '.tour-earnings-chart',
      on: 'top'
    },
    text: 'This bubble chart shows how your income is distributed by days and time of work.',
    buttons: [
      {
        text: 'Finish',
        action: tour.complete
      }
    ]
  })

  return tour
}
