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
				{/* {seguidores.map((item, i) => {
				if (i <= 5) {
					return (
						<li key={item.id}>
							<a href={`/users/${item.title}`} key={item.title}>
								<img src={item.image} />
								<span>{item.title}</span>
							</a>
						</li>
					)
				}
			})} */}
			</ul>
		</ProfileRelationsBoxWrapper>
	)
}

export default function Home(props) {
	const githubUser = props.githubUser;
	const [comunidades, setComunidades] = React.useState([]);
	const pessoasFavoritas = [
		'juunegreiros',
		'omariosouto',
		'peas',
		'rafaballerini',
		'marcobrunodev',
		'felipefialho',
		'felipefialho',
		'felipefialho',
	];

	const [seguidores, setSeguidores] = React.useState([]);

	React.useEffect(() => {
		fetch('https://api.github.com/users/peas/followers')
		.then(respostaDoServidor => {
			return respostaDoServidor.json();
		})
		.then(respostaCompleta => {
			setSeguidores(respostaCompleta);
		});

		const DATO_TOKEN_READONLY_API = 'f65915e786e48086e4c2a17bf5fa48'
		// API GraphQL Dato
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
		.then(res => res.json())
		.then((res) => {
			console.log(res);
			setComunidades(res.data.allCommunities)
		})
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
							const dadosform = new FormData(e.target);
							const comunidade = {
								title: dadosform.get('title'),
								imageUrl: dadosform.get('imageUrl'),
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
							})
							
						}}>
							<div>
								<input
									placeholder="Qual vai ser o nome da sua comunidade?"
									name="title"
									aria-label="Qual vai ser o nome da sua comunidade?"
									type="text"
								/>
							</div>
							<div>
								<input
									placeholder="Coloque uma URL para usarmos de capa"
									name="imageUrl"
									aria-label="Coloque uma URL para usarmos de capa"
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
					<ProfileRelationsBoxWrapper>
						<h2 className="smallTitle">
							Comunidades ({comunidades.length})
						</h2>
						<ul>
							{comunidades.map((item, i) => {
								if (i <= 5) {
									return (
										<li key={item.id}>
											<a href={`/communities/${item.id}`} key={item.id}>
												<img src={item.imageUrl} />
												<span>{item.title}</span>
											</a>
										</li>
									)
								}
							})}
						</ul>
					</ProfileRelationsBoxWrapper>
					<ProfileRelationsBoxWrapper>
						<h2 className="smallTitle">
							Pessoas da Comunidade ({pessoasFavoritas.length})
						</h2>
						<ul>
							{pessoasFavoritas.map((item, i) => {
								if (i <= 5) {
									return (
										<li key={item}>
											<a href={`/users/${item}`} key={item}>
												<img src={`https://github.com/${item}.png`} />
												<span>{item}</span>
											</a>
										</li>
									)
								}
							})}
						</ul>
					</ProfileRelationsBoxWrapper>
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
	
	const { githubUser } = jwt.decode(token);
	return {
		props: { githubUser }
	}
}
