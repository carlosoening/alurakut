import React from 'react';
import { useRouter } from 'next/router';
import nookies from 'nookies';

export default function LoginPage() {
    const [githubUser, setGithubUser] = React.useState('');
    const router = useRouter();
    const [disabled, setDisabled] = React.useState(true);

    return (
        <main style={{ display: 'flex', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <div className="loginScreen">
                <section className="logoArea">
                    <img src="https://alurakut.vercel.app/logo.svg" />

                    <p><strong>Conecte-se</strong> aos seus amigos e familiares usando recados e mensagens instantâneas</p>
                    <p><strong>Conheça</strong> novas pessoas através de amigos de seus amigos e comunidades</p>
                    <p><strong>Compartilhe</strong> seus vídeos, fotos e paixões em um só lugar</p>
                </section>

                <section className="formArea">
                    <form className="box" onSubmit={async (event) => {
                        event.preventDefault();
                        if (!githubUser) return;

                        const usuarioExiste = await fetch(`https://api.github.com/users/${githubUser}`)
                        .then(async res => {
                            if (res.status === 200) {
                                return true;
                            } else {
                                return false;
                            }
                        });

                        if (!usuarioExiste) {
                            console.log('Usuário não foi encontrado!');
                            return;
                        }

                        await fetch('https://alurakut.vercel.app/api/login', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json'
                            },
                            body: JSON.stringify({ githubUser: githubUser })
                        })
                        .then(async res => {
                            const dados = await res.json();
                            const token = dados.token;
                            nookies.set(null, 'USER_TOKEN', token, {
                                path: '/',
                                maxAge: 86400 * 7
                            });
                            router.push("/"); 
                        })
                    }}>
                        <p>
                            Acesse agora mesmo com seu usuário do <strong>GitHub</strong>!
                        </p>
                        <input 
                            placeholder="Usuário" 
                            value={githubUser} 
                            onChange={(event) => {
                                setGithubUser(event.target.value);
                                if (event.target.value) {
                                    setDisabled(false);
                                } else {
                                    setDisabled(true);
                                }
                            }} 
                        />
                        <button type="submit" disabled={disabled}>
                            Login
                        </button>
                    </form>

                    <footer className="box">
                        <p>
                            Ainda não é membro? <br />
                            <a href="/login">
                                <strong>
                                    ENTRAR JÁ
                                </strong>
                            </a>
                        </p>
                    </footer>
                </section>
                <footer className="footerArea">
                    <p>
                        © 2021 alura.com.br - <a href="/">Sobre o Orkut.br</a> - <a href="/">Centro de segurança</a> - <a href="/">Privacidade</a> - <a href="/">Termos</a> - <a href="/">Contato</a>
                    </p>
                </footer>
            </div>
        </main>
    )
}