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

  /* ========== SHIFT TIMELINE PAGE ========== */

  tour.addStep({
    id: 'intro',
    text: 'Welcome to your job data dashboard! Let\'s explore how your work is visualized.',
    buttons: [
      { text: 'Skip', action: tour.cancel },
      { text: 'Start tutorial', action: tour.next }
    ]
  })

  tour.addStep({
    id: 'period-switch',
    attachTo: { element: '.period-switch', on: 'bottom' },
    text: 'Switch between Week, Month, and Total views. Use the arrows to navigate between periods.',
    buttons: [{ text: 'Next', action: tour.next }]
  })

  tour.addStep({
    id: 'week-nav',
    attachTo: { element: '.week-nav-wrapper', on: 'bottom' },
    text: 'Navigate between weeks or months with the arrow buttons. The label shows the current date range.',
    buttons: [{ text: 'Next', action: tour.next }]
  })

  tour.addStep({
    id: 'stats',
    attachTo: { element: '.box1', on: 'bottom' },
    text: 'Key metrics for this period: Total Earnings, Hours Worked, and Number of Jobs.',
    buttons: [{ text: 'Next', action: tour.next }]
  })

  tour.addStep({
    id: 'timeline',
    attachTo: { element: '.box2', on: 'top' },
    text: 'Shift Timeline: Month view (default) shows a calendar — click any day to jump to that week. Week view shows each job as a bar with its time range. Total view shows a heatmap of all jobs by day and hour.',
    buttons: [{ text: 'Next', action: tour.next }]
  })

  tour.addStep({
    id: 'legend',
    attachTo: { element: '.legend', on: 'top' },
    text: 'Legend shows all activity types with their colors and job counts for this period.',
    buttons: [{ text: 'Next', action: tour.next }]
  })

  tour.addStep({
    id: 'avg-time',
    attachTo: { element: '.avg-box', on: 'left' },
    text: 'Average duration of your shifts in the selected period.',
    buttons: [{ text: 'Next', action: tour.next }]
  })

  tour.addStep({
    id: 'jobtype-filter',
    attachTo: { element: '.tour-jobtype-filter', on: 'left' },
    text: 'Filter the timeline by job type to focus on a specific activity.',
    buttons: [{ text: 'Next', action: tour.next }]
  })

  /* ========== ACTIVITY TYPES PAGE ========== */

  tour.addStep({
    id: 'go-to-activity',
    text: 'Now let\'s look at the Activity Types page to see how your time is distributed across job types.',
    buttons: [{
      text: 'Next',
      action: () => {
        window.__continueBabysitterTour = () => tour.next()
        const btn = document.getElementById('activityTypes')
        if (btn) btn.click()
      }
    }]
  })

  tour.addStep({
    id: 'activity-chart',
    attachTo: { element: '.tour-activity-chart', on: 'top' },
    text: 'Activity Types chart: Week/Month views show a heatmap — rows are job types, columns are days, darker = more hours. Total view shows a sortable bar chart ranking all job types by total hours worked.',
    buttons: [{ text: 'Next', action: tour.next }]
  })

  tour.addStep({
    id: 'activity-legend',
    attachTo: { element: '.activity-legend', on: 'top' },
    text: 'Legend shows all activity types present in this period with their assigned colors.',
    buttons: [{ text: 'Next', action: tour.next }]
  })

  /* ========== EARNINGS DISTRIBUTION PAGE ========== */

  tour.addStep({
    id: 'go-to-earnings',
    text: 'Finally, let\'s explore the Earnings Distribution page to analyze your income patterns.',
    buttons: [{
      text: 'Next',
      action: () => {
        window.__continueBabysitterTour = () => tour.next()
        const btn = document.getElementById('earningsDistribution')
        if (btn) btn.click()
      }
    }]
  })

  tour.addStep({
    id: 'earnings-chart',
    attachTo: { element: '.tour-earnings-chart', on: 'top' },
    text: 'Earnings Distribution — Week/Month: Bubble chart where each bubble = a group of jobs. Bubble size = total hours worked, vertical position = total earnings. Bubbles are colored by activity type.',
    buttons: [{ text: 'Next', action: tour.next }]
  })

  tour.addStep({
    id: 'earnings-filter',
    attachTo: { element: '.week-month-layout .tour-jobtype-filter', on: 'left' },
    text: 'Filter the bubble chart by activity type to focus on a specific job category.',
    beforeShowPromise: () => new Promise(resolve => setTimeout(resolve, 200)),
    buttons: [{
      text: 'Next',
      action: () => {
        const totalBtn = document.querySelector('.top-bar .period-switch .switch-btn:last-child')
        if (totalBtn) totalBtn.click()
        setTimeout(() => tour.next(), 400)
      }
    }]
  })

  tour.addStep({
    id: 'earnings-total-chart',
    attachTo: { element: '.tour-earnings-chart', on: 'top' },
    text: 'Total view: Stacked bar chart showing earnings grouped by time of day (Morning/Day/Evening) and colored by job category. Toggle between Total earnings and Average per hour using the switch above.',
    beforeShowPromise: () => new Promise(resolve => setTimeout(resolve, 400)),
    buttons: [{ text: 'Next', action: tour.next }]
  })

  tour.addStep({
    id: 'earnings-bar-chart',
    attachTo: { element: '.total-bar-chart', on: 'top' },
    text: 'This chart shows average earnings per hour for each activity type — sort ascending or descending to find your highest and lowest paying jobs.',
    buttons: [
      { text: 'Finish', action: tour.complete }
    ]
  })

  return tour
}
