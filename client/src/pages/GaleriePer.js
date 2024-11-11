import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import { Box, Card, CardContent, CardMedia, Grid, IconButton, MenuItem, Modal, Pagination, Select, Typography } from '@mui/material';
import './css/galeriePer.css';
import ModeEditIcon from '@mui/icons-material/ModeEdit';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import AddIcon from '@mui/icons-material/Add';
import CakeIcon from '@mui/icons-material/Cake';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import FavoriteBorder from '@mui/icons-material/FavoriteBorder';
import Favorite from '@mui/icons-material/Favorite';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import CalculAge from '../components/CalcukAge';
import VolunteerActivismIcon from '@mui/icons-material/VolunteerActivism';

function GaleriePer() {
  const [AnimalData, setAnimalData] = useState([]);
  const [filteredAnimals, setFilteredAnimals] = useState([]);
  const [couples, setCouples] = useState([]); 
  const [page, setPage] = useState(1);
  const pageSize = 6; 
  const [totalAnimals, setTotalAnimals] = useState(0);
  const [openModal, setOpenModal] = useState(false);
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [sexFilter, setSexFilter] = useState('ALL');
  const [coupleStatusFilter, setCoupleStatusFilter] = useState('ALL');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [speciesFilter, setSpeciesFilter] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const modalStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    outlineColor: 'none',
  };

  const boxStyle = {
    width: 350,
    bgcolor: 'background.paper',
    padding: 2,
    margin: 'auto',
    mt: 5,
    boxShadow: 24,
    p: 4,
    borderRadius: '8px',
  };

  const fetch_data_perruche = async () => {
    const token = localStorage.getItem('token');
    await axios
      .get('http://localhost:5000/api/animaux', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page: page,
          limit: pageSize,
        },
      })
      .then((response) => {
        setAnimalData(response.data.animaux);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const fetchCouple = async () => { 
    const token = localStorage.getItem('token');

    await axios.get('http://localhost:5000/api/couple' , {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    .then((response) => {
      setCouples(response.data)
    })
    .catch((err) => {
      console.error(err)
    })
  }

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleAddAnimal = () => {
    navigate('/new_animal');
  };

  useEffect(() => {
    fetch_data_perruche();
    fetchCouple();
  }, [page, pageSize]);

  const handleOpenModal = (perruche) => {
    setSelectedAnimal(perruche);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedAnimal(null);
  };

  const handleEditAnimal = (id) => {
    navigate(`/animal/${id}`);
  };

  const handleAddCouple = () => {
    navigate('/new_couple');
  };

  const handleDeleteAnimal = async (id) => {
    const token = localStorage.getItem('token');
    const headers = { Authorization: `Bearer ${token}` };

    const couple = couples.find(c => c.male_nom === AnimalData.find(p => p.id === id).nom || c.female_nom === AnimalData.find(p => p.id === id).nom);

    try {
        if (couple) {
            await axios.delete(`http://localhost:5002/api/couple/${couple.couple_id}`, { headers });
        }

        await axios.delete(`http://localhost:5002/api/perruche/${id}`, { headers });

        toast.success('Animal et couple supprimés avec succès');
        fetch_data_perruche(); 
        fetchCouple(); 
        handleCloseModal();
    } catch (err) {
        alert('Erreur lors de la suppression de la perruche ou du couple : ' + err.message);
    }
  };

  useEffect(() => {
    const filtered = AnimalData.filter((animal) => {
      const matchSex = sexFilter === 'ALL' || animal.sexe === sexFilter;
      const matchCoupleStatus = 
        coupleStatusFilter === 'ALL' || 
        (coupleStatusFilter === 'IN_COUPLE' && animal.couple_id) ||
        (coupleStatusFilter === 'SINGLE' && !animal.couple_id);
      const matchSearch = animal.nom.toLowerCase().includes(searchTerm.toLowerCase());
      return matchSex && matchCoupleStatus && matchSearch;
    });

    const sortedAnimal = filtered.sort((a, b) => (sortOrder === 'ASC' ? a.nom.localeCompare(b.nom) : b.nom.localeCompare(a.nom)));
    setFilteredAnimals(sortedAnimal);
    setTotalAnimals(sortedAnimal.length);
  }, [searchTerm, sexFilter, coupleStatusFilter, sortOrder, AnimalData]);

  return (
    <>
      <ToastContainer />
      <Navbar />
      <div className='GaleriePer'>
        <div className='Galerie-container'>
          <div className='Galerie-header'>
            <h2 className='Galerie-title'>Mes Animaux</h2>
            <button className='Galerie-btn' onClick={handleAddAnimal}>
              Nouvel animal<AddIcon />
            </button>
          </div>
          <div className='Galerie-space'> 
            <div className='Galerie-space-seach'>
              <SearchIcon/>
              <input
                type='text'
                className='Galerie-input' 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher un animal..."
              />
              {searchTerm && <CloseIcon onClick={() => setSearchTerm('')} />}
            </div>
            <Select
              value={sexFilter}
              onChange={(e) => setSexFilter(e.target.value)}
              displayEmpty
              inputProps={{ 'aria-label': 'Genre' }}
            >
              <MenuItem value="ALL">Tous</MenuItem>
              <MenuItem value="MALE">Mâle</MenuItem>
              <MenuItem value="FEMELLE">Femelle</MenuItem>
            </Select>
            <Select
              value={coupleStatusFilter}
              onChange={(e) => setCoupleStatusFilter(e.target.value)}
              displayEmpty
              inputProps={{ 'aria-label': 'Statut' }}
            >
              <MenuItem value="ALL">Tous</MenuItem>
              <MenuItem value="IN_COUPLE">En Couple</MenuItem>
              <MenuItem value="SINGLE">Célibataire</MenuItem>
            </Select>
            <Select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              displayEmpty
              inputProps={{ 'aria-label': 'Ordre' }}
            >
              <MenuItem value="ASC">A-Z</MenuItem>
              <MenuItem value="DESC">Z-A</MenuItem>
            </Select>
          </div>
          <div className="Galerie-body">
            <Grid container justifyContent="center" style={{ width: '100%' }}>
              {filteredAnimals.length > 0 ? (
                filteredAnimals.slice((page - 1) * pageSize, page * pageSize).map((animal) => (
                  <Grid item xs={12} sm={6} md={4} key={animal.id}>
                    <Card onClick={() => handleOpenModal(animal)} style={{ minWidth: '25vw', margin: '1rem' }}>
                      <CardMedia
                        component="img"
                        src={`http://localhost:5000${animal.image}`}
                        alt={animal.nom}
                        style={{ height: '20vh', width: '100%', objectFit: 'cover' }}
                      />
                      <CardContent>
                        <Typography variant="h6">{animal.nom}</Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              ) : (
                <Typography variant="h6" style={{ padding: '2rem', textAlign: 'center' }}>
                  Aucune donnée disponible
                </Typography>
              )}
            </Grid>
          </div>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Pagination
              count={Math.ceil(totalAnimals / pageSize)}
              page={page}
              onChange={handleChangePage}
              color="primary"
              variant="outlined"  
              shape="rounded"     
            />
          </div>
        </div>

        <Modal open={openModal} onClose={handleCloseModal} sx={modalStyle}>
          <Box sx={boxStyle}>
            {selectedAnimal && (
              <>
                <CardMedia component="img" src={`http://localhost:5000${selectedAnimal.image}`} alt={selectedAnimal.nom} />
                <div className='Galerie-card'>
                  <div className='Galerie-card-header'>
                    <p className='Galerie-card-title'>{selectedAnimal.nom}</p>
                  </div>
                  <div className='Galerie-card-body'>
                    <div className='Galerie-card-left'>
                      <ul className='Galerie-card-body-list'>
                        <li className='Galerie-card-body-item'><a><CakeIcon /> {CalculAge(selectedAnimal.date_naissance)} ans</a></li>
                        <li className='Galerie-card-body-item'><a>Espece : {selectedAnimal.espece}</a></li>
                        <li className='Galerie-card-body-item'><a>{selectedAnimal.sexe === "male" ? <MaleIcon /> : <FemaleIcon />}</a></li>
                        <li className='Galerie-card-body-item'><a>Bague: {selectedAnimal.bague}</a></li>
                      </ul>
                    </div>
                    <div className='Galerie-card-right'>
                      <a>
                        {couples.some(c => c.male_nom === selectedAnimal.nom || c.female_nom === selectedAnimal.nom)
                          ? `En couple avec ${couples.find(c => c.male_nom === selectedAnimal.nom)?.female_nom || couples.find(c => c.female_nom === selectedAnimal.nom)?.male_nom}`
                          : 'Célibataire'}
                      </a>
                      <IconButton onClick={() => handleAddCouple(selectedAnimal)}>
                        {couples.some(c => c.male_nom === selectedAnimal.nom || c.female_nom === selectedAnimal.nom)
                          ? <Favorite color="error" /> 
                          : <IconButton><VolunteerActivismIcon/></IconButton>}
                      </IconButton>
                    </div>
                  </div>
                  <div className='Galarie-card-bottom'>
                    <button onClick={() => handleEditAnimal(selectedAnimal.id)} className='Galerie-card-btn-edit'><ModeEditIcon />modifier</button>
                    <button className='Galerie-card-btn-sup' onClick={() => handleDeleteAnimal(selectedAnimal.id)}><DeleteOutlineIcon />supprimer</button>
                  </div>
                </div>
              </>
            )}
          </Box>
        </Modal>
      </div>
    </>
  )
}

export default GaleriePer;
