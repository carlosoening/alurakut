import React from "react";
import MainGrid from "../src/components/MainGrid";
import Box from "../src/components/Box";
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from "../src/components/ProfileRelations";

const ProfileSidebar = (props) => {
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

export default function Home() {
	const githubUser = 'carlosoening';
	const [comunidades, setComunidades] = React.useState([{
		id: new Date().toISOString(),
		title: 'Eu odeio acordar cedo',
		image: 'https://img10.orkut.br.com/community/52cc4290facd7fa700b897d8a1dc80aa.jpg'
	}]);
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
								id: new Date().toISOString(),
								title: dadosform.get('title'),
								image: dadosform.get('image')
							};
							setComunidades([...comunidades, comunidade]);
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
									name="image"
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
					<ProfileRelationsBoxWrapper>
						<h2 className="smallTitle">
							Comunidades ({comunidades.length})
						</h2>
						<ul>
							{comunidades.map((item, i) => {
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
