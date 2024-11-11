import { Box, Modal } from '@mui/material';
import React, { useState, useEffect } from 'react';
import './css/detailsmodal.css';
import MaleIcon from '@mui/icons-material/Male';
import FemaleIcon from '@mui/icons-material/Female';
import axios from 'axios';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CalculAge from './CalcukAge';
import formatDate from './formatDate';

export default function DetailsModal({ open, onClose, item }) {
    const [couple, setCouple] = useState([]);
    const [isCoupled, setIsCoupled] = useState(false);
    const [partnerName, setPartnerName] = useState('');

    useEffect(() => {
        if (item) {  
            fetchCouple();
        }
    }, [item]);

    useEffect(() => {
        if (couple.length && item) { 
            chechStatusCoupled();
        }
    }, [couple, item]);

    const fetchCouple = async () => {
        const token = localStorage.getItem('token');
        try {
            const response = await axios.get('http://localhost:5000/api/couple', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setCouple(response.data);
        } catch (err) {
            console.log(err);
        }
    };

    const chechStatusCoupled = () => {
        if (!item || !item.nom) return;  

        const coupled = couple.find(c =>
            c.male_nom === item.nom || c.female_nom === item.nom
        );

        if (coupled) {
            setIsCoupled(true);
            setPartnerName(coupled.male_nom === item.nom ? coupled.female_nom : coupled.male_nom);
        } else {
            setIsCoupled(false);
            setPartnerName('');
        }
    };

    if (!item) return null;

    const isAnimal = item && item.bague;
    const imageUrl = `http://localhost:5000${item.image}`;
    const eventTypeClass = `detailsModal-item-type ${item.type_evenement}`; // Classe dynamique pour le type d'événement

    return (
        <div className='detailsModal'>
            <Modal
                open={open}
                onClose={onClose}
                aria-labelledby="modal-title"
                aria-describedby="modal-description"
                className='detailsModal-modal'
            >
                <Box className='detailsModal-box'>
                    {isAnimal ? (
                        <div className='detailsModal-box-container'>
                            <div className='detailsModal-box-right'>
                                <img src={imageUrl} alt={item.nom} className="detailsModal-animal-image" />
                            </div>
                            <div className='detailsModal-box-left'>
                                <ul className='detailsModal-list'>
                                    <li className='detailsModal-item'>
                                        <h2>{item.nom} {item.sexe === 'MALE' ? <MaleIcon /> : <FemaleIcon />}</h2>
                                    </li>
                                    <li className='detailsModal-item'>
                                        <p>{item.race}</p>
                                    </li>
                                    <li className='detailsModal-item'>
                                        <p>{CalculAge(item.date_naissance)} ans</p>
                                    </li>
                                    <li className='detailsModal-item'>
                                        <p>{item.bague}</p>
                                    </li>
                                    <li className='detailsModal-item'>
                                        <a>
                                            {isCoupled ? (
                                                <div style={{display: 'flex', alignItems: 'center', gap: '0.2rem'}}>
                                                    <FavoriteIcon style={{color:'red'}} /> En couple avec {partnerName}
                                                </div>
                                            ) : (
                                                'Célibataire'
                                            )}
                                        </a>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    ) : (
                        <div className='detailsModal-box-container'>
                            <div className='detailModal-box-right'>
                            {imageUrl && (
                              <img src={imageUrl} alt={item.nom} className="detailsModal-animal-image" />
                            )}
                            </div>
                            <div className='detailsModal-box-left'>
                              <ul className='detailsModal-list'>
                                <li className='detailsModal-item'>{formatDate(item.date_debut)} - {formatDate(item.date_fin)}</li>
                                <li className='detailsModal-item' style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}>
                                  <span className={eventTypeClass}>
                                      {item.type_evenement}
                                  </span>
                                  <h3>{item.nom}</h3>
                                </li>
                                <li className='detailsModal-item'>
                                  <p>{item.description}</p>
                                </li>
                                {item.prix && (
                                   <p>Prix : {item.prix} € </p>
                                )}
                                <li className='detailsModal-item'>
                                  <ul className='detailsModal-list'>
                                    <li>Adresse: {item.adresse}</li>
                                    <li>{item.ville} - {item.code_postal} - {item.pays}</li>
                                    <li>Organisateur: {item.organisateur}</li>
                                  </ul>
                                </li>
                              </ul>
                            </div>
                        </div>
                    )}
                </Box>
            </Modal>
        </div>
    );
}
