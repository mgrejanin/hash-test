import { fromEvent } from 'rxjs';
import { tap } from 'rxjs/operators';
import './style.scss';
import { HashMask } from './mask';

export class HashTest {
  fractionDigits = 2;
  valor: number;
  form: HTMLFormElement;
  inputs: {
    valor: HTMLInputElement;
    qtdParcelas: HTMLInputElement;
    mdr: HTMLInputElement;
  };

  results: {
    amanha: HTMLSpanElement;
    quinze: HTMLSpanElement;
    trinta: HTMLSpanElement;
    noventa: HTMLSpanElement;
  };

  constructor(private hashMask: HashMask) {
    this.form = <HTMLFormElement>document.getElementById('form');
    this.inputs = {
      valor: <HTMLInputElement>document.getElementById('input_valor'),
      qtdParcelas: <HTMLInputElement>document.getElementById('input_parcelas'),
      mdr: <HTMLInputElement>document.getElementById('input_mdr')
    };
    this.results = {
      amanha: <HTMLSpanElement>document.getElementById('result_amanha'),
      quinze: <HTMLSpanElement>document.getElementById('result_15-dias'),
      trinta: <HTMLSpanElement>document.getElementById('result_30-dias'),
      noventa: <HTMLSpanElement>document.getElementById('result_90-dias')
    };
    fromEvent(this.form, 'input')
      .pipe(tap(() => this.calculate()))
      .subscribe();
  }

  calculate() {
    this.hashMask.setMask(this.inputs.valor);
    if (!this.validForm()) {
      return;
    }

    this.results.amanha.innerText = (155030.1).toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    });
  }

  validForm(): boolean {
    if (
      !this.inputs.valor.validity.valid ||
      !this.inputs.mdr.validity.valid ||
      !this.inputs.qtdParcelas.validity.valid
    ) {
      return false;
    }
    return true;
  }
}

new HashTest(new HashMask());
