// client/src/pages/Home.tsx

import React from 'react';
import logo from '../assets/logo.jpg';

const Home: React.FC = () => {
    const styles = {
      container: {
        display: 'flex',
        flexDirection: 'column' as const, // Use 'as const' to explicitly type the value
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
      },
      logo: {
        width: 200,
        height: 'auto',
        marginTop: 20,
      },
    };
  
    return (
      <div style={styles.container}>
        <h1>Welcome to our CRM System</h1>
        <img src={logo} alt="CRM Logo" style={styles.logo} />
      </div>
    );
};
  
export default Home;