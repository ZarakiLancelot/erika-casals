import { Route, Routes } from 'react-router-dom';
import Home from '../pages/home/Home';
import HomeLayout from '../layouts/homelayout/HomeLayout';

const Router = () => {
	return (
		<Routes>
			<Route path='/' element={<HomeLayout />}>
				<Route index element={<Home />} />
			</Route>
		</Routes>
	);
};

export default Router;
