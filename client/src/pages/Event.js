import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import './css/event.css'
import axios from "axios"
import { Box, Paper } from '@mui/material';
import formatDate from '../components/formatDate';

function Event() {
const [dataEvent, setDataEvent ] = useState([])
const [searchTerm, setSearchTerm] = useState(" ")
const [visibleEvent, setVisibleEvent] = useState(4)
const [filteredEvent, setFilteredEvent] = useState([])
const [typeFilter, setTypeFilter] = useState('ALL')

useEffect(() => {
    fecthEventData()
}, [])

const fecthEventData = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/event')
      
      const currentDate = new Date();
      const upcomingEvents = response.data.filter(event => new Date(event.date_fin) >= currentDate);

      const sortedEvents = upcomingEvents.sort((a, b) => new Date(a.date_debut) - new Date(b.date_debut));

      setDataEvent(sortedEvents);
    } catch (error) {
      console.log(error);
    }
  }

useEffect(() => {
    const filtered = dataEvent.filter((event) => {
        const  matchesType = typeFilter === 'ALL' || event.type_evenement === typeFilter;
        const matchesSearch = event.nom.toLowerCase().includes(searchTerm.toLowerCase()) || event.ville.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesType && matchesSearch;
    })

    setFilteredEvent(filtered)

},[searchTerm, dataEvent, typeFilter])

const handleSearchChange = (e) => {
    setSearchTerm(e.target.value)
}

const handleTypeFilterChange = (e) => {
    setTypeFilter(e.target.value)
}

const handleLoadMore = () => {
    setVisibleEvent( (prev) => prev + 4)
}

const eventTypeColors = {
    BOURSE: "green",
    CONCOURS: "blue",
    EXPOSITION: "purple",
    AUTRE: "gray"
}

  return (
    <div className='event'>
        <Navbar/>
        <div className='event-container'>
            <div className='event-header'>
            <div className='event-search-container'>
                <SearchIcon style={{ color: 'gray', fontSize: '24px', cursor: 'pointer' }} />
                <input
                    type="text"
                    className='event-input'
                    placeholder="Rechercher des événements..."
                    onChange={(e) => setSearchTerm(e.target.value)}
                    value={searchTerm}
                />
                {searchTerm && (
                    <CloseIcon
                        style={{ color: 'gray', fontSize: '24px', marginLeft: '10px', cursor: 'pointer' }}
                        onClick={() => setSearchTerm('')}
                    />
                )}
            </div>
                <div className='event-filter-container'>
                    <select value={typeFilter} onChange={handleTypeFilterChange} className='event-filter-select'>
                        <option value='ALL'>Tous</option>
                        <option value='BOURSE'>Bourse</option>
                        <option value='CONCOURS'>Concours</option>
                        <option value='EXPOSITION'>Exposition</option>
                        <option value='AUTRE'>Autres</option>
                    </select>
 
                </div>
            </div>
            <div className='event-body'>
              {filteredEvent.slice(0, visibleEvent).map((event) => (
                <Paper key={event.id} elevation={3} className='event-paper'>
                    <Box padding={2} className='event-box'>
                    <p style={{margin: '0'}}>{formatDate(event.date_debut)} - {formatDate(event.date_fin)}</p>
                      <div className='event-header-title'>
                      <span className='event-header-subtitle' style={{ color: eventTypeColors[event.type_evenement] || "black" }}>
                                        {event.type_evenement}
                     </span> : 
                        <h3 className='event-header-title'>{event.nom}</h3>
                      </div>
                        <p className='event-description'>{event.description}</p>
                        {event.prix && (
                            <span>Prix : {event.prix} € </span>
                        )}
                        <div className='event-bottom'>
                        <ul className='event-bottom-list'>
                            <li className='event-bottom-item'>{event.code_postal}</li>
                            <li className='event-bottom-item'>{event.adresse}, {event.ville}, {event.pays}</li>
                            <li className='event-bottom-item'>{event.organisateur}</li>
                        </ul>
                        </div>     
                    </Box>
                    <div className='event-bottom-container'>
                        <button className='event-btn' onClick={() => window.open(event.lien_reservation, '_blank')}>
                        S'inscrire
                       </button>
                    </div>
                   
                </Paper>
              ))}
              {visibleEvent < filteredEvent.length && (
                <button className='event-btn-add' onClick={handleLoadMore}>Afficher plus</button>
              )}
            </div>
        </div>
    </div>
  )
}

export default Event
