import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import { Box } from '@mui/material';
import TabStock from '../components/TabStock';
import './css/Stock.css';
import StockProgress from '../components/StockProgress';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Stock() {
  const [stockData, setStockData] = useState([]);
  const [newStock, setNewStock] = useState({
    nom: '',
    type_nourriture: '',
    quantite_par_sac: '',
    nombre_de_sacs: 0,
    date_dernier_achat: new Date().toISOString().split('T')[0], 
  });

  useEffect(() => {
   fetchStockData()
  },[])

  const fetchStockData = async() => {
    const token = localStorage.getItem('token');
    try{
      const response = await axios.get('http://localhost:5000/api/stock', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      setStockData(response.data);
    }catch(err){
      toast.error('Erreur lors de la récupération des données du stock. Veuillez réessayer.');
      console.error(err);
    }
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setNewStock((prevStock) => ({
      ...prevStock,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const token = localStorage.getItem('token');

    const payload = {
      ...newStock,
      quantite_par_sac: parseFloat(newStock.quantite_par_sac), 
      nombre_de_sacs: parseInt(newStock.nombre_de_sacs, 10),
    };

    axios
      .post('http://localhost:5000/api/stock', payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        toast.success('Nouveau stock ajouté avec succès!');
        setNewStock({
          nom: '',
          type_nourriture: '',
          quantite_par_sac: '',
          nombre_de_sacs: 0,
          date_dernier_achat: new Date().toISOString().split('T')[0],
        });
        fetchStockData();
      })
      .catch((error) => {
        toast.error("Erreur lors de l'ajout du stock. Veuillez réessayer.");
        console.error('Error adding stock:', error);
      });
  };

  return (
    <div className="stock">
      <Navbar />
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} />
      <div className="stock-container">
        <div className="stock-left">
          <div className="stock-left-top">
            <StockProgress  stockData={stockData} />
          </div>
          <div className="stock-left-bottom">
            <TabStock stockData={stockData} setStockData={setStockData}/>
          </div>
        </div>
        <div className="stock-right">
          <Box className="stock-box">
            <form className="stock-form" onSubmit={handleSubmit}>
              <label className="stock-label">Nom :</label>
              <select name="nom" onChange={handleChange} value={newStock.nom} className="stock-select">
                <option value="">Choisir...</option>
                <option value="Graine de tournesol pour perroquets">Graine de tournesol pour perroquets</option>
                <option value="Pâtée aux œufs">Pâtée aux œufs</option>
                <option value="Pâtée multi-fruit">Pâtée multi-fruit</option>
                <option value="Pâtée d'œuf enrichie">Pâtée d'œuf enrichie</option>
                <option value="Fruit">Fruit</option>
              </select>

              <label className="stock-label">Type de Nourriture :</label>
              <select name="type_nourriture" onChange={handleChange} value={newStock.type_nourriture} className="stock-select">
                <option value="">Choisir...</option>
                <option value="GRAINES">Graines</option>
                <option value="PATEE_OEUF">Pâtée au œuf</option>
                <option value="CROQUETTES">Croquettes</option>
                <option value="FRUIT">Fruit</option>
                <option value="AUTRE">Autre</option>
              </select>

              <label className="stock-label">Quantité par Sac :</label>
              <input
                type="number"
                name="quantite_par_sac"
                onChange={handleChange}
                value={newStock.quantite_par_sac}
                className="stock-input"
                step="0.1"
                min="0"
              />

              <label className="stock-label">Nombre de Sacs :</label>
              <input
                type="number"
                name="nombre_de_sacs"
                onChange={handleChange}
                value={newStock.nombre_de_sacs}
                className="stock-input"
                min="0"
              />

              <label className="stock-label">Date dernier Achat :</label>
              <input
                type="date"
                name="date_dernier_achat"
                onChange={handleChange}
                value={newStock.date_dernier_achat}
                className="stock-input"
              />

              <button type="submit" className="stock-btn">Ajouter</button>
            </form>
          </Box>
        </div>
      </div>
    </div>
  );
}

export default Stock;
