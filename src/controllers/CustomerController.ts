export default {
    list: () => {
        const customers = [
            {
                id: '1',
                name: 'John Doe',
                email: 'pramtoe@gmail.com',
                phone: '123-456-7890'
            },
            {
                id: '2',
                name: 'John Doe',
                email: 'pramtoe@gmail.com',
                phone: '123-456-7890'
            },
            {
                id: '3',
                name: 'John Doe',
                email: 'pramtoe@gmail.com',
                phone: '123-456-7890'
            }
        ]
        return customers;
    },
    create: ({ body } : {
        body : {
            name: string;
            email: string;
            phone: string;
        }
    }) => {
        return body;
    },
    update: ({ params, body } : {
        params: { id: string };
        body: {
            name?: string;
            email?: string;
            phone?: string;
        }
    }) => {
        return {
            body: body,
            id : params.id,
            message: `Customer with ID ${params.id} updated!`
        }
    },
    remove: ({ params } : {
        params: { id: string };
    }) => {
        return {
            id: params.id,
            message: `Customer with ID ${params.id} deleted!`
        }
    }
}