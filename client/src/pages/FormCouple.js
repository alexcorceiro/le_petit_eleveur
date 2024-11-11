import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import FavoriteIcon from '@mui/icons-material/Favorite';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './css/formcouple.css';

function FormCouple() {
    const [animaux, setAnimaux] = useState([]);
    const [coupled, setCoupled] = useState([]);
    const [selectedMale, setSelectedMale] = useState('');
    const [selectedFemale, setSelectedFemale] = useState('');
    const [dateCouplage, setDateCouplage] = useState('');

    useEffect(() => {
        fetchAnimaux();
        fetchCoupled();
    }, []);

    const fetchAnimaux = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:5000/api/animaux', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setAnimaux(response.data.animaux);
        } catch (err) {
            console.error('Erreur lors de la récupération des animaux', err);
        }
    };

    const fetchCoupled = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:5000/api/couple', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setCoupled(response.data);
        } catch (err) {
            console.error('Erreur lors de la récupération des couples', err);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');

        if (!selectedMale || !selectedFemale) {
            toast.error("Veuillez sélectionner à la fois un mâle et une femelle pour créer un couple.");
            return;
        }

        try {
            const newCouple = {
                male_id: selectedMale,
                female_id: selectedFemale
            };

            await axios.post('http://localhost:5000/api/couple', newCouple, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            toast.success("Couple créé avec succès !");
            setSelectedMale('');
            setSelectedFemale('');
            setDateCouplage('');
            fetchCoupled();
        } catch (err) {
            console.error('Erreur lors de la création du couple', err);
            toast.error("Erreur lors de la création du couple, veuillez réessayer.");
        }
    };

    const malesDisponible = animaux.filter(animal => 
        animal.sexe === 'MALE' && 
        coupled && !coupled.some(c => c.male_id === animal.id)
    );

    const selectedMaleAnimal = selectedMale ? animaux.find(a => a.id === parseInt(selectedMale)) : null;

    const femalesDisponible = animaux.filter(animal => 
        animal.sexe === 'FEMELLE' && 
        coupled && !coupled.some(c => c.female_id === animal.id) &&
        animal.race === (selectedMaleAnimal ? selectedMaleAnimal.race : '') &&
        animal.espece === (selectedMaleAnimal ? selectedMaleAnimal.espece : '')
    );

    return (
        <div className='formCouple'>
            <Navbar/>
            <ToastContainer />
            <div className='formCouple-container'>
                <div className='formCouple-header'>
                    <FavoriteIcon style={{ color: 'red', fontSize: '8rem' }} />
                    <h2>Mettre en couple</h2>
                </div>
                <div className='formCouple-body'>
                    <form className='formCouple-form' onSubmit={handleSubmit}>
                        <label className='formCouple-label'>Mâle :</label>
                        <select
                            className='formCouple-select'
                            name='male_id'
                            value={selectedMale}
                            onChange={(e) => setSelectedMale(e.target.value)}
                            required
                        >
                            <option value="">Sélectionnez un mâle</option>
                            {malesDisponible.length > 0 ? (
                                malesDisponible.map(animal => (
                                    <option key={animal.id} value={animal.id}>
                                        {animal.nom} - {animal.race}
                                    </option>
                                ))
                            ) : (
                                <option value="">Aucun mâle disponible</option>
                            )}
                        </select>

                        <label className='formCouple-label'>Femelle :</label>
                        <select
                            className='formCouple-select'
                            name="female_id"
                            value={selectedFemale}
                            onChange={(e) => setSelectedFemale(e.target.value)}
                            required
                        >
                            <option value="">Sélectionnez une femelle</option>
                            {femalesDisponible.length > 0 ? (
                                femalesDisponible.map(animal => (
                                    <option key={animal.id} value={animal.id}>
                                        {animal.nom} - {animal.race}
                                    </option>
                                ))
                            ) : (
                                <option value="">Aucune femelle disponible</option>
                            )}
                        </select>
                        <button className='formCouple-btn' type='submit'>Créer Couple</button>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default FormCouple;
