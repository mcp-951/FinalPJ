import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from './component/util/Navbar';
import RouteComponent from './component/util/RouteComponent';

function App() {
  return (
    <div className="App">
        <header>
            <Navbar/>
        </header>
        <RouteComponent />
    </div>
  );
}

export default App;
