import { Route, Routes } from 'react-router-dom';
import Home from '../pages/home/Home';
import HomeLayout from '../layouts/homelayout/HomeLayout';
import Servicios from '../pages/servicios/Servicios';
import PropiedadesPage from '../../pages/propiedades/PropiedadesPage';
import PropiedadesRentPage from '../../pages/propiedades/PropiedadesRentPage';
import PropertyDetailPage from '../../pages/propiedades/PropertyDetailPage';
import AboutMe from '../pages/aboutme/AboutMe';
import FichaPage from '../../pages/ficha/FichaPage';
import ClientePage from '../../pages/cliente/ClientePage';
import AdminPage from '../../pages/admin/AdminPage';

const Router = () => {
	return (
		<Routes>
			<Route path='/' element={<HomeLayout />}>
				<Route index element={<Home />} />
				<Route path='/servicios' element={<Servicios />} />
				<Route path='/aboutme' element={<AboutMe />} />
				<Route path='/rent' element={<PropiedadesRentPage />} />
				<Route path='/sales' element={<PropiedadesPage />} />
			</Route>
			<Route path='/property/:propertyId' element={<PropertyDetailPage />} />
			{/* Ruta para fichas individuales que envía Inmovilla desde su CRM */}
			<Route path='/ficha/index.php' element={<FichaPage />} />
			<Route path='/ficha' element={<FichaPage />} />
			<Route path='/cliente' element={<ClientePage />} />
			<Route path='/cliente/index.php' element={<ClientePage />} />
			<Route path='/admin' element={<AdminPage />} />
		</Routes>
	);
};

export default Router;
