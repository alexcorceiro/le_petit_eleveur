import React, { useState } from 'react';
import { FaBars, FaTimes, FaSignOutAlt } from 'react-icons/fa';
import { Menu, MenuItem, IconButton } from '@mui/material';
import './css/navbar.css';
import { useNavigate } from 'react-router-dom';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import PetsOutlinedIcon from '@mui/icons-material/PetsOutlined';
import InventoryOutlinedIcon from '@mui/icons-material/InventoryOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';

export default function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);
    const [anchorEl, setAnchorEl] = useState(null);

    const navigate = useNavigate()

    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        navigate('/')
        handleMenuClose();
        localStorage.clear();
    };

    const handleHome = () => {
        navigate('/accueil')
    }

    const open = Boolean(anchorEl);

    return (
        <nav className="navbar">
            <div className="navbar-container">
                <div className="navbar-left">
                    <div className={`navbar-hamburger ${menuOpen ? 'open' : ''}`} onClick={toggleMenu}>
                        <div className="hamburger-icon">
                            {menuOpen ? <FaTimes /> : <FaBars />}
                        </div>
                    </div>
                    <div className="navbar-logo">
                        <h2 onClick={handleHome}>Le Petit Eleveur</h2>
                    </div>
                </div>
                <div className="navbar-right">
                    <IconButton
                        aria-label="account of current user"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenuClick}
                        color="inherit"
                    >
                        <FaSignOutAlt />
                    </IconButton>
                    <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        transformOrigin={{
                            vertical: 'top',
                            horizontal: 'right',
                        }}
                        open={open}
                        onClose={handleMenuClose}
                    >
                        <MenuItem >profile</MenuItem>
                        <MenuItem onClick={handleLogout}>Déconnexion</MenuItem>
                    </Menu>
                </div>
            </div>

            <div className={`navbar-menu ${menuOpen ? 'open' : ''}`}>
                <a className='nav-item' href="/accueil"><HomeOutlinedIcon/>Accueil</a>
                <a className='nav-item' href="/Galerie"><PetsOutlinedIcon/>Mes Animaux</a>
                <a  className='nav-item' href="/stocks"><Inventory2OutlinedIcon/>Mes stocks</a>
                <a className='nav-item' href="/event"> <InventoryOutlinedIcon/>Evenement</a>
            </div>
        </nav>
    );
}
