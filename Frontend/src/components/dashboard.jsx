import React from 'react';
// import '../assets/css/dashboard.css'; // Importar los estilos

const Dashboard = () => {
    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <h1>Bienvenido al Dashboard</h1>
            </header>
            <main className="dashboard-main">
                <p>Esta es la página principal del Dashboard.</p>
                <button className="dashboard-button">Acción</button>
            </main>
        </div>
    );
};

export default Dashboard;