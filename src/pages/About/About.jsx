
import { Link } from "react-router-dom"
import styles from "./About.module.css"

const About = () => {
    return (
        <div className={styles.about}>
            <h2>About</h2>
            <p>Este projeto consiste em um blog simples construído com React e Firebase.</p>
            <Link to="/posts/create" className='btn'>Criar Post</Link>
        </div>
    )
}

export default About
