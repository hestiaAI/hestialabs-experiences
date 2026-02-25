import Shepherd from 'shepherd.js'

/**
 * Waits for a DOM element to appear, retrying up to maxTries times.
 */
function waitForElement(selector, maxTries = 20, interval = 150) {
  return new Promise((resolve) => {
    let tries = 0
    const check = () => {
      const el = document.querySelector(selector)
      if (el) return resolve(el)
      if (++tries >= maxTries) return resolve(null)
      setTimeout(check, interval)
    }
    check()
  })
}

/**
 * Switches the OverView component to week mode so the timeline legend is visible,
 * then resolves after a short paint delay.
 */
function switchOverviewToWeek() {
  return new Promise((resolve) => {
    const weekBtn = document.querySelector('.period-switch .switch-btn:first-child')
    if (weekBtn && !weekBtn.classList.contains('active')) {
      weekBtn.click()
      setTimeout(resolve, 350)
    } else {
      resolve()
    }
  })
}

/**
 * Switches the EarningsDistribution component to week mode.
 */
function switchEarningsToWeek() {
  return new Promise((resolve) => {
    const weekBtn = document.querySelector('.period-switch .switch-btn:first-child')
    if (weekBtn && !weekBtn.classList.contains('active')) {
      weekBtn.click()
      setTimeout(resolve, 350)
    } else {
      resolve()
    }
  })
}

/**
 * Switches the EarningsDistribution component to total mode.
 */
function switchEarningsToTotal() {
  return new Promise((resolve) => {
    const totalBtn = document.querySelector('.period-switch .switch-btn:last-child')
    if (totalBtn && !totalBtn.classList.contains('active')) {
      totalBtn.click()
      setTimeout(resolve, 500)
    } else {
      resolve()
    }
  })
}

export function createBabysitterTour() {
  const tour = new Shepherd.Tour({
    useModalOverlay: true,
    defaultStepOptions: {
      scrollTo: { behavior: 'smooth', block: 'center' },
      cancelIcon: { enabled: true },
      classes: 'shadow-lg bg-white rounded'
    }
  })

  /* ══════════════════════════════════════════
     SHIFT TIMELINE PAGE
  ══════════════════════════════════════════ */

  tour.addStep({
    id: 'intro',
    text: 'Welcome to your job data dashboard! This quick tour will walk you through every chart and control. You can skip at any time.',
    buttons: [
      { text: 'Skip', action: tour.cancel },
      { text: 'Start tutorial', action: tour.next }
    ]
  })

  tour.addStep({
    id: 'period-switch',
    attachTo: { element: '.period-switch', on: 'bottom' },
    text: 'Use these buttons to switch between <strong>Week</strong>, <strong>Month</strong>, and <strong>Total</strong> views. The arrow buttons let you navigate between individual weeks or months.',
    buttons: [
      { text: 'Back', action: tour.back },
      { text: 'Next', action: tour.next }
    ]
  })

  tour.addStep({
    id: 'week-nav',
    attachTo: { element: '.week-nav', on: 'bottom' },
    text: 'Navigate forward and back with the arrows. The label shows the exact date range currently displayed.',
    buttons: [
      { text: 'Back', action: tour.back },
      { text: 'Next', action: tour.next }
    ]
  })

  tour.addStep({
    id: 'stats',
    attachTo: { element: '.box1', on: 'bottom' },
    text: 'Key metrics for the selected period: <strong>Total Earnings</strong>, <strong>Hours Worked</strong>, and <strong>Number of Jobs</strong>. These update whenever you change the period or apply a filter.',
    buttons: [
      { text: 'Back', action: tour.back },
      { text: 'Next', action: tour.next }
    ]
  })

  tour.addStep({
    id: 'timeline',
    attachTo: { element: '.box2', on: 'top' },
    text: '<strong>Shift Timeline</strong><br>• <em>Week view</em>: each bar shows a job\'s time slot during the day.<br>• <em>Month view</em>: calendar — click any day to jump to that week.<br>• <em>Total view</em>: heatmap of all jobs by day-of-week and hour.',
    buttons: [
      { text: 'Back', action: tour.back },
      {
        text: 'Next',
        action: async() => {
          await switchOverviewToWeek()
          tour.next()
        }
      }
    ]
  })

  tour.addStep({
    id: 'legend',
    attachTo: { element: '.legend', on: 'top' },
    text: 'The legend lists every activity type with its color and the number of jobs it contains in this period.',
    beforeShowPromise: () => waitForElement('.legend').then(() => undefined),
    buttons: [
      { text: 'Back', action: tour.back },
      { text: 'Next', action: tour.next }
    ]
  })

  tour.addStep({
    id: 'avg-time',
    attachTo: { element: '.avg-box', on: 'left' },
    text: 'Your <strong>average shift duration</strong> across all jobs in the selected period.',
    buttons: [
      { text: 'Back', action: tour.back },
      { text: 'Next', action: tour.next }
    ]
  })

  tour.addStep({
    id: 'jobtype-filter',
    attachTo: { element: '.tour-jobtype-filter', on: 'left' },
    text: 'Filter the timeline by job type — only the selected activity will be shown in the chart and stats.',
    buttons: [
      { text: 'Back', action: tour.back },
      { text: 'Next', action: tour.next }
    ]
  })

  /* ══════════════════════════════════════════
     ACTIVITY TYPES PAGE
  ══════════════════════════════════════════ */

  tour.addStep({
    id: 'go-to-activity',
    text: 'Now let\'s look at the <strong>Activity Types</strong> page to see how your working time is distributed across job categories.',
    buttons: [
      { text: 'Back', action: tour.back },
      {
        text: 'Go there →',
        action: () => {
          window.__continueBabysitterTour = () => tour.next()
          const btn = document.getElementById('activityTypes')
          if (btn) {
            btn.click()
          } else {
            tour.next()
          }
        }
      }
    ]
  })

  tour.addStep({
    id: 'activity-chart',
    attachTo: { element: '.tour-activity-chart', on: 'top' },
    text: '<strong>Activity Types chart</strong><br>• <em>Week / Month</em>: heatmap — rows are job types, columns are days, darker cell = more hours worked.<br>• <em>Total</em>: sortable horizontal bar chart ranking all job types by total hours.',
    beforeShowPromise: () => waitForElement('.tour-activity-chart').then(() => undefined),
    buttons: [
      { text: 'Next', action: tour.next }
    ]
  })

  tour.addStep({
    id: 'activity-legend',
    attachTo: { element: '.activity-legend', on: 'top' },
    text: 'Color legend for the heatmap — each swatch corresponds to an activity type row.',
    beforeShowPromise: () => waitForElement('.activity-legend').then(() => undefined),
    buttons: [
      { text: 'Next', action: tour.next }
    ]
  })

  /* ══════════════════════════════════════════
     EARNINGS DISTRIBUTION PAGE
  ══════════════════════════════════════════ */

  tour.addStep({
    id: 'go-to-earnings',
    text: 'Finally, the <strong>Earnings Distribution</strong> page breaks down your income by time of day and activity.',
    buttons: [
      {
        text: 'Go there →',
        action: () => {
          window.__continueBabysitterTour = () => tour.next()
          const btn = document.getElementById('earningsDistribution')
          if (btn) {
            btn.click()
          } else {
            tour.next()
          }
        }
      }
    ]
  })

  tour.addStep({
    id: 'earnings-chart-week',
    attachTo: { element: '.tour-earnings-chart', on: 'top' },
    text: '<strong>Bubble chart (Week / Month view)</strong><br>Each bubble represents a group of jobs on one day. <strong>Vertical position</strong> = total earnings, <strong>bubble size</strong> = total hours worked, <strong>color</strong> = activity type. Hover a bubble for details.',
    beforeShowPromise: async() => {
      await switchEarningsToWeek()
      await waitForElement('.tour-earnings-chart')
    },
    buttons: [
      { text: 'Next', action: tour.next }
    ]
  })

  tour.addStep({
    id: 'earnings-filter',
    attachTo: { element: '.tour-jobtype-filter', on: 'left' },
    text: 'Filter the bubble chart by activity type. Only jobs matching the selection will appear in the chart.',
    beforeShowPromise: () => waitForElement('.tour-jobtype-filter').then(() => undefined),
    buttons: [
      { text: 'Back', action: tour.back },
      {
        text: 'Next',
        action: async() => {
          await switchEarningsToTotal()
          tour.next()
        }
      }
    ]
  })

  tour.addStep({
    id: 'earnings-total-chart',
    attachTo: { element: '.tour-earnings-chart', on: 'top' },
    text: '<strong>Stacked bar chart (Total view)</strong><br>Shows earnings grouped by time of day (Morning 08-12 / Day 12-17 / Evening 17-22). Each segment is colored by job <em>category</em>. Use the <strong>Total / Avg/Hour toggle</strong> above the chart to switch modes.',
    beforeShowPromise: () => waitForElement('.tour-earnings-chart').then(() => undefined),
    buttons: [
      { text: 'Next', action: tour.next }
    ]
  })

  tour.addStep({
    id: 'earnings-bar-chart',
    attachTo: { element: '.total-bar-chart', on: 'top' },
    text: '<strong>Earnings per Hour by Activity</strong><br>Ranks each activity type by its effective hourly rate (total earnings ÷ total hours). Use the sort dropdown to order ascending or descending — great for spotting your best-paying jobs.',
    beforeShowPromise: () => waitForElement('.total-bar-chart').then(() => undefined),
    buttons: [
      { text: 'Back', action: tour.back },
      { text: 'Finish ✓', action: tour.complete }
    ]
  })

  return tour
}
