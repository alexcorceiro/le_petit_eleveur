import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './css/register.css';

function Register() {
  const [formData, setFormData] = useState({
    nom: "",
    prenom: "", 
    email: "",
    mot_de_passe: "",
    role: "eleveur"
  });

  const [confirmPassword, setConfirmPassword] = useState('');

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.mot_de_passe !== confirmPassword) {
      return toast.error("Les mots de passe ne correspondent pas !");
    }
    try {
      const response = await axios.post('http://localhost:5002/api/user/register', formData);
      toast.success('Inscription réussie !');
      navigate('/');
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error.response ? error.response.data : error.message);
      toast.error('Erreur lors de l\'inscription');
    }
  };

  return (
    <div className='register'>
      <ToastContainer />
      <div className='register-container'>
        <h1 className='register-title'>Inscription :</h1>
        <form className='register-form' onSubmit={handleSubmit}>
          <label className='register-label'>Nom :</label>
          <input className='register-input' 
            name='nom' type='text'
            value={formData.nom} onChange={handleChange} required />
          <label className='register-label'>Prénom :</label>
          <input className='register-input' 
            name='prenom' type='text'
            value={formData.prenom} onChange={handleChange} required />
          <label className='register-label'>Email :</label>
          <input className='register-input' 
            name='email' type='email'
            value={formData.email} onChange={handleChange} required />
          <label className='register-label'>Mot de passe :</label>
          <input className='register-input' 
            name='mot_de_passe' type='password'
            value={formData.mot_de_passe} onChange={handleChange} required />
          <label className='register-label'>Confirmez le mot de passe :</label>
          <input className='register-input' 
            type='password'
            value={confirmPassword} onChange={handleConfirmPasswordChange} required />
          <label className='register-label'>Role :</label>
          <select className='register-input' 
            name='role' value={formData.role} onChange={handleChange}>
            <option value="eleveur">Eleveur</option>
            <option value="admin">Admin</option>
          </select>
          <button className='register-btn' type="submit">Créer</button>
        </form>
        <div>
          <p>Vous avez déja un compte : <Link to='/'>cliker ici</Link></p>
        </div>
      </div>
    </div>
  );
}

export default Register;
