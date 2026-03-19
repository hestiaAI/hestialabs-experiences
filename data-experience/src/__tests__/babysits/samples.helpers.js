export const babysitterJobsCsv = `id,date,startHour,nbHours,pricePerHour,cityName,title,state,category
job-1,15.10.2023,8.5,2.5,15.00,Basel,Evening babysit,completed,Babysitting
job-2,16.10.2023,20,2,20.00,Zurich,Night shift,paid,Babysitting
`

export const expectedItems = [
  {
    job_id: 'job-1',
    date: '2023-10-15',
    start_time: '08:30',
    end_time: '11:00',
    duration_hours: 2.5,
    earnings: 37.5,
    location: 'Basel',
    job_type: 'Evening babysit',
    status: 'completed',
    category: 'Babysitting'
  },
  {
    job_id: 'job-2',
    date: '2023-10-16',
    start_time: '20:00',
    end_time: '22:00',
    duration_hours: 2,
    earnings: 40,
    location: 'Zurich',
    job_type: 'Night shift',
    status: 'paid',
    category: 'Babysitting'
  }
]
