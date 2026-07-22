import styles from './CreatePost.module.css'

import { useState } from 'react';
import { useAuthValue } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useInsertDocument } from '../../hooks/useInsertDocument';

const CreatePost = () => {
    const [title, setTitle] = useState("");
    const [image, setImage] = useState("");
    const [body, setBody] = useState("");
    const [tags, setTags] = useState([]);
    const [formError, setFormError] = useState("");

    const { user } = useAuthValue();

    const { insertDocument, response } = useInsertDocument("posts")

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

        insertDocument({
            title,
            image,
            body,
            tagsArray,
            uid: user.uid,
            createdBy: user.displayName
        });

        //redirect to home page
        navigate("/");
    }
    return (
        <div className={styles.create_post}>
            <h2>Criar Post</h2>
            <p>Escreva sobre o que deseja compartilhar</p>
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
                {!response.loading && <button className="btn">Cadastrar</button>}
                {response.loading && <button className="btn" disabled>Aguarde...</button>}
                {response.error && <p className="error">{response.error}</p>}
                {formError && <p className="error">{formError}</p>}

            </form>
        </div>
    )
}


export default CreatePost
