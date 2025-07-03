import React from 'react';
import ReactDOM from 'react-dom/client';
import Index from './index';
import { BrowserRouter } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.css';


  const handleOnline = async () => {
    if ("serviceWorker" in navigator && "SyncManager" in window) {
      try {
        const reg = await navigator.serviceWorker.ready;
        await reg.sync.register("post-data");
      } catch (err) {
       
      }
    } else {
      
    }
  };
  // Attach the listener once
  window.addEventListener("online", handleOnline);

const root = ReactDOM.createRoot(document.getElementById('app'));
root.render(
  <BrowserRouter>
    <Index />
  </BrowserRouter>
);


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('Service Worker registered: ', registration);
      })
      .catch(error => {
        console.log('Service Worker registration failed: ', error);
      });
  });
  navigator.serviceWorker.ready.then((registration) => {
  const csrf = document.querySelector('meta[name="csrf-token"]').content;
  registration.active.postMessage({
    type: 'SET_CSRF',
    token: csrf
  });
});
}


