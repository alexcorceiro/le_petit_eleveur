import React, { useState, useEffect } from 'react';
import axios from "axios";
import CloseIcon from '@mui/icons-material/Close';
import SearchIcon from '@mui/icons-material/Search';
import "./css/searchbar.css";
import MaleOutlinedIcon from '@mui/icons-material/MaleOutlined';
import FemaleOutlinedIcon from '@mui/icons-material/FemaleOutlined';
import DetailsModal from './DetailsModal';

function SearchBar() {
    const [animaux, setAnimaux] = useState([]);
    const [events, setEvents] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [result, setResult] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null); 
    const [modalOpen, setModalOpen] = useState(false); 

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value);
    };

    useEffect(() => {
        fetchDataAnimaux();
        fetchDataEvents();
    }, []);

    useEffect(() => {
        if (searchTerm) {
            filterResults();
            setShowResults(true);
        } else {
            setShowResults(false);
            setResult([]);
        }
    }, [searchTerm, animaux, events]);

    const fetchDataAnimaux = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:5000/api/animaux', {
                headers: { Authorization: `Bearer ${token}` }
            });
            setAnimaux(response.data.animaux);
        } catch (err) {
            console.log("Erreur lors de la récupération des animaux :", err);
        }
    };

    const fetchDataEvents = async () => {
        try {
            const response = await axios.get('http://localhost:5000/api/event');
            setEvents(response.data);
        } catch (err) {
            console.log("Erreur lors de la récupération des événements :", err);
        }
    };

    const handleClearSearch = () => {
        setSearchTerm('');
        setResult([]);
        setShowResults(false);
    };

    const filterResults = () => {
        const filteredAnimaux = animaux.filter(animal =>
            animal.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            animal.race?.toLowerCase().includes(searchTerm.toLowerCase())
        ).map(animal => ({ ...animal, type: 'animal' }));

        const filteredEvents = events.filter(event =>
            event.nom?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.ville?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            event.type_evenement?.toLowerCase().includes(searchTerm.toLowerCase())
        ).map(event => ({ ...event, type: 'event' }));

        setResult([...filteredAnimaux, ...filteredEvents]);
    };

    const handleResultClick = (item) => {
        setSelectedItem(item);
        setModalOpen(true);
        setShowResults(false); 
    };

    const closeModal = () => {
        setModalOpen(false);
        setSelectedItem(null);
    };

    return (
        <div className="searchbar">
            <div className="searchbar-input-container">
                <SearchIcon className="searchbar-icon" />
                <input
                    type="text"
                    value={searchTerm}
                    onChange={handleSearchChange}
                    placeholder="Chercher un animal ou un événement..."
                    className="searchbar-input"
                />
                {searchTerm && (
                    <CloseIcon
                        className="clear-icon"
                        onClick={handleClearSearch}
                    />
                )}
            </div>
            {showResults && (
                <div className="searchbar-results-container">
                    {result.map((item, index) => (
                        <div key={index} className="searchbar-result-item" onClick={() => handleResultClick(item)}>
                            <img
                                src={item.type === 'animal' ? `http://localhost:5000${item.image}` : item.image_url}
                                alt={item.nom}
                                className="result-item-image"
                            />
                            <div className="result-item-text">
                                <h4 className="result-item-name">
                                    {item.nom} 
                                </h4>

                                {item.type === 'animal' && item.sexe && (
                                    <div className="result-item-gender">
                                        {item.sexe === 'MALE' ? (
                                            <MaleOutlinedIcon className="result-item-gender-icon" />
                                        ) : (
                                            <FemaleOutlinedIcon className="result-item-gender-icon" />
                                        )}
                                    </div>
                                )}

                                {item.type === 'event' && item.type_evenement && (
                                    <p className="result-item-type">
                                        <span className={`event-type-${item.type_evenement.toLowerCase()}`}>
                                            {item.type_evenement}
                                        </span>
                                    </p>
                                )}

                                {(item.race || (item.ville && item.pays)) && (
                                    <p className="result-item-detail">
                                        {item.type === 'animal' ? item.race : `${item.ville}, ${item.pays}`}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}
            <DetailsModal open={modalOpen} onClose={closeModal} item={selectedItem}/>
        </div>
    );
}

export default SearchBar;
