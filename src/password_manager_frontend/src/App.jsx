// import { useState } from 'react';
// import { password_manager_backend } from 'declarations/password_manager_backend';
import Auth from './components/auth';
import Dashboard from './components/dashboard';

function App() {
  // const [greeting, setGreeting] = useState('');
  //
  // function handleSubmit(event) {
  //   event.preventDefault();
  //   const name = event.target.elements.name.value;
  //   password_manager_backend.greet(name).then((greeting) => {
  //     setGreeting(greeting);
  //   });
  //   return false;
  // }

  return (
    <main>
      <Auth/>
         <Dashboard/>
    </main>
  );
}

export default App;
