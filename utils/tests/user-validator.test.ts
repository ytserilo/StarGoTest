import { User } from "../../models/user-model";
import { UserValidator } from "../user-validator";


const userData = {
    username: "test",
    password: "Test223312",
    age: 4,
    gender: "male",
    firstName: "Test",
    lastName: "Test"
}

describe("User Validator", () => {
    let userValidatorObj: UserValidator;
    beforeAll(() => {
        userValidatorObj = new UserValidator();
    });

    test("validateName", () => {
        expect(userValidatorObj.validateName("te", "firstName")[0]).toBe(false);
        expect(userValidatorObj.validateName("teasd", "firstName")[0]).toBe(true);
        let largeName = "";
        for(let i = 0; i < 60; i++){
            largeName += "a";
        }
        expect(userValidatorObj.validateName(largeName, "firstName")[0]).toBe(true);
        largeName += "asdasd";
        expect(userValidatorObj.validateName(largeName, "firstName")[0]).toBe(false);
    });

    test("validatePassword", () => {
        expect(userValidatorObj.validatePassword("Test")[0]).toBe(false);
        expect(userValidatorObj.validatePassword("Testaadsss")[0]).toBe(false);
        expect(userValidatorObj.validatePassword("Testdsasda132")[0]).toBe(true);
        expect(userValidatorObj.validatePassword("testadasda2312")[0]).toBe(false);
        expect(userValidatorObj.validatePassword("asdasdadsaada")[0]).toBe(false);
    });

    test("validateUsername", async () => {
        await User.create(userData);
        const findOne = jest.spyOn(User, "findOne");
        let validUsername = await userValidatorObj.validateUsername("test");

        expect(findOne).toBeCalledTimes(1);
        expect(validUsername[0]).toBe(false);

        validUsername = await userValidatorObj.validateUsername("Tony");
        expect(validUsername[0]).toBe(true);
        
        await User.destroy({where: {username: userData.username}})
    });

    test("validateAge", () => {
        expect(userValidatorObj.validateAge(0)[0]).toBe(false);
        expect(userValidatorObj.validateAge(-5)[0]).toBe(false);
        expect(userValidatorObj.validateAge(3)[0]).toBe(false);
        expect(userValidatorObj.validateAge(10)[0]).toBe(true);
        expect(userValidatorObj.validateAge(180)[0]).toBe(true);
        expect(userValidatorObj.validateAge(181)[0]).toBe(false);
    });

    test("validateGender", () => {
        expect(userValidatorObj.validateGender("male")[0]).toBe(true);
        expect(userValidatorObj.validateGender("female")[0]).toBe(true);
        expect(userValidatorObj.validateGender("test")[0]).toBe(false);
    });
});