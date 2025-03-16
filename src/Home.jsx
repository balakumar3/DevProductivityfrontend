import './App.css'
import { Link } from 'react-router-dom';

function Home() {
  return (
    <nav className="bg-blue-200 p-6 shadow-lg flex justify-center">
      <ul className="flex flex-col space-y-4">
        <li>
          <Link
            to="/requirement-gathering"
            className="block bg-red-500 text-white text-lg font-semibold py-3 px-6 rounded-lg hover:bg-red-600 transition duration-300"
          >
            Requirement Gathering
          </Link>
        </li>
        <li>
          <Link
            to="/knowledge-transfer"
            className="block bg-green-500 text-white text-lg font-semibold py-3 px-6 rounded-lg hover:bg-green-600 transition duration-300"
          >
            Knowledge Transfer
          </Link>
        </li>
        <li>
          <Link
            to="/collaboration"
            className="block bg-yellow-500 text-white text-lg font-semibold py-3 px-6 rounded-lg hover:bg-yellow-600 transition duration-300"
          >
            Collaboration
          </Link>
        </li>
      </ul>
    </nav>
  );
}

export default Home;
