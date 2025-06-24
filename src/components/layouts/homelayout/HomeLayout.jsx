import { Outlet } from 'react-router-dom';
import { StyledWrapper } from './styles';

const HomeLayout = () => {
	return (
		<StyledWrapper>
			<Outlet />
		</StyledWrapper>
	);
};

export default HomeLayout;
