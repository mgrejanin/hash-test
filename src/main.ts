import { fromEvent } from "rxjs";
import { tap } from "rxjs/operators";
import "./style.scss";

export class HashTest {
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

  constructor() {
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
    fromEvent(this.form, "keyup")
      .pipe(tap(() => this.calculate()))
      .subscribe();
  }

  calculate() {
    console.log(parseInt(this.inputs.valor.value.replace(/\D/g, "")).toFixed(2))
    // console.log(Number(this.inputs.valor.value.replace(/[^0-9.-]+/g,"")));
    this.inputs.valor.value = parseInt(
      this.inputs.valor.value.replace(/\D/g, "")
    )
      .toLocaleString("pt-BR", {
        style: "currency",
        currency: "BRL"
      })
      .toString();

    if (!this.validForm()) {
      return;
    }

    this.results.amanha.innerText = (1550).toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL"
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

new HashTest();
