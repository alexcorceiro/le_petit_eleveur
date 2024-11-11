import React, { useState, useEffect } from 'react';
import { LinearProgress, Typography, Box } from '@mui/material';
import './css/stockProgress.css';

function StockProgress({ stockData }) {
    const [stockProgress, setStockProgress] = useState([]);

    useEffect(() => {
        if (stockData) {
            const groupedStock = stockData.reduce((acc, item) => {
                const { type_nourriture, quantite_par_sac, nombre_de_sacs } = item;
                const totalQuantity = parseFloat(quantite_par_sac) * nombre_de_sacs;
                acc[type_nourriture] = (acc[type_nourriture] || 0) + totalQuantity;
                return acc;
            }, {});

            const progressData = Object.entries(groupedStock).map(([type, quantity]) => {
                const percentage = Math.min((quantity / 100) * 100, 100); 
                return { type, quantity, percentage };
            });

            setStockProgress(progressData);
        }
    }, [stockData]); 

    return (
        <div className="stockprogress">
            <Box className="stockprogress-container">
                <h2 className="stockprogress-title">Niveau de stock</h2>
                <div className="stockprogress-space">
                    {stockProgress.map(({ type, quantity, percentage }) => (
                        <Box key={type} className="stockprogress-body">
                            <div className="stockprogress-item">
                                <h4 className="stockprogress-item-title">{type}</h4>
                                <span className="stockprogress-item-text">{percentage.toFixed(0)}%</span>
                            </div>
                            <LinearProgress
                                variant="determinate"
                                value={percentage}
                                sx={{
                                    height: 10,
                                    borderRadius: 5,
                                    backgroundColor: '#f0f0f0',
                                    '& .MuiLinearProgress-bar': {
                                        backgroundColor: percentage < 30 ? '#d32f2f' : '#000000', // Black color for progress
                                    },
                                }}
                            />
                        </Box>
                    ))}
                </div>
            </Box>
        </div>
    );
}

export default StockProgress;
