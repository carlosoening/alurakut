import MainGrid from "../src/components/MainGrid";
import Box from "../src/components/Box";
import { AlurakutMenu } from '../src/lib/AlurakutCommons';
import { ProfileRelationsBoxWrapper } from "../src/components/ProfileRelations";

const ProfileSidebar = (props) => {
	console.log(props);
	return (
		<Box>
			<img src={`https://github.com/${props.githubUser}.png`} style={{ borderRadius: '8px' }} />
		</Box>
	);
}

export default function Home() {
	const githubUser = 'carlosoening';
	const pessoasFavoritas = [
		'juunegreiros',
		'omariosouto',
		'peas',
		'rafaballerini',
		'marcobrunodev',
		'felipefialho'
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
						Bem Vindo
					</Box>
				</div>
				<div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
					<ProfileRelationsBoxWrapper>
						<h2 className="smallTitle">
							Pessoas da Comunidade ({pessoasFavoritas.length})
						</h2>
						<ul>
							{pessoasFavoritas.map(item => {
								return (
									<li>
										<a href={`/users/${item}`} key={item}>
											<img src={`https://github.com/${item}.png`} />
											<span>{item}</span>
										</a>
									</li>
								)
							})}
						</ul>
					</ProfileRelationsBoxWrapper>
				</div>
			</MainGrid>
		</>
	)
}
