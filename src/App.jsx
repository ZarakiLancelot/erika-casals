import { BrowserRouter } from 'react-router-dom';
import Router from './components/router/Router';
import GlobalStyles from './styles/GlobalStyles';
import ScrollToTop from './components/common/ScrollToTop';

const App = () => {
	return (
		<BrowserRouter>
			<GlobalStyles />
			<ScrollToTop />
			<Router />
		</BrowserRouter>
	);
};

export default App;
