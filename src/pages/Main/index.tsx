import { Container, Form, SubmitButton } from "./styles";
import { FaGithub, FaPlus } from "react-icons/fa";
import { useState } from "react";

export default function Main() {
  const [newRepo, setNewRepo] = useState("");

  function handleinputChange(e: any) {
    setNewRepo(e.target.value);
  }

  return (
    <div>
      <Container>
        <h1>
          <FaGithub size={25} />
          Meus Repositórios
        </h1>

        <Form onSubmit={() => {}}>
          <input
            type="text"
            placeholder="Adicionar Repositórios"
            value={newRepo}
            onChange={handleinputChange}
          />
          <SubmitButton>
            <FaPlus color="#FFF" size={14} />
          </SubmitButton>
        </Form>
      </Container>
    </div>
  );
}
