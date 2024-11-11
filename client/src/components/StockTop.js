import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { LinearProgress, Typography, Box, Button } from '@mui/material';
import "./css/stocktop.css"

function StockNourriture() {
  const [stock, setStock] = useState([]);

  useEffect(() => {
    const fetchStock = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:5000/api/stock', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const filteredStock = response.data.filter(
          (item) => !item.nom.toLowerCase().includes("mélange") && !item.nom.toLowerCase().includes("graine")
        );

        const groupedStock = filteredStock.reduce((acc, item) => {
          const { nom, quantite_par_sac, nombre_de_sacs } = item;
          const totalQuantity = parseFloat(quantite_par_sac) * nombre_de_sacs;

          if (acc[nom]) {
            acc[nom] += totalQuantity;
          } else {
            acc[nom] = totalQuantity;
          }

          return acc;
        }, {});

        setStock(
          Object.entries(groupedStock).map(([nom, totalQuantity], index) => ({
            id: index, 
            nom,
            totalQuantity,
          }))
        );
      } catch (error) {
        console.error("Erreur lors de la récupération du stock:", error);
      }
    };

    fetchStock();
  }, []);

  return (
    <div className='stocktop'>
        <div className='stocktop-container'>
        <h2 className='stocktop-title'>
        Stock de Nourriture
      </h2>
    
      {stock.map((item) => {
        const stockPercentage = Math.min((item.totalQuantity / 100) * 100, 100); 

        return (
          <Box key={item.id} sx={{ marginBottom: 2 }}>
            <div style={{display: 'flex', width:'100%', alignItems:'center' }}>
               <h4 className='stocktop-subtitle'>
              {item.nom} 
            </h4>
            <Typography variant="body2" style={{margin: '0 1rem'}}>
              {stockPercentage.toFixed(0)}%
            </Typography>
            </div>
           
        <div className='stocktop-container-body'>
            <LinearProgress 
              variant="determinate" 
              value={stockPercentage} 
              sx={{ height: 10, borderRadius: 5, backgroundColor: '#f0f0f0', width: "100%"}}
            />
        </div>
          </Box>
        );
      })}

      <Button variant="contained" color="primary" fullWidth sx={{ marginTop: 2 }}>
        Commander
      </Button>
        </div>
    </div>
  );
}

export default StockNourriture;
