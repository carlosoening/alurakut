import React from "react";
import nookies from 'nookies';
import MainGrid from "../src/components/MainGrid";
import Box from "../src/components/Box";
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from "../src/components/ProfileRelations";
import jwt from 'jsonwebtoken';

function ProfileSidebar(props) {
	return (
		<Box as="aside">
			<img src={`https://github.com/${props.githubUser}.png`} style={{ borderRadius: '8px' }} />
			<hr />
			<p>
				<a className="boxLink" href={`https://github.com/${props.githubUser}`}>
					@{props.githubUser}
				</a>
			</p>
			<hr />
			<AlurakutProfileSidebarMenuDefault />
		</Box>
	);
}

function ProfileRelationsBox(props) {
	return (
		<ProfileRelationsBoxWrapper>
			<h2 className="smallTitle">
				{props.title} ({props.items.length})
			</h2>
			<ul>
				{props.items.map((item, i) => {
					if (i <= 5) {
						return (
							<li key={item.id}>
								<a href={`https://github.com/${item.title}`} target="_blank" key={item.title}>
									<img src={item.imageUrl} />
									<span>{item.title}</span>
								</a>
							</li>
						)
					}
				})}
			</ul>
		</ProfileRelationsBoxWrapper>
	)
}

export default function Home(props) {
	const githubUser = props.githubUser;
	const [comunidades, setComunidades] = React.useState([]);
	const [pessoasFavoritas, setPessoasFavoritas] = React.useState([]);
	const [seguidores, setSeguidores] = React.useState([]);
	const [nomeComunidade, setNomeComunidade] = React.useState('');
	const [urlImagemComunidade, setUrlImagemComunidade] = React.useState('');

	React.useEffect(() => {
		// Obtém os seguidores do usuário da API do Github
		fetch(`https://api.github.com/users/${githubUser}/followers`)
		.then(async res => {
			const data = await res.json();
			if (data) {
				setSeguidores(data.map(d => {
					return {
						id: d.id,
						title: d.login,
						imageUrl: d.avatar_url
					}
				}));
			}
		});
		
		// Obtém os "seguindo" do usuário da API do Github
		fetch(`https://api.github.com/users/${githubUser}/following`)
		.then(async res => {
			const data = await res.json();
			if (data) {
				setPessoasFavoritas(data.map(d => {
					return {
						id: d.id,
						title: d.login,
						imageUrl: d.avatar_url
					}
				}));
			}
		});

		// API GraphQL Dato
		const DATO_TOKEN_READONLY_API = 'f65915e786e48086e4c2a17bf5fa48'
		fetch('https://graphql.datocms.com', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Accept': 'application/json',
				'Authorization': `Bearer ${DATO_TOKEN_READONLY_API}`
			},
			body: JSON.stringify({
				query: `{ 
					allCommunities { 
						id, 
						title, 
						imageUrl, 
						creatorSlug 
					} 
				}`
			})
		})
		.then(async res => {
			const data = (await res.json()).data;
			setComunidades(data.allCommunities);
		});
	}, []);

	return (
		<>
			<AlurakutMenu githubUser={githubUser} />
			<MainGrid>
				<div className="profileArea" style={{ gridArea: 'profileArea' }}>
					<ProfileSidebar githubUser={githubUser} />
				</div>
				<div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
					<Box>
						<h1 className="title">
							Bem Vindo(a)
						</h1>

						<OrkutNostalgicIconSet />
					</Box>

					<Box>
						<h2 className="subTitle">O que você deseja fazer?</h2>
						<form onSubmit={(e) => {
							e.preventDefault();
							if (!nomeComunidade || !urlImagemComunidade) {
								return;
							}
							const comunidade = {
								title: nomeComunidade,
								imageUrl: urlImagemComunidade,
								creatorSlug: githubUser
							};
							
							fetch('/api/comunidades', {
								method: 'POST',
								headers: {
									'Content-Type': 'application/json',
								},
								body: JSON.stringify(comunidade)
							}).then(async (response) => {
								const dados = await response.json();
								console.log(dados.registroCriado);
								const comunidade = dados.registroCriado;
								setComunidades([...comunidades, comunidade]);
								setNomeComunidade('');
								setUrlImagemComunidade('');
							});

						}}>
							<div>
								<input
									placeholder="Qual vai ser o nome da sua comunidade?"
									name="title"
									aria-label="Qual vai ser o nome da sua comunidade?"
									type="text"
									value={nomeComunidade}
									onChange={(event) => {
										setNomeComunidade(event.target.value);
									}}
								/>
							</div>
							<div>
								<input
									placeholder="Coloque uma URL para usarmos de capa"
									name="imageUrl"
									aria-label="Coloque uma URL para usarmos de capa"
									value={urlImagemComunidade}
									onChange={(event) => {
										setUrlImagemComunidade(event.target.value);
									}}
								/>
							</div>
							<button>
								Criar Comunidade
							</button>
						</form>
					</Box>
				</div>
				<div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
					<ProfileRelationsBox title="Seguidores" items={seguidores} />
					<ProfileRelationsBox title="Comunidades" items={comunidades} />
					<ProfileRelationsBox title="Pessoas da Comunidade" items={pessoasFavoritas} />
				</div>
			</MainGrid>
		</>
	)
}

export async function getServerSideProps(context) {
	const cookies = nookies.get(context);
	const token = cookies.USER_TOKEN;

	if (!token) {
		return {
			redirect: {
				destination: '/login',
				permanent: false,
			}
		}
	}

	const { isAuthenticated } = await fetch('https://alurakut.vercel.app/api/auth', {
		headers: {
			Authorization: token
		}
	})
		.then(res => res.json());

	console.log(isAuthenticated);

	if (!isAuthenticated) {
		return {
			redirect: {
				destination: '/login',
				permanent: false,
			}
		}
	}

	const { githubUser } = jwt.decode(token);
	return {
		props: { githubUser }
	}
}
