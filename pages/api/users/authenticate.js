import { apiHandler, usersRepo } from 'helpers/api';
import connectDb from '@/helpers/api/database';

export default apiHandler({
    post: authenticate
});

async function authenticate(req, res) {
    await connectDb(); // Assurez-vous que vous êtes connecté à MongoDB

    const user = await usersRepo.authenticate(req.body);
    return res.status(200).json(user);
}
