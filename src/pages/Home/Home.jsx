import style from "./Home.module.css"

//hooks
import { useNavigate, Link } from "react-router-dom"
import { useState } from "react"
import { useFetchDocuments } from "../../hooks/useFetchDocuments"


//components
import PostDetail from "../../components/PostDetail"

const Home = () => {
    const navigate = useNavigate()
    const [query, setQuery] = useState("")
    const { documents: posts, loading } = useFetchDocuments("posts")


    function handleSubmit(e) {
        e.preventDefault();

        if (query) {
            return navigate(`/search?q=${query}`)
        }

    };

    return (
        <div className={style.home}>
            <h1>Vejá nossos posts mais recentes</h1>
            <p>Confira os artigos mais novos da nossa comunidade.</p>
            <form onSubmit={handleSubmit} className={style.search_form}>
                <input
                    type="text"
                    placeholder="Ou busque por tags..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                />
                <button className="btn btn-dark">Pesquisar</button>
            </form>
            <div className={style.posts}>
                {!loading && <p>Carregando...</p>}
                {posts && posts.map((post) => (
                    <PostDetail key={post.id} post={post} />
                ))}
                {posts && posts.length === 0 && (
                    <div className={style.noposts}>
                        <p>Não foram encontrados posts</p>
                        <Link to="/posts/create" className="btn">
                            Criar primeiro post
                        </Link>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Home
