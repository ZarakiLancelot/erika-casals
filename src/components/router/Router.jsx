import { Route, Routes } from 'react-router-dom';
import Home from '../pages/home/Home';
import HomeLayout from '../layouts/homelayout/HomeLayout';
import Servicios from '../pages/servicios/Servicios';
import PropiedadesPage from '../../pages/propiedades/PropiedadesPage';
import PropiedadesRentPage from '../../pages/propiedades/PropiedadesRentPage';
import AboutMe from '../pages/aboutme/AboutMe';

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
		</Routes>
	);
};

export default Router;
