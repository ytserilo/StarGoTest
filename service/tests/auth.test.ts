import { User } from "../../models/user-model"
import { Auth } from "../auth"
import { TokenService } from "../jwt-token-service"

const userData = {
    username: "test",
    password: "Test223312",
    age: 4,
    gender: "male",
    firstName: "Test",
    lastName: "Test"
}

describe("Auth", () => {
    afterEach(async () => {
        jest.clearAllMocks();
        await User.destroy({where: {username: userData.username}});
    })
    test("login with correct password and login", async () => {
        await Auth.auth(userData as User);
        const findOne = jest.spyOn(User, "findOne")
        const generateTokens = jest.spyOn(TokenService, "generateTokens");
        const saveTokens = jest.spyOn(TokenService, "saveToken");

        const [message, tokens] = await Auth.login("test", "Test223312");
        expect(findOne).toBeCalledTimes(1);
        expect(generateTokens).toBeCalledTimes(1);
        expect(saveTokens).toBeCalledTimes(1);
        expect(tokens).toBeDefined();
        expect(message.type).toBe("success");
    })

    test("login with uncorrect password login", async () => {
        await Auth.auth(userData as User);
        const generateTokens = jest.spyOn(TokenService, "generateTokens");
        const saveTokens = jest.spyOn(TokenService, "saveToken");
        jest.clearAllMocks();
        
        const [message, _] = await Auth.login("test12", "asdadsasd");
        
        expect(message.type).toBe("error");
        expect(generateTokens).toBeCalledTimes(0);
        expect(saveTokens).toBeCalledTimes(0);
    });

    test("auth", async () => {
        jest.clearAllMocks();
        const generateTokens = jest.spyOn(TokenService, "generateTokens");
        const createUser = jest.spyOn(User, "create");
        const saveToken = jest.spyOn(TokenService, "saveToken");
        
        const [message, _] = await Auth.auth(userData as User);
        expect(generateTokens).toBeCalledTimes(1);
        expect(createUser).toBeCalledTimes(1);
        expect(saveToken).toBeCalledTimes(1);

        expect(message.type).toBe("success");
    });

    
})