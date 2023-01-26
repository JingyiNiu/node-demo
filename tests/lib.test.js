const lib = require("../lib");
const db = require("../db");
const mail = require("../mail");

// DOC: https://jestjs.io/docs/using-matchers

// Testing numbers
describe("absolute", () => {
    it("should return a positive number if input is positive", () => {
        const result = lib.absolute(1);
        expect(result).toBe(1);
    });

    it("should return a positive number if input is negative", () => {
        const result = lib.absolute(-1);
        expect(result).toBe(1);
    });

    it("should return 0 if input is 0", () => {
        const result = lib.absolute(0);
        expect(result).toBe(0);
    });
});

// Testing strings
describe("strings", () => {
    it("should return the greeting message", () => {
        const result = lib.greet("Hi");
        // expect(result).toMatch(/Hi/); // Reg expression
        expect(result).toContain("Hi");
    });
});

// Testing arrays
describe("getCurrencies", () => {
    it("should return supported currencies", () => {
        const result = lib.getCurrencies();

        // Too general
        // expect(result).toBeDefined();
        // expect(result).not.toBeNull();

        // Too specific
        // expect(result[0]).toBe("USD");
        // expect(result.length).toBe(3);

        // Proper way
        // DOC: https://jestjs.io/docs/expect
        // expect(result).toContain("USD");
        // expect(result).toContain("AUD");
        // expect(result).toContain("EUR");
        expect(result).toEqual(expect.arrayContaining(["USD", "AUD", "EUR"]));
    });
});

// Testing objects
describe("getProduct", () => {
    it("should return the product with given id", () => {
        const result = lib.getProduct(1);
        // Too specific
        // expect(result).toEqual({ id: 1, price: 10 }); // need to match exactly

        expect(result).toMatchObject({ id: 1, price: 10 });
        expect(result).toHaveProperty("id", 1); // type of value is important
    });
});

// Testing exceptions
describe("registerUser", () => {
    const args = [null, undefined, NaN, "", 0, false];
    it("should throw if username is falsy", () => {
        args.forEach((arg) => {
            expect(() => {
                lib.registerUser(arg);
            }).toThrow();
        });
    });
    it("should return a user object if valid username is passed", () => {
        const result = lib.registerUser("Tom");
        expect(result).toMatchObject({ username: "Tom" });
        expect(result.id).toBeGreaterThan(0);
    });
});

// Mock functions
describe("applyDiscount", () => {
    it("should apply 10% discount if customer has more than 10 points", () => {
        db.getCustomerSync = (customerId) => {
            console.log("Fake reading customer info...");
            return {
                id: customerId,
                points: 20,
            };
        };
        const order = { customerId: 1, totalPrice: 10 };
        lib.applyDiscount(order);
        expect(order.totalPrice).toBe(9);
    });
});

// Mock functions
describe("notifyCustomer", () => {
    it("should send an email to the customer", () => {
        db.getCustomerSync = (customerId) => {
            console.log("Fake reading customer info...");
            return {
                email: "test@email.com",
            };
        };
        let mailSent = false;
        mail.send = (email, message) => {
            mailSent = true;
        };
        lib.notifyCustomer({ customerId: 1 });
        expect(mailSent).toBe(true);
    });
});

// Jest mock function
// const mockFunctuion = jest.fn();
// mockFunctuion.mockReturnValue(1) // Sync
// mockFunctuion.mockRejectedValue(new Error("failed")) // Reject
// mockFunctuion.mockResolvedValue(1); // Async
describe("notifyCustomerJest", () => {
    it("should send an email to the customer", async () => {
        db.getCustomerSync = jest.fn().mockReturnValue({ email: "test@email.com" });
        mail.send = jest.fn();

        lib.notifyCustomer({ customerId: 1 });

        // expect(mail.send).toHaveBeenCalled()
        // expect(mail.send).toHaveBeenCalledWith("test@email.com", "Your order was placed successfully.");
        expect(mail.send.mock.calls[0][0]).toBe("test@email.com");
        expect(mail.send.mock.calls[0][1]).toMatch(/order/);
    });
});
