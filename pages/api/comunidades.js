import { SiteClient } from 'datocms-client';

export default async function recebedorDeRequests(request, response) {
    if (request.method === 'POST') {
        const TOKEN = '1f9f45565d99a5b5ba354d10a4031b';
        const client = new SiteClient(TOKEN);

        const registroCriado = await client.items.create({
            itemType: '968633',
            ...request.body,
        })

        response.json({
            registroCriado
        });
        return;
    }

    response.status(404).json({
        message: 'Ainda não temos nada no GET, mas no POST tem!'
    })

}