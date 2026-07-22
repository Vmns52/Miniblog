import styles from './EditPost.module.css'

import { useState, useEffect } from 'react';
import { useAuthValue } from '../../context/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import { useUpdateDocument } from '../../hooks/useUpdateDocument';
import { useFetchDocument } from '../../hooks/useFetchDocument';

const EditPost = () => {
    const { id } = useParams();
    const { document: post } = useFetchDocument("posts", id);

    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");
    const [body, setBody] = useState("");
    const [tags, setTags] = useState([]);
    const [formError, setFormError] = useState("");

    useEffect(() => {
        if (post) {
            setTitle(post.title);
            setImage(post.image);
            setBody(post.body);

            const textTags = post.tagsArray.join(", ");
            setTags(textTags);
        }
    }, [post]);

    const { user } = useAuthValue();

    const { updateDocument, response } = useUpdateDocument("posts")

    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        setFormError("");

        //validate image URL
        try {
            new URL(image);
        } catch (error) {
            setFormError("A imagem precisa ser uma URL.");
        }
        //criar array de tags
        // Garante que 'tags' existe e é tratado como string antes do split
        const tagsArray = (tags ? String(tags) : "").split(",").map((tag) => tag.trim().toLowerCase());

        //checar todos os valores
        if (!title || !image || !tags || !body) {
            setFormError("Por favor, preencha todos os campos!");
        }

        if (formError) return;

        const data = {
            title,
            image,
            body,
            tagsArray,
            uid: user.uid,
            createdBy: user.displayName
        }

        updateDocument(id, data);

        //redirect to home page
        navigate("/dashboard");
    }
    return (
        <div className={styles.edit_post}>
            {post && (
                <>
                    <h2>Editando Post: {post?.title}</h2>
                    <p>Altere os campos abaixo conforme necessário:</p>
                    <form onSubmit={handleSubmit}>
                        <label>
                            <span>Título:</span>
                            <input
                                type="text"
                                name="title"
                                required
                                placeholder='Pense em um bom título...'
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                            />
                        </label>
                        <label>
                            <span>URL da Imagem:</span>
                            <input
                                type="text"
                                name="image"
                                required
                                placeholder='Cole a URL da imagem...'
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                            />
                        </label>
                        <p className={styles.preview_title}>Preview da imagem atual:</p>
                        <img className={styles.image_preview} src={post.image} alt={post.title} />
                        <label>
                            <span>Conteúdo:</span>
                            <textarea
                                name="body"
                                required
                                placeholder='Escreva o conteúdo do seu post...'
                                value={body}
                                onChange={(e) => setBody(e.target.value)}
                            />
                        </label>
                        <label>
                            <span>Tags:</span>
                            <input
                                type="text"
                                name="tags"
                                required
                                placeholder='Adicione tags separadas por vírgula...'
                                value={tags}
                                onChange={(e) => setTags(e.target.value.split(','))}
                            />
                        </label>
                        {!response.loading && <button className="btn">Editar</button>}
                        {response.loading && <button className="btn" disabled>Aguarde...</button>}
                        {response.error && <p className="error">{response.error}</p>}
                        {formError && <p className="error">{formError}</p>}

                    </form>
                </>
            )}
        </div>
    )
}


export default EditPost
