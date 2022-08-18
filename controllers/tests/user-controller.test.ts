import { User } from "../../models/user-model";
import { Auth } from "../../service/auth";
import { UserController } from "../user-controller";


describe("UserController", () => {
    let userControllerObj: UserController;
    beforeAll(() => {
        userControllerObj = new UserController();
    })

    test("validateRegistrationBodyFields", async () => {
        let errors = await userControllerObj.validateRegistrationBodyFields({});
        expect(errors.length).toBeGreaterThan(0);
        expect(errors[0].key).toBe("body");

        const userData = {
            username: "test",
            password: "Test223312",
            age: 4,
            gender: "male",
            firstName: "Test",
            lastName: "Test"
        }
        const dbUser = await Auth.auth(userData as User);
        
        const getUser = jest.spyOn(User, "findOne");
        errors = await userControllerObj.validateRegistrationBodyFields(userData);

        expect(getUser).toBeCalledTimes(1);
        expect(errors.length).toBeGreaterThan(0);

        await User.destroy({where: {username: userData.username}});
        errors = await userControllerObj.validateRegistrationBodyFields(userData);
        expect(errors.length).toBe(0);
    });

    afterEach(() => {
        jest.clearAllMocks();
    })
})