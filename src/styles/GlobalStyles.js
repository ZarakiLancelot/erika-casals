import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`

    * {
        margin: 0;
        padding: 0;
        box-sizing: border-box;
    }
    body {
        font-family: 'Montserrat', sans-serif;
        background-color: #F2F1EE;
    }

    a {
        text-decoration: none;
        color: inherit;
    }
`;

export default GlobalStyles;
