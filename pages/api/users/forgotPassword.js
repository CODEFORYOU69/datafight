import { apiHandler, usersRepo } from 'helpers/api';
import connectDb from '@/helpers/api/database';

export default apiHandler({
    post: forgotPassword,
    post: resetPassword,
    
});

async function forgotPassword(req, res) {
    await connectDb();
    console.log("req.body", req.body)
    await usersRepo.forgotPassword(req.body);
    return res.status(200).json({});
}

async function resetPassword(req, res) {
    await usersRepo.resetPassword(req.body);
    return res.status(200).json({});
}