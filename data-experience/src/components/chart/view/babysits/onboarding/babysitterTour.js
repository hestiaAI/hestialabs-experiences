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

  /* STEP 1 – Welcome */
  tour.addStep({
    id: 'intro',
    text: 'Welcome to your babysitting data dashboard! Let\'s explore how your work is visualized.',
    buttons: [
      { text: 'Skip', action: tour.cancel },
      { text: 'Start tutorial', action: tour.next }
    ]
  })

  /* STEP 2 – Period switch buttons */
  tour.addStep({
    id: 'period-switch',
    attachTo: { element: '.period-switch', on: 'bottom' },
    text: 'Switch between Week, Month, and Total views. Week shows detailed daily breakdown, Month displays a calendar, and Total covers all your data.',
    buttons: [{ text: 'Next', action: tour.next }]
  })

  /* STEP 3 – Week navigation */
  tour.addStep({
    id: 'week-nav',
    attachTo: { element: '.week-nav', on: 'bottom' },
    text: 'Use arrow buttons to navigate between weeks or months. The label shows the current date range.',
    buttons: [{ text: 'Next', action: tour.next }]
  })

  /* STEP 4 – Stats box */
  tour.addStep({
    id: 'stats',
    attachTo: { element: '.box1', on: 'bottom' },
    text: 'Your key metrics: Total Earnings, Hours Worked, and Number of Jobs for this period.',
    buttons: [{ text: 'Next', action: tour.next }]
  })

  /* STEP 5 – Timeline chart */
  tour.addStep({
    id: 'timeline',
    attachTo: { element: '.box2', on: 'top' },
    text: 'Week view: Each bar shows one job with its duration. Month view: Click on any day in the calendar to see job details. Total view: Heatmap shows all jobs grouped by month.',
    buttons: [{ text: 'Next', action: tour.next }]
  })

  /* STEP 6 – Legend */
  tour.addStep({
    id: 'legend',
    attachTo: { element: '.legend', on: 'top' },
    text: 'Legend shows all activity types with their colors and job counts.',
    buttons: [{ text: 'Next', action: tour.next }]
  })

  /* STEP 7 – Average Work Time */
  tour.addStep({
    id: 'avg-time',
    attachTo: { element: '.avg-box', on: 'left' },
    text: 'Average duration of your shifts in this period.',
    buttons: [{ text: 'Next', action: tour.next }]
  })

  /* STEP 8 – Filter by Job Type */
  tour.addStep({
    id: 'jobtype-filter',
    attachTo: { element: '.tour-jobtype-filter', on: 'left' },
    text: 'Filter the timeline by activity type to focus on specific job categories.',
    buttons: [{ text: 'Next', action: tour.next }]
  })

  /* ========== ACTIVITY TYPES PAGE ========== */

  tour.addStep({
    id: 'go-to-activity',
    text: 'Now let\'s check the Activity Types page to see how your work is distributed across different job types.',
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
    text: 'Activity Types shows hours distribution across job types. Week view: daily breakdown with heatmap. Month view: calendar heatmap for the entire month. Total view: ranking of job types by total hours (sortable bar chart).',
    buttons: [{ text: 'Next', action: tour.next }]
  })

  tour.addStep({
    id: 'activity-legend',
    attachTo: { element: '.activity-legend', on: 'top' },
    text: 'Legend displays all activity types with their colors and total hours worked.',
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
    text: 'Earnings Distribution shows income patterns. Week/Month: Bubble chart where bubble size = hours worked, position = earnings by time of day (Morning/Day/Evening/Night). Total: Bar chart showing earnings per hour by activity type.',
    buttons: [{ text: 'Next', action: tour.next }]
  })

  tour.addStep({
    id: 'earnings-filter',
    attachTo: { element: '.tour-jobtype-filter', on: 'left' },
    text: 'Filter chart by activity type to focus on specific job types and see detailed earnings breakdown for that category.',
    buttons: [{ text: 'Next', action: tour.next }]
  })

  tour.addStep({
    id: 'earnings-bar-chart',
    attachTo: { element: '.total-bar-chart', on: 'top' },
    text: 'In Total view, this chart shows average earnings per hour for each activity type. Sort ascending or descending to find your highest and lowest paying jobs.',
    buttons: [
      {
        text: 'Finish',
        action: tour.complete
      }
    ]
  })

  return tour
}
