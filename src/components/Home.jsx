import { useNavigate } from 'react-router-dom';
import person from '../assets/Layer 4.png';
import bankLogo from '../assets/Layer 2.png';

const Home = () => {
    const navigate = useNavigate();
  
    const handleGetStarted = () => navigate('/create-account');
  
    return (
      <div className="flex flex-col min-h-70 bg-sky-500">
        {/* Main Content */}
        <main className="flex flex-grow flex-col md:flex-row">
          <img src={person} alt="Friendly representative" className="w-2/4 object-contain max-h-screen" />
          {/* Primary Section */}
          <section className="w-full md:w-2/3 flex flex-col items-center justify-center p-8">
            {/* Call-to-Action Card */}
            <div className="bg-sky-50 p-10 rounded-lg shadow-2xl text-center w-full max-w-lg">
              <img src={bankLogo} alt="Bank Logo" className="w-20 mx-auto mb-4" />
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">
                Discover the freedom to live better with smarter banking.
              </h1>
              <p className="text-gray-600 mb-6">
                Manage your money effortlessly with secure and innovative tools tailored to your needs.
                Empower your financial future and live life on your terms.
              </p>
              <button
                onClick={handleGetStarted}
                className="bg-green-700 hover:bg-green-500 focus:outline-none focus:ring-2 focus:ring-green-300 text-white py-3 px-6 rounded-lg transition duration-300"
                aria-label="Get Started with FutureLink Bank"
              >
                Get Started
              </button>
            </div>
          </section>
        </main>
      </div>
    );
  };
  
export default Home;