import { useParams } from "react-router-dom";
import { Container, Owner, Loading, BackButton } from "./styles";
import { FaArrowLeft } from "react-icons/fa";
import { useState, useEffect } from "react";
import api from "../../services/api";

export default function Repository() {
  const { repositorio } = useParams();
  const [repo, setRepo] = useState<any>({});
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [repositorioData, issues] = await Promise.all([
        api.get(`/repos/${repositorio}`),
        api.get(`/repos/${repositorio}/issues`, {
          params: {
            state: "open",
            per_page: 5,
          },
        }),
      ]);
      setRepo(repositorioData.data);
      console.log(repo);
      setIssues(issues.data);
      setLoading(false);
    }

    load();
  }, [repositorio]);

  if (loading) {
    return (
      <Loading>
        <h1>Carregando</h1>;
      </Loading>
    );
  } else {
    return (
      <Container>
        <BackButton to={"/"}>
          <FaArrowLeft color="#000" size={30} />
        </BackButton>
        <Owner>
          <img src={repo.owner.avatar_url} alt={repo.owner.login} />
          <h1>{repo.name}</h1>
          <p>{repo.description}</p>
        </Owner>
      </Container>
    );
  }
}
