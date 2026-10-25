export default function Home({ onLogout }) {
  return (
    <div style={{ padding: 40 }}>
      <h1>Welcome to DevCompass</h1>
      {onLogout && <button onClick={onLogout}>Log out</button>}
    </div>
  )
}