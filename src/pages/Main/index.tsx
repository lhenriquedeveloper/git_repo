import { Container, Form, List, DeleteButton } from "./styles";
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from "react-icons/fa";
import { useState, useCallback, useEffect } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";

export default function Main() {
  type Repositorio = {
    name: string;
  };

  const [newRepo, setNewRepo] = useState("");
  const [repositorios, setRepositorios] = useState<Repositorio[]>([]);
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState(false);

  //Buscar

  useEffect(() => {
    const repoStorage = localStorage.getItem("repos");

    if (repoStorage) {
      setRepositorios(JSON.parse(repoStorage));
    }
  }, []);

  //Salvar alterações
  useEffect(() => {
    localStorage.setItem("repos", JSON.stringify(repositorios));
  }, [repositorios]);

  function handleinputChange(e: any) {
    e.preventDefault();
    setNewRepo(e.target.value);
    setAlert(false);
  }

  const handleSubmit: any = useCallback(
    (e: any) => {
      e.preventDefault();
      async function submit() {
        setLoading(true);
        setAlert(false);
        try {
          if (newRepo === "") {
            throw new Error("Você precisa indicar um repositório!");
          }

          const response = await api.get(`repos/${newRepo}`);

          const hasRepo = repositorios.find((repo) => repo.name === newRepo);
          if (hasRepo) {
            throw new Error("Repositório Duplicado!");
          }

          const data: Repositorio = {
            name: response.data.full_name,
          };
          const repositoriosObj = [...repositorios, data];
          setRepositorios(repositoriosObj);
          setNewRepo("");
        } catch (error) {
          setAlert(true);
          console.log(error);
        } finally {
          setLoading(false);
        }
      }
      submit();
    },
    [newRepo, repositorios]
  );

  const handleDelete: any = useCallback(
    (repo: string) => {
      const find = repositorios.filter((r) => r.name !== repo);
      setRepositorios(find);
    },
    [repositorios]
  );

  return (
    <div>
      <Container>
        <h1>
          <FaGithub size={25} />
          Meus Repositórios
        </h1>

        <Form onSubmit={handleSubmit} error={alert}>
          <input
            type="text"
            placeholder="Adicionar Repositórios"
            value={newRepo}
            onChange={handleinputChange}
          />
          <button type="submit" disabled={loading}>
            {loading ? (
              <FaSpinner color="#FFF" size={14} />
            ) : (
              <FaPlus color="#FFF" size={14} />
            )}
          </button>
        </Form>

        <List>
          {repositorios.map((repo) => (
            <li key={repo.name}>
              <span>
                <DeleteButton onClick={() => handleDelete(repo.name)}>
                  <FaTrash size={14}></FaTrash>
                </DeleteButton>
                {repo.name}
              </span>
              <Link to={`/repositorio/${encodeURIComponent(repo.name)}`}>
                <FaBars size={20} />
              </Link>
            </li>
          ))}
        </List>
      </Container>
    </div>
  );
}
