import { Container, Form, List, DeleteButton } from "./styles";
import { FaGithub, FaPlus, FaSpinner, FaBars, FaTrash } from "react-icons/fa";
import { useState, useCallback } from "react";
import api from "../../services/api";

export default function Main() {
  type Repositorio = {
    name: string;
  };

  const [newRepo, setNewRepo] = useState("");
  const [repositorios, setRepositorios] = useState<Repositorio[]>([]);
  const [loading, setLoading] = useState(false);
  function handleinputChange(e: any) {
    e.preventDefault();
    setNewRepo(e.target.value);
  }

  const handleSubmit: any = useCallback(
    (e: any) => {
      e.preventDefault();
      async function submit() {
        setLoading(true);
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

        <Form onSubmit={handleSubmit}>
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
              <a href="#">
                <FaBars size={20} />
              </a>
            </li>
          ))}
        </List>
      </Container>
    </div>
  );
}
