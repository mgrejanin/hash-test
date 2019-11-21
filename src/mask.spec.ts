import { HashMask } from "./mask";

describe("main testes", () => {
  let instance: HashMask;

  beforeEach(() => {
    instance = new HashMask();
  });

  it("formatar para valor monetário", () => {
    expect(instance.format("1500050")).toEqual("R$ 15.000,50");
  });

  it("formatar para valor monetário decimal", () => {
    expect(instance.format("15")).toEqual("R$ 0,15");
  });

  it("formatar para valor 0", () => {
    expect(instance.format("")).toEqual("R$ 0,00");
  });
});
