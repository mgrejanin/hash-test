export class HashMask {
  prefix = 'R$ ';
  fixed = true;
  fractionDigits = 2;
  decimalSeparator = ',';
  thousandsSeparator = '.';

  onlyNumber(value: string) {
    let retorno = '';
    for (let i = 0; i < value.length; i++) {
      if (isFinite(parseInt(value[i]))) {
        retorno += value[i];
      }
    }
    return retorno;
  }

  addingPrefix(value: string) {
    return `${this.prefix}${value}`;
  }

  removingPrefix(value: string) {
    return value.replace(this.prefix, '');
  }

  addingCompleterFromStart(value: string, completer: string) {
    while (value.length < this.fractionDigits) {
      value = `${completer}${value}`;
    }
    return value;
  }

  removingCompleterFromStart(value: string, completer: string) {
    while (value[0] === completer) {
      value = value.replace(completer, '');
    }
    return value;
  }

  addingDecimalSeparator(value: string, completer: string, separator: string) {
    let length = value.length - this.fractionDigits;

    let regexpFraction;
    let decimals = '$1';
    let dezenas = completer;
    let character = isFinite(parseInt(completer)) ? 'd' : 'w';

    regexpFraction = `(\\${character}{${this.fractionDigits}})`;
    if (length > 0) {
      regexpFraction = `(\\${character}{${length}})${regexpFraction}`;
      dezenas = decimals;
      decimals = '$2';
    }

    return value.replace(
      new RegExp(regexpFraction),
      `${dezenas}${separator}${decimals}`
    );
  }

  addingHundredsSeparator(value: string) {
    let size = value.length - this.fractionDigits;
    let hundreds = Math.ceil(size / 3);
    let regexpHundreds = '(\\d)';

    let replacement = `${this.decimalSeparator}$${hundreds + 1}`;
    for (let i = hundreds; i !== 0; i--) {
      if (size >= 3) {
        regexpHundreds = `(\\d{3})${regexpHundreds}`;
        size -= 3;
      } else {
        regexpHundreds = `(\\d{${size}})${regexpHundreds}`;
      }

      if (i > 1) {
        replacement = `${this.thousandsSeparator}$${i}${replacement}`;
      } else {
        replacement = `$${i}${replacement}`;
      }
    }

    return value.replace(new RegExp(regexpHundreds), replacement);
  }

  removeSeparator(value: string, separator: string) {
    return value.replace(new RegExp(`\\${separator}`, 'g'), '');
  }

  formatDecimal(value: string, completer: string, separator: string) {
    value = this.addingCompleterFromStart(value, completer);
    value = this.addingDecimalSeparator(value, completer, separator);
    return value;
  }

  textToNumber(input: string) {
    let retorno = input.toString();
    let completer = this.fixed ? '0' : '_';

    if (this.prefix) {
      retorno = this.removingPrefix(retorno);
    }

    retorno = this.removeSeparator(retorno, this.thousandsSeparator);
    retorno = this.removeSeparator(retorno, this.decimalSeparator);

    retorno = this.onlyNumber(retorno);

    retorno = this.removingCompleterFromStart(retorno, completer);

    return retorno || (this.fixed ? '0' : '');
  }

  numberToText(input: string) {
    let retorno = `0${this.decimalSeparator}00`;

    if (!isNaN(parseInt(input))) {
      if (input.length <= this.fractionDigits) {
        retorno = this.formatDecimal(
          input,
          this.fixed ? '0' : '_',
          this.decimalSeparator
        );
      } else {
        retorno = this.addingHundredsSeparator(input);
      }
    }

    if (this.prefix) {
      retorno = this.addingPrefix(retorno);
    }

    return retorno;
  }

  format(value: string) {
    return this.numberToText(this.textToNumber(value));
  }

  formatToNumber(input: string) {
    let retorno = '0';
    let value = this.textToNumber(input);

    if (!isNaN(parseInt(value))) {
      if (value.length <= this.fractionDigits) {
        value = this.formatDecimal(value, '0', '.');
      } else {
        let lengthWithoutDecimals = value.length - this.fractionDigits;
        value = value.replace(
          new RegExp(
            `(\\d{${lengthWithoutDecimals}})(\\d{${this.fractionDigits}})`
          ),
          '$1.$2'
        );
      }

      retorno = value;
    }

    return parseFloat(retorno);
  }

  setMask(element: HTMLInputElement) {
    element.value = this.format(element.value);

    return element;
  }
}
