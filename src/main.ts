import { fromEvent } from "rxjs";
import { HashMask } from "./mask";
import "./style.scss";

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
    noventa: HTMLSpanElement;
  };

  constructor(private hashMask: HashMask) {
    this.form = <HTMLFormElement>document.getElementById("form");
    this.inputs = {
      valor: <HTMLInputElement>document.getElementById("input_valor"),
      qtdParcelas: <HTMLInputElement>document.getElementById("input_parcelas"),
      mdr: <HTMLInputElement>document.getElementById("input_mdr")
    };
    this.results = {
      amanha: <HTMLSpanElement>document.getElementById("result_amanha"),
      quinze: <HTMLSpanElement>document.getElementById("result_15-dias"),
      trinta: <HTMLSpanElement>document.getElementById("result_30-dias"),
      noventa: <HTMLSpanElement>document.getElementById("result_90-dias")
    };
    this.setListeners();
  }

  setListeners() {
    fromEvent(this.form, "input").subscribe(() => {
      this.calculate();
    });

    fromEvent(this.inputs.valor, "input").subscribe(() => {
      this.hashMask.setMask(this.inputs.valor);
    });
  }

  calculate() {
    if (!this.validForm()) {
      return;
    }
    let result = this.calcular();
    Object.keys(this.results).map((key: string, index: number) => {
      this.results[key].innerText = result[index];
    });
  }

  currencyFormat(valor: number) {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
      minimumFractionDigits: 2
    });
  }

  calcular(): Array<string> {
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

    return periodos.map(periodo => {
      return this.currencyFormat(
        intervaloDeParcelas.reduce((acc, atual) => {
          acc +=
            (this.formatReal(vlrRecebivel) *
              (100 - (mdrParsed / 30) * (atual - periodo))) /
            100;
          return acc;
        }, 0)
      );
    });
  }

  formatReal(int: number) {
    let tmp = int.toString().replace(/([0-9]{2})$/g, ".$1");
    if (tmp.length > 6) {
      tmp = tmp.replace(/([0-9]{3}),([0-9]{2}$)/g, ".$1,$2");
    }

    return parseFloat(tmp);
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
