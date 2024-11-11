import React , {useEffect, useState} from 'react'
import axios from 'axios'
import formatDate from './formatDate'
import './css/eventTop.css'

function EventTop() {
    const [events, setEvents] = useState([])

    useEffect(() => {
       const fetchEvents = async () => {
         try {
            const response = await axios.get('http://localhost:5000/api/event')

            const currentDate = new Date()

            const upcomingEvents = response.data
            .filter(event => new Date(event.date_fin) >= currentDate)
            .sort((a, b) => new Date(a.date_debut) - new Date(b.date_debut)) 
            .slice(0, 2); 
  
          setEvents(upcomingEvents);
         } catch (error) {
            console.error(error)
         }
       }
       fetchEvents()
    }, [])
  return (
    <div className='eventTop'>
        <h2 className='eventTop-title'>Evenement a venir</h2>
        <div className='eventTop-container'>
            {events.map(event => (
                <div key={event._id} className='eventTop-item'>
                    <div className='eventTop-item-right'>
                    <h3 className='eventTop-subtitle'>{event.nom}</h3>
                    <p className='eventTop-text'>{formatDate(event.date_debut)} - {formatDate(event.date_fin)} - {event.ville}</p>
                    </div>
                    <div className='eventTop-item-left'>
                       <button className='eventTop-btn'>S'incrire</button>
                    </div> 
                    
                </div>
            ))}
        </div>
      
    </div>
  )
}

export default EventTop
