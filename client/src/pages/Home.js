import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { Alert, Card, CardMedia } from '@mui/material';
import './css/home.css';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import { useNavigate } from 'react-router-dom';
import EventTop from '../components/EventTop';
import StockTop from '../components/StockTop';
import SearchBar from '../components/SearchBar';

function Home() {
  const [animaux, setAnimaux] = useState([]);
  const [animauxParRace, setAnimauxRace ] = useState([]);
  const [stock, setStock] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredAnimaux, setFilteredAnimaux] = useState([]); 
  const [grainesAlert, setGrainesAlert] = useState(false);
  const [monthsOfStock, setMonthsOfStock] = useState(0);
  const [randomPerruche, setRandomPerruche] = useState([])
  const navigate = useNavigate()

  
  useEffect(() => {
    fetchAnimaux();
    fetchStock()
  }, []);

  const fetchAnimaux = async () => {
    const token = localStorage.getItem('token')?.trim();
    console.log("Token utilisé :", token);

    try {
      const response = await axios.get('http://localhost:5000/api/animaux', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        withCredentials: true
      });
      setAnimaux(response.data.animaux);  

      setAnimaux(response.data.animaux);

      const groupeParRace = response.data.animaux.reduce((acc, animal) => {
        const race = animal.race;
        if (acc[race]) {
          acc[race] += 1;
        } else {
          acc[race] = 1;
        }
        return acc;
      }, {});

      const animauxParRaceArray = Object.entries(groupeParRace).map(([race, count]) => ({
        race,
        count,
      }));

      setAnimauxRace(animauxParRaceArray);

    } catch (err) {
      console.error('Failed to fetch data:', err);
      setAnimaux([]);
    }
  };


  
  
  

  const fetchStock = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/stock', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      const grainesStock = response.data
        .filter(item => ["graines", "Graine"].includes(item.type_nourriture.toLowerCase()))
        .reduce((total, item) => total + (parseFloat(item.quantite_par_sac) * item.nombre_de_sacs), 0);
  
      const sacs = Math.floor(grainesStock / 20); // 1 sac = 20 kg
  
      setStock(grainesStock);
      setMonthsOfStock(sacs);
  
      if (sacs < 2) {
        setGrainesAlert(true);
      } else {
        setGrainesAlert(false);
      }
    } catch (err) {
      console.error("Erreur lors de la récupération des stocks:", err);
    }
  };
  

 

  const handleClearSearch = () => {
    setSearchTerm('');
    setFilteredAnimaux([])
  };

  const handleCardClick = (id) => {
    navigate(`/animal/${id}`)
  }

  const handleAnimal = () =>{
    navigate('/Galerie')
  }

  const handleStock = () => {
    navigate('/stocks')
  }

  return (
    <div className='home'>
      <Navbar />
      <div className='home-container'>
        <div className='home-header'>
          <Card className="info-card" onClick={handleAnimal}>
            <div className="info-content">
              <h2 className='info-content-title'>Animaux</h2>
              <div className='info-content-container'>
                {animauxParRace.map((item, index) => (
                    <div key={index} className='info-content-space'>
                      <h3 className='info-content-subtitle'>{item.race}</h3>
                      <h4 className='info-content-count'>{item.count}</h4>
                    </div>
                ))}
              </div>
              <button className='info-content-btn' onClick={handleAnimal}>Gerer mes animaux</button>
            </div>
          </Card>

          <Card className="info-card" onClick={handleStock}>
            <div className="info-content">
              <h2 className='info-content-title'>Graines en stock</h2>
              <p className='info-content-text'>{monthsOfStock} mois de stock</p>
              {grainesAlert && (
                <Alert severity="warning">Il faut acheter des graines !</Alert>
              )}
              <button className='info-content-btn'  onClick={handleStock}>Gerer les stock</button>
            </div>
          </Card>
        </div>
        <div className='home-body'>
          <SearchBar/>
        </div>
        <div className='home-bottom'>
          <EventTop/>
          <StockTop/>
        </div>
      </div>
    </div>
  );
}

export default Home;
