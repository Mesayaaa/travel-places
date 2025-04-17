export default function Custom404() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      height: '100vh',
      textAlign: 'center',
      padding: '20px'
    }}>
      <h1>404 - Page Not Found</h1>
      <p>The page you're looking for doesn't exist or has been moved.</p>
      <a href="/" style={{
        marginTop: '20px',
        padding: '10px 20px',
        backgroundColor: '#FF5A5F',
        color: 'white',
        textDecoration: 'none',
        borderRadius: '4px'
      }}>Go to Homepage</a>
    </div>
  );
} 