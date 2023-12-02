import { formatDistance, parseISO } from 'date-fns'

type FullName = string
type DateType = Date | string
    

const formatUsername = (name: FullName) => {
    const splitname = name.split(' ')
    const firstname =  splitname[0].charAt(0).toUpperCase() + splitname[0].slice(1)
    const lastname = splitname[1].charAt(0).toUpperCase() + splitname[1].slice(1)
    return firstname + ' ' + lastname
}

const formatDate = (date:DateType) => {
    const parsedDate = typeof date ==='string' ? parseISO(date) : date
    return formatDistance(parsedDate, Date.now(), { addSuffix: true })
}


export { formatUsername, formatDate }