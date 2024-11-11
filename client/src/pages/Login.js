import React, { useState } from 'react'
import axios from "axios"
import  {useNavigate } from "react-router-dom"
import "./css/login.css"

function Login() {
    const [data,setData] = useState({
        "email": '',
        "password": ''
    })
    const navigate = useNavigate()

    const handleChange = (event) => {
        setData({...data, [event.target.name]: event.target.value })
    }
    
    const handleSubmit = async (event) => {
        event.preventDefault()
        try {
            const response = await axios.post('http://localhost:5000/api/users/login', data, {withCredentials: true} )
            console.log(response)
            const token = response.data.token;
            localStorage.setItem('token', token);
            navigate('/accueil')
        } catch (error) {
            console.error(error)
        }
    }
  return (
    <div className='login'>
      <div className='login-container'>
        <div className='login-header'>
           <img src={`${process.env.PUBLIC_URL}/images/logo.webp`} 
           className='login-img' alt='logo' />
        </div>
         <form className='login-form' onSubmit={handleSubmit}>
            <input type='email' className='login-input' placeholder='Entrez votre identifiant'
            name='email' value={data.email} onChange={handleChange}/>
            <input type='password' className='login-input'  placeholder='Entrez voter mot de passe...'
            name='password' value={data.password} onChange={handleChange}/>
            <button className='login-btn' type='submit'>connexion</button>
         </form>
      </div>
    </div>
  )
}

export default Login
