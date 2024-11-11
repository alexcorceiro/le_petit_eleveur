import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FaSort } from 'react-icons/fa';
import { IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import CloseIcon from '@mui/icons-material/Close';
import Paper from '@mui/material/Paper';
import formatDate from '../components/formatDate';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import './css/tabstock.css';

function TabStock({ stockData }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredStock, setFilteredStock] = useState(stockData || []);
    const [sortAsc, setSortAsc] = useState(true);

    useEffect(() => {
        setFilteredStock(stockData);
    }, [stockData]);

    const handleSearch = (event) => {
        const value = event.target.value.toLowerCase();
        setSearchTerm(value);
        
        const filtered = stockData.filter((item) =>
            item.nom.toLowerCase().includes(value) ||
            item.type_nourriture.toLowerCase().includes(value)
        );
        
        setFilteredStock(filtered);
    };

    const handleSortDate = () => {
        const sortedData = [...filteredStock].sort((a, b) => {
            const dateA = new Date(a.dernier_achat);
            const dateB = new Date(b.dernier_achat);
            return sortAsc ? dateA - dateB : dateB - dateA;
        });
        
        setFilteredStock(sortedData);
        setSortAsc(!sortAsc);
    };

    const handleDelete = async (id) => {
      const confirmDelete = window.confirm("Êtes-vous sûr de vouloir supprimer cet élément ?");
      if (!confirmDelete) return; 
  
      const token = localStorage.getItem('token');
      try {
          await axios.delete(`http://localhost:5000/api/stock/${id}`, {
              headers: { Authorization: `Bearer ${token}` },
          });
          
          const updatedStock = filteredStock.filter(stock => stock.id !== id);
          setFilteredStock(updatedStock); 
      } catch (error) {
          console.error("Erreur lors de la suppression :", error);
      }
  };
  

    return (
        <div className="table-stock">
            <div className="table-stock-search">
                <div className="table-stock-search-container">
                    <SearchIcon />
                    <input
                        type="text"
                        className="table-stock-input"
                        placeholder="Rechercher par nom ou type de nourriture..."
                        value={searchTerm}
                        onChange={handleSearch}
                    />
                    {searchTerm && <CloseIcon onClick={() => { setSearchTerm(''); setFilteredStock(stockData); }} />}
                </div>
            </div>

            <TableContainer component={Paper} className="table-wrapper">
                <Table style={{ borderCollapse: 'collapse', width: '100%' }}>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nom</TableCell>
                            <TableCell>Type de Nourriture</TableCell>
                            <TableCell>Quantité par Sac</TableCell>
                            <TableCell>Nombre de Sacs</TableCell>
                            <TableCell>
                                Date dernier Achat
                                <IconButton onClick={handleSortDate}>
                                    <FaSort />
                                </IconButton>
                            </TableCell>
                            <TableCell>Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {filteredStock.map((stocks) => (
                            <TableRow key={stocks._id}>
                                <TableCell>{stocks.nom}</TableCell>
                                <TableCell>{stocks.type_nourriture}</TableCell>
                                <TableCell>{stocks.quantite_par_sac}</TableCell>
                                <TableCell>{stocks.nombre_de_sacs}</TableCell>
                                <TableCell>{formatDate(stocks.dernier_achat)}</TableCell>
                                <TableCell>
                                    <IconButton onClick={() => handleDelete(stocks.id)}>
                                        <DeleteForeverIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default TabStock;
