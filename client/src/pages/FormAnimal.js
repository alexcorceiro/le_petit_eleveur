import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FaCloudUploadAlt } from 'react-icons/fa';
import './css/formAnimal.css';
import Navbar from '../components/Navbar';

function AjouterPerruche() {
    const [formData, setFormData] = useState({
        nom: '',
        date_naissance: '', 
        espece: '',
        bague: '',
        sexage: '',
        image: null,
        sexage_pdf: null,
    });

    const [imagePreview, setImagePreview] = useState(null);
    const [pdfPreview, setPdfPreview] = useState(null);
    const [dragging, setDragging] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files) {
            handleFileInput(name, files);
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleFileInput = (name, files) => {
        if (files && files[0]) {
            const file = files[0];
            setFormData((prevData) => ({
                ...prevData,
                [name]: file,
            }));

            if (name === 'image') {
                setImagePreview(URL.createObjectURL(file));
            }

            if (name === 'sexage_pdf') {
                setPdfPreview(URL.createObjectURL(file));
            }
        }
    };

    const handleDragOver = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(true);
    };

    const handleDragLeave = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
    };

    const handleDrop = (e, inputName) => {
        e.preventDefault();
        e.stopPropagation();
        setDragging(false);
        const files = e.dataTransfer.files;
        handleFileInput(inputName, files);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const formDataToSend = new FormData();

        for (const key in formData) {
            formDataToSend.append(key, formData[key]);
        }

        try {
            await axios.post('http://localhost:5002/api/perruche', formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('Perruche ajoutée avec succès !');
            navigate('/galerie');  
        } catch (error) {
            console.error('Erreur lors de l\'ajout de la perruche :', error);
            toast.error('Erreur lors de l\'ajout de la perruche');
        }
    };

    return (
        <div className="formAnimal">
            <Navbar />
            <ToastContainer />
            <div className='formAnimal-container'>
                <h1 className='formAnimal-title'>Ajouter une nouvelle Perruche</h1>
                <div className='formAnimal-header'>
                    <div
                        className={`file-dropzone ${dragging ? 'dragging' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, 'image')}
                        onClick={() => document.getElementById('imageInput').click()}
                    >
                        <FaCloudUploadAlt className="upload-icon" />
                        <p>Glissez-déposez l'image ici ou cliquez pour sélectionner un fichier</p>
                        {imagePreview && <img src={imagePreview} alt="Preview" className="file-preview" />}
                        <input
                            id="imageInput"
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                    <div
                        className={`file-dropzone ${dragging ? 'dragging' : ''}`}
                        onDragOver={handleDragOver}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, 'sexage_pdf')}
                        onClick={() => document.getElementById('pdfInput').click()}
                    >
                        <FaCloudUploadAlt className="upload-icon" />
                        <p>Glissez-déposez le fichier PDF ici ou cliquez pour sélectionner un fichier</p>
                        {pdfPreview && <iframe src={pdfPreview} title="PDF Preview" className="file-preview" frameBorder="0"></iframe>}
                        <input
                            id="pdfInput"
                            type="file"
                            name="sexage_pdf"
                            accept=".pdf, image/*"
                            onChange={handleChange}
                            style={{ display: 'none' }}
                        />
                    </div>
                </div>

                <form onSubmit={handleSubmit} className='formAnimal-formulaire'>
                    <label className='formAnimal-label'>Nom</label>
                    <input className='formAnimal-input'
                        type="text"
                        name="nom"
                        value={formData.nom}
                        onChange={handleChange}
                        required
                    />

                    <label className='formAnimal-label'>Date de naissance</label>
                    <input className='formAnimal-input'
                        type="date" 
                        name="date_naissance"
                        value={formData.date_naissance}
                        onChange={handleChange}
                        required
                    />

                    <label className='formAnimal-label'>Espèce</label>
                    <input className='formAnimal-input'
                        type="text"
                        name="espece"
                        value={formData.espece}
                        onChange={handleChange}
                        required
                    />

                    <label className='formAnimal-label'>Bague</label>
                    <input className='formAnimal-input'
                        type="text"
                        name="bague"
                        value={formData.bague}
                        onChange={handleChange}
                        required
                    />

                    <label className='formAnimal-label'>Sexage</label>
                    <input className='formAnimal-input'
                        type="text"
                        name="sexage"
                        value={formData.sexage}
                        onChange={handleChange}
                        required
                    />

                    <button className='formAnimal-btn' type="submit">Ajouter la Perruche</button>
                </form>
            </div>
        </div>
    );
}

export default AjouterPerruche;
