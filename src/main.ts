import { fromEvent } from 'rxjs';
import { HashMask } from './mask';
import './style.scss';

export class HashTest {
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
    sessenta: HTMLSpanElement;
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
      sessenta: <HTMLSpanElement>document.getElementById('result_60-dias')
    };
    this.setListeners();
  }

  setListeners() {
    fromEvent(this.form, 'input').subscribe(() => {
      this.validateForm();
    });

    fromEvent(this.inputs.valor, 'input').subscribe(() => {
      this.hashMask.setMask(this.inputs.valor);
    });
  }

  currencyFormat(valor: number) {
    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      minimumFractionDigits: 2
    });
  }

  calcular() {
    let periodos = [1, 15, 30, 60];
    let intervaloDeParcelas: Array<number> = [];
    let mdrParsed = parseFloat(this.inputs.mdr.value);

    for (
      let index = parseInt(this.inputs.qtdParcelas.value);
      index > 0;
      index--
    ) {
      intervaloDeParcelas.push(30 * index);
    }

    // Dividindo valor total pela quantidade de parcelas
    let vlrRecebivel =
      parseInt(this.hashMask.textToNumber(this.inputs.valor.value)) /
      parseInt(this.inputs.qtdParcelas.value);

    // Deduzindo MDR do valor das parcelas
    vlrRecebivel = vlrRecebivel * ((100 - mdrParsed) / 100);
    vlrRecebivel = this.currencyToInt(vlrRecebivel);

    let result = periodos.map(periodo => {
      return this.currencyFormat(
        intervaloDeParcelas.reduce((acc, atual) => {
          acc +=
            (vlrRecebivel * (100 - (mdrParsed / 30) * (atual - periodo))) / 100;
          return acc;
        }, 0)
      );
    });
    Object.keys(this.results).map((key: string, index: number) => {
      this.results[key].innerText = result[index];
    });
    return result;
  }

  currencyToInt(int: number): number {
    let tmp = int.toString().replace(/([0-9]{2})$/g, '.$1');
    if (tmp.length > 6) {
      tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, '.$1,$2');
    }
    return parseFloat(tmp);
  }

  validateForm() {
    if (
      !this.inputs.valor.validity.valid ||
      !this.inputs.mdr.validity.valid ||
      !this.inputs.qtdParcelas.validity.valid
    ) {
      return false;
    }
    return this.calcular();
  }
}

new HashTest(new HashMask());
