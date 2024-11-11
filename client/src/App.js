import {BrowserRouter, Routes, Route} from "react-router-dom"
import './App.css';
import Login from "./pages/Login";
import Register from "./pages/Register";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import GaleriePer from "./pages/GaleriePer";
import FormAnimal from "./pages/FormAnimal";
import EditAnimal from "./pages/EditAnimal";
import FormCouple from "./pages/FormCouple";
import Stock from "./pages/Stock";
import DetailAnimal from "./pages/DetailAnimal";
import Event from "./pages/Event";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
          <Routes>
            <Route path="/" element={<Login/>} />
            <Route path="/inscription" element={<Register/>} />
            <Route path='/mot_de_passe_oublier' element={<ForgotPassword/> } />
            <Route path='/accueil' element={<Home/>} />
            <Route path="/Galerie" element={<GaleriePer/> } />
            <Route path="/new_animal" element={<FormAnimal/>} />
            <Route path="/animal/:id" element={<EditAnimal/>} />
            <Route path='/new_couple' element={<FormCouple/>} />
            <Route path='/stocks' element={<Stock/>} />
            <Route path='/animal/:id' element={<DetailAnimal/>} />
            <Route path='/event' element={<Event/>} />
          </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
