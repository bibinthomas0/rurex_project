import logo from './logo.svg';
import './App.css';
import Fan from './FanComponent/Fan';
import { ChakraProvider } from '@chakra-ui/react'


function App() {
  return (
    <ChakraProvider>
    <div className="App">
      <Fan/>
    </div>
    </ChakraProvider>
  );
}

export default App;
