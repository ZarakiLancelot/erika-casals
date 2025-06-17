import { Route, Routes } from 'react-router-dom';
import Home from '../pages/home/Home';
import HomeLayout from '../layouts/homelayout/HomeLayout';
import Servicios from '../pages/Servicios/Servicios';

const Router = () => {
	return (
		<Routes>
			<Route path='/' element={<HomeLayout />}>
				<Route index element={<Home />} />
				<Route path='/servicios' element={<Servicios />} />
			</Route>
		</Routes>
	);
};

export default Router;
