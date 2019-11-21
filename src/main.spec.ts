import { HashTest } from './main';
import { HashMask } from './mask';

function mockElements(instance: HashTest) {
  instance.inputs.mdr = document.createElement('input');
  instance.inputs.mdr.value = '4';
  instance.inputs.qtdParcelas = document.createElement('input');
  instance.inputs.qtdParcelas.value = '3';
  instance.inputs.valor = document.createElement('input');
  instance.inputs.valor.value = 'R$ 150,00';
  instance.results.amanha = document.createElement('span');
  instance.results.quinze = document.createElement('span');
  instance.results.trinta = document.createElement('span');
  instance.results.sessenta = document.createElement('span');
  return instance;
}
describe('main testes', () => {
  let instance: HashTest;

  beforeEach(() => {
    instance = new HashTest(new HashMask());
  });

  it('convert currency val to int val', () => {
    expect(instance.currencyToInt(4800)).toBe(48);
    expect(instance.currencyToInt(480000)).toBe(4800);
  });

  it('calcular com formulário válido', () => {
    instance = mockElements(instance);
    expect(instance.validateForm()).toEqual([
      'R$132.67',
      'R$135.36',
      'R$138.24',
      'R$144.00'
    ]);
  });

  it('formatar para valor monetário', () => {
      expect(instance.currencyFormat(48)).toEqual('R$48.00');
  });
});
