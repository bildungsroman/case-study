interface AppHeaderProps {
  title?: string;
  subtitle?: string;
}

export default function AppHeader({
  title = "Score GPT",
  subtitle = "Chat and Music Player Interface",
}: AppHeaderProps) {
  return (
    <header className="App-header">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </header>
  );
}
