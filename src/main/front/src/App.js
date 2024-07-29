import logo from './logo.svg';
import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {

    useEffect(() => {
        axios.get('http://localhost:8080/api/hello')
            .then(response => {
                console.log(response.data);
            })
            .catch(error => {
                console.log(error.data);
            });
    }, []); // 빈 배열은 컴포넌트가 처음 렌더링될 때 한 번만 실행됨

    return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
