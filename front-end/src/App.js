import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './component/util/Navbar';
import RouteComponent from './component/util/RouteComponent';

function App() {

            if (window.location.pathname === '/getAddress') {
            return (
                <div className="App">
                    <RouteComponent />
                </div>
                );
            }else{
            return (
                <div className="App">
                    <RouteComponent />
                </div>
            );
            }
};

export default App;
