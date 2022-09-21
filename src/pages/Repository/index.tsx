import { useParams } from "react-router-dom";
import {
  Container,
  Owner,
  Loading,
  BackButton,
  IssuesList,
  PageActions,
  FilterList,
} from "./styles";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import { useState, useEffect } from "react";
import api from "../../services/api";

type Issues = {
  id: number;
  user: any;
  html_url: any;
  title: any;
  labels: any;
};

export default function Repository() {
  const { repositorio } = useParams();
  const [repo, setRepo] = useState<any>({});
  const [issues, setIssues] = useState<Issues[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState([
    { state: "all", label: "Todas", active: true },
    { state: "open", label: "Abertas", active: false },
    { state: "closed", label: "Fechadas", active: false },
  ]);
  const [filterIndex, setFilterIndex] = useState(0);

  useEffect(() => {
    async function load() {
      const [repositorioData, issues] = await Promise.all([
        api.get(`/repos/${repositorio}`),
        api.get(`/repos/${repositorio}/issues`, {
          params: {
            state: filter.find((f) => f.active)?.state,
            per_page: 5,
          },
        }),
      ]);
      setRepo(repositorioData.data);
      setIssues(issues.data);
      setLoading(false);
    }

    load();
  }, []);

  useEffect(() => {
    async function loadIssue() {
      const response = await api.get(`/repos/${repositorio}/issues`, {
        params: {
          state: filter[filterIndex].state,
          page,
          per_page: 5,
        },
      });

      setIssues(response.data);
    }
    loadIssue();
  }, [page, filterIndex, filter]);

  function handlePage(action: string) {
    setPage(action === "back" ? page - 1 : page + 1);
  }

  function handleFilter(index: number) {
    setFilterIndex(index);
  }

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
        <FilterList active={filterIndex}>
          {filter.map((filter, index) => (
            <button
              type="button"
              key={filter.label}
              onClick={() => handleFilter(index)}
            >
              {filter.label}
            </button>
          ))}
        </FilterList>
        <IssuesList>
          {issues.map((issue) => (
            <li key={String(issue.id)}>
              <img src={issue.user.avatar_url} alt={issue.user.login} />

              <div>
                <strong>
                  <a href={issue.html_url}>{issue.title}</a>

                  {issue.labels.map((label: { id: number; name: string }) => (
                    <span key={String(label.id)}>{label.name}</span>
                  ))}
                </strong>
                <p>{issue.user.login}</p>
              </div>
            </li>
          ))}
        </IssuesList>
        <PageActions>
          <button
            type="button"
            onClick={() => handlePage("back")}
            disabled={page < 2}
          >
            <FaArrowLeft color="#fff" size={18} />
          </button>
          <button type="button" onClick={() => handlePage("next")}>
            <FaArrowRight color="#fff" size={18} />
          </button>
        </PageActions>
      </Container>
    );
  }
}
