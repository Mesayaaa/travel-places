export default function Custom500() {
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
      <h1>500 - Server Error</h1>
      <p>Sorry, something went wrong on our end. Please try again later.</p>
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