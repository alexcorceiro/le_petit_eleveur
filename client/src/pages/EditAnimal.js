import React,{useState, useEffect} from 'react'
import axios from "axios"
import { useNavigate, useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Navbar from '../components/Navbar';
import { FaCloudUploadAlt } from 'react-icons/fa';
import './css/editanimal.css'

function EditAnimal() {
    const [formData, setFormData] = useState({
        nom: "",
        age:"" , 
        espece: "",
        bague: "", 
        sexage: "",
        image:null ,
        sexage_dpf: null
    })

    const [imgePreviews, setImgePreviews] = useState(null)
    const [pdfPreviews, setPDFPreviews] = useState(null)
    const {id} = useParams()
    const navigate = useNavigate()

    useEffect(() => {
        const fetchPerrucheDetails = async () => {
            const token = localStorage.getItem('token');
            try {
                const response = await axios.get(`http://localhost:5002/api/perruche/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setFormData(response.data);
                setImgePreviews(`http://localhost:5002${response.data.image}`);
                setPDFPreviews(`http://localhost:5002${response.data.sexage_pdf}`);
                console.log(response.data)
            } catch (err) {
                console.error('Erreur lors de la récupération des détails de la perruche:', err.message);
                toast.error('Erreur lors de la récupération des détails de la perruche');
            }
        };

        fetchPerrucheDetails();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, files } = e.target;
        if (files && files[0]) {
            const file = files[0];
            setFormData((prevData) => ({
                ...prevData,
                [name]: file,
            }));

            if (name === 'image') {
                setImgePreviews(URL.createObjectURL(file));
            } else if (name === 'sexage_pdf') {
                setPDFPreviews(URL.createObjectURL(file));
            }
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('token');
        const formDataToSend = new FormData();

        Object.keys(formData).forEach(key => {
            formDataToSend.append(key, formData[key]);
        });

        try {
            await axios.put(`http://localhost:5002/api/perruche/${id}`, formDataToSend, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    Authorization: `Bearer ${token}`,
                },
            });
            toast.success('Perruche modifiée avec succès !');
            navigate('/galerie');  
        } catch (error) {
            console.error('Erreur lors de la modification de la perruche :', error);
            toast.error('Erreur lors de la modification de la perruche');
        }
    };
  return (
    <>
        <ToastContainer/>
        <Navbar/>
        <div className='editanimal'>
            <h1 className='editanimal-title'>Modifier l'animal</h1>
            <div className='editanimal-container'>
              <div className='editanimal-header'>
                <div 
                  className='file-dropzone'
                  onClick={() => document.getElementById('imageInput').click()}>
                <FaCloudUploadAlt className='uplaod-icon'/>
                <p>Glissez-déposez l'image ici ou cliquez pour sélectionner un fichier</p>
                        {imgePreviews && <img src={imgePreviews} alt="Preview" className="editeanimal-file-preview" />}
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
                        className="file-dropzone"
                        onClick={() => document.getElementById('pdfInput').click()}
                    >
                        <FaCloudUploadAlt className="upload-icon" />
                        <p>Glissez-déposez le fichier PDF ici ou cliquez pour sélectionner un fichier</p>
                        {pdfPreviews && <iframe src={pdfPreviews} title="PDF Preview" className="file-preview" frameBorder="0"></iframe>}
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
            <form onSubmit={handleSubmit} className='editanimal-form'>
               <label className='editanimal-label'>Nom</label>
               <input className='editanimal-input' type='text' 
               name="nom" value={formData.nom} onChange={handleChange} />
               <label className='editanimal-label'>Age</label>
               <input className='editanimal-input' type='number' name='age'
                value={formData.age} onChange={handleChange} />
                <label className='editanimal-label'>Espece</label>
                <input className='editanimal-input' type='text' name='espece'
                value={formData.espece} onChange={handleChange} />
                <label className='editanimal-label' >Bague</label>
                <input className='editanimal-input' type='text' 
                value={formData.bague} onChange={handleChange}/>
                <label className='editanimal-label'>sexage</label> 
                <input className='editanimal-input' type='text' name='sexage' 
                value={formData.sexage} onChange={handleChange} />
                <button className='editanimal-btn' type="submit">Modifier</button> 
            </form>
            </div>
            
        </div>
    </>
  )
}

export default EditAnimal
