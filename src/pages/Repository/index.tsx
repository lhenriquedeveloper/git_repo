export default function Repository({ match }: { match: any }) {
  return (
    <h1 style={{ color: "#fff" }}>{decodeURIComponent(match.params.repo)};</h1>
  );
}
