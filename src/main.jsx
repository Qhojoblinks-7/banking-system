import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { DataProvider } from './components/context/DataContext'; // Updated from UserProvider to DataProvider
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <DataProvider>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </DataProvider>
);
