import { Container, Form, List } from "./styles";
import { FaGithub, FaPlus, FaSpinner } from "react-icons/fa";
import { useState, useCallback } from "react";
import api from "../../services/api";

export default function Main() {
  const [newRepo, setNewRepo] = useState("");
  const [repositorios, setRepositorios] = useState([""]);
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
          const response = await api.get(`repos/${newRepo}`);
          console.log(response);
          const data: any = {
            name: response.data.full_name,
          };
          console.log(data);
          setRepositorios([...repositorios, data]);
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
              <span>{repo.name}</span>
            </li>
          ))}
        </List>
      </Container>
    </div>
  );
}
