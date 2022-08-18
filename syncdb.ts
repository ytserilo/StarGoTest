import { Token } from './models/token-model';
import { User } from './models/user-model';

(async () => {
    await Token.sync();
    await User.sync();
})()
